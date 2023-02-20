import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../database";
import { authenticatedProcedure, trpc } from "../trpc";
import {
  applicationStatusSchema,
  checkPersonPermission,
  checkUserPermissionToUpdatePersonApplication,
  genderSchema,
  getCurrentSession,
  getGroup,
  getPersonUserFromAccountId,
  getSchoolUserFromAccountId,
  housingStatusSchema,
  identifierSchema,
  resetSchoolHousingSessionData,
  resetSchoolSessionData,
} from "./utils";

const submitPersonApplicationBaseSchema = z.object({
  eng_certificate: z.string().optional(),
  experience_mun: z.string().optional(),
  experience_other: z.string().optional(),
  housing_is_available: z.boolean(),
  housing_address_street: z.string().optional(),
  housing_address_number: z.string().optional(),
  housing_address_postal: z.string().optional(),
  housing_phone_number: z.string().optional(),
  housing_pets: z.string().optional(),
  housing_gender_preference: genderSchema.optional().nullable(),
});

const applicationsRouter = trpc.router({
  /**
   * Submit an application for the current user which is a student
   * in any of the high-schools participating in the current session.
   */
  submitHighSchoolApplication: authenticatedProcedure
    .input(
      submitPersonApplicationBaseSchema.and(
        z.object({
          school_id: identifierSchema,
          school_year: z.number().int().optional(),
          school_section: z.string().optional(),
          requested_group_id: identifierSchema,
          requested_role_id: identifierSchema.optional(),
        })
      )
    )
    .mutation(async ({ input, ctx }) => {
      const currentSession = await getCurrentSession();
      const person = await getPersonUserFromAccountId(ctx.userId);

      if (person.applications.find((a) => a.session_id === currentSession.id))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already applied for this session.",
        });

      const existingSchoolApplication =
        await prisma.schoolApplication.findUnique({
          where: {
            school_id_session_id: {
              school_id: input.school_id,
              session_id: currentSession.id,
            },
          },
        });
      if (!existingSchoolApplication)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This school has not applied for this session yet.",
        });
      if (existingSchoolApplication.status_application !== "ACCEPTED")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This school has not been accepted to this session yet.",
        });

      return await prisma.personApplication.create({
        data: {
          ...input,
          person_id: person.id,
          session_id: currentSession.id,
          status_application: "HOLD",
          status_housing: existingSchoolApplication.status_housing,
        },
      });
    }),

  /**
   * Submit an application for the current user which is an undergraduate
   * student and wishes to participate as an HSC member.
   */
  submitUndergraduateApplication: authenticatedProcedure
    .input(
      submitPersonApplicationBaseSchema.and(
        z.object({
          city: z.string(),
          university: z.string(),
          is_resident: z.boolean(),
          housing_is_required: z.boolean(),
        })
      )
    )
    .mutation(async ({ input, ctx }) => {
      const currentSession = await getCurrentSession();
      const person = await getPersonUserFromAccountId(ctx.userId);

      if (person.applications.find((a) => a.session_id === currentSession.id))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already applied for this session.",
        });

      return await prisma.personApplication.create({
        data: {
          ...input,
          person_id: person.id,
          session_id: currentSession.id,
          status_application: "HOLD",
          status_housing: input.housing_is_required ? "HOLD" : "NOT_REQUIRED",
          requested_group_id: (await getGroup("hsc")).id,
        },
      });
    }),

  /**
   * Submit an application on behalf of the school.
   */
  submitSchoolApplication: authenticatedProcedure
    .input(
      z.object({
        contact_name: z.string(),
        contact_surname: z.string(),
        contact_email: z.string().email(),
        contact_title: z.string(),
        housing_is_required: z.boolean(),
        experience_mun: z.string().optional(),
        communications: z.string().optional(),
        assignments: z.array(
          z.object({
            group_id: identifierSchema,
            n_requested: z.number().int().min(0),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const currentSession = await getCurrentSession();
      const school = await getSchoolUserFromAccountId(ctx.userId);

      if (school.applications.find((a) => a.session_id === currentSession.id))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already applied for this session.",
        });

      const application = await prisma.schoolApplication.create({
        data: {
          ...input,
          school_id: school.id,
          session_id: currentSession.id,
          status_application: "HOLD",
          status_housing: input.housing_is_required ? "HOLD" : "NOT_REQUIRED",
        },
      });

      const assignments = await prisma.schoolGroupAssignment.createMany({
        data: input.assignments,
      });

      return { application, assignments };
    }),

  /**
   * Get summary statistics of the application for the current session.
   */
  getStats: authenticatedProcedure.query(async ({ ctx }) => {
    await checkPersonPermission(ctx.userId, { resourceName: "application" });

    const currentSession = await getCurrentSession();
    const hscGroup = await getGroup("hsc");

    const confirmedHscApplications = await prisma.personApplication.count({
      where: { session_id: currentSession.id, confirmed_group_id: hscGroup.id },
    });

    const schoolGroupAssignments = await prisma.schoolGroupAssignment.groupBy({
      by: ["group_id"],
      _sum: {
        n_confirmed: true,
      },
      where: {
        session_id: currentSession.id,
        school: {
          applications: {
            some: {
              session_id: currentSession.id,
              status_application: "ACCEPTED",
            },
          },
        },
      },
    });

    return [
      ...schoolGroupAssignments.map((sga) => ({
        group_id: sga.group_id,
        n_confirmed: sga._sum,
      })),
      {
        group_id: hscGroup.id,
        n_confirmed: confirmedHscApplications,
      },
    ];
  }),

  /**
   * Update application from a school (this is handled by the team,
   * not by school users themselves).
   */
  updateSchoolApplication: authenticatedProcedure
    .input(
      z.object({
        school_id: identifierSchema,
        status_application: applicationStatusSchema.optional(),
        status_housing: housingStatusSchema.optional(),
        assignments: z
          .array(
            z.object({
              group_id: identifierSchema,
              n_confirmed: z.number().int().min(0),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx.userId, { resourceName: "application" });

      const currentSession = await getCurrentSession();

      if (input.status_housing)
        resetSchoolHousingSessionData(input.school_id, input.status_housing);

      if (input.status_application)
        resetSchoolSessionData(input.school_id, input.status_application);

      for (let assignment of input.assignments ?? []) {
        await prisma.schoolGroupAssignment.update({
          where: {
            school_id_session_id_group_id: {
              group_id: assignment.group_id,
              school_id: input.school_id,
              session_id: currentSession.id,
            },
          },
          data: { n_confirmed: assignment.n_confirmed },
        });
      }

      const application = await prisma.schoolApplication.findUnique({
        where: {
          school_id_session_id: {
            school_id: input.school_id,
            session_id: currentSession.id,
          },
        },
      });
      if (!application)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This school has not applied for this session yet.",
        });

      return application;
    }),

  /**
   * Update application from a person (this is handled by the team or
   * by school users while accepting delegates).
   */
  updatePersonApplication: authenticatedProcedure
    .input(
      z.object({
        person_id: identifierSchema,
        status_application: applicationStatusSchema.optional(),
        status_housing: housingStatusSchema.optional(),
        requested_group_id: identifierSchema.optional(),
        requested_role_id: identifierSchema.optional(),
        confirmed_group_id: identifierSchema.optional(),
        confirmed_role_id: identifierSchema.optional(),
        delegation_id: identifierSchema.optional(),
        committee_id: identifierSchema.optional(),
        is_ambassador: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const delegateGroup = await getGroup("delegate");

      // schools can only modify delegates' status
      if (input.requested_group_id === delegateGroup.id)
        await checkUserPermissionToUpdatePersonApplication(
          ctx.userId,
          input.person_id,
          "application"
        );
      else
        await checkPersonPermission(ctx.userId, {
          resourceName: "application",
        });

      const currentSession = await getCurrentSession();

      const application = await prisma.personApplication.findUnique({
        where: {
          person_id_session_id: {
            person_id: input.person_id,
            session_id: currentSession.id,
          },
        },
      });
      if (!application)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This person has not applied for this session yet.",
        });

      const isReassigned =
        input.confirmed_group_id !== application.confirmed_group_id;

      return await prisma.personApplication.update({
        where: {
          person_id_session_id: {
            person_id: input.person_id,
            session_id: currentSession.id,
          },
        },
        data: {
          ...input,
          committee_id: isReassigned
            ? null
            : input.committee_id ?? application.committee_id,
          delegation_id: isReassigned
            ? null
            : input.delegation_id ?? application.delegation_id,
          is_ambassador: isReassigned
            ? false
            : input.is_ambassador ?? application.is_ambassador,
        },
      });
    }),
});

export default applicationsRouter;
