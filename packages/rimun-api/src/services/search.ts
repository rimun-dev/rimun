import { z } from "zod";
import { authenticatedProcedure, trpc } from "../trpc";
import {
  applicationStatusSchema,
  checkPersonPermission,
  exclude,
  genderSchema,
  getCurrentSession,
  housingStatusSchema,
  identifierSchema,
} from "./utils";

const searchInputBaseSchema = z.object({
  limit: z.number().int().optional().default(10),
  cursor: z
    .date()
    .optional()
    .default(() => new Date()),
});

const searchTextQueryBaseSchema = searchInputBaseSchema.extend({
  query: z.string().optional(),
});

const searchRouter = trpc.router({
  /**
   * Search within persons with an application for the current session.
   */
  searchPersons: trpc.procedure
    .input(
      searchTextQueryBaseSchema.extend({
        filters: z.object({
          application: z
            .object({
              requested_group_id: identifierSchema.optional(),
              requested_role_id: identifierSchema.optional(),
              confirmed_group_id: identifierSchema.optional(),
              confirmed_role_id: identifierSchema.optional(),
              committee_id: identifierSchema.optional(),
              school_id: identifierSchema.optional(),
              status_application: applicationStatusSchema.optional(),
              status_housing: housingStatusSchema.optional(),
              housing_is_available: z.boolean().optional(),
              confirmed_group: z
                .object({ name: z.string().optional() })
                .optional(),
              confirmed_role: z
                .object({
                  name: z.string().optional(),
                  forum: z
                    .object({
                      acronym: z.string().optional(),
                    })
                    .optional(),
                })
                .optional(),
              requested_group: z
                .object({ name: z.string().optional() })
                .optional(),
            })
            .optional(),
          person: z
            .object({
              country_id: identifierSchema.optional(),
              gender: genderSchema.optional(),
            })
            .optional(),
        }),
      })
    )
    .query(async ({ input, ctx }) => {
      const currentSession = await getCurrentSession(ctx);

      const result = await ctx.prisma.personApplication.findMany({
        where: {
          ...input.filters.application,
          created_at: { lt: input.cursor },
          session_id: currentSession.id,
          person: {
            ...input.filters.person,
            full_name: input.query
              ? { contains: input.query, mode: "insensitive" }
              : undefined,
          },
        },
        include: {
          person: {
            include: {
              account: true,
              country: true,
              guest_matches: {
                where: { session_id: currentSession.id },
                include: { host: true },
              },
              host_matches: {
                where: { session_id: currentSession.id },
                include: { guest: true },
              },
            },
          },
          school: { include: { country: true } },
          confirmed_group: true,
          requested_group: true,
          confirmed_role: true,
          requested_role: true,
          committee: true,
          delegation: { include: { country: true } },
        },
        take: input.limit + 1,
      });

      const total_count = await ctx.prisma.personApplication.count({
        where: {
          ...input.filters.application,
          session_id: currentSession.id,
          person: {
            ...input.filters.person,
            full_name: input.query
              ? { contains: input.query, mode: "insensitive" }
              : undefined,
          },
        },
      });

      return {
        result: result.slice(0, result.length).map((r) => ({
          ...r,
          person: {
            ...r.person,
            account: r.person.account
              ? exclude(r.person.account, ["password"])
              : null,
          },
        })),
        has_more: result.length > input.limit,
        total_count,
      };
    }),

  /**
   * Search within schools with an application for the current session.
   */
  searchSchools: authenticatedProcedure
    .input(
      searchTextQueryBaseSchema.extend({
        filters: z.object({
          application: z
            .object({
              status_application: applicationStatusSchema.optional(),
              status_housing: housingStatusSchema.optional(),
            })
            .optional(),
          school: z
            .object({
              country_id: identifierSchema.optional(),
              is_network: z.boolean().optional(),
            })
            .optional(),
        }),
      })
    )
    .query(async ({ input, ctx }) => {
      const currentSession = await getCurrentSession(ctx);

      const result = await ctx.prisma.schoolApplication.findMany({
        where: {
          ...input.filters.application,
          created_at: { lt: input.cursor },
          session_id: currentSession.id,
          school: {
            ...input.filters.school,
            name: input.query
              ? { contains: input.query, mode: "insensitive" }
              : undefined,
          },
        },
        include: {
          school: {
            include: {
              country: true,
              account: true,
              school_group_assignments: {
                include: { group: true },
                where: { session_id: currentSession.id },
              },
            },
          },
        },
        take: input.limit + 1,
      });

      const total_count = await ctx.prisma.schoolApplication.count({
        where: {
          ...input.filters.application,
          session_id: currentSession.id,
          school: {
            ...input.filters.school,
            name: input.query
              ? { contains: input.query, mode: "insensitive" }
              : undefined,
          },
        },
      });

      const schoolAssignments = await ctx.prisma.schoolGroupAssignment.findMany(
        {
          where: { session_id: currentSession.id },
          include: { group: true },
        }
      );

      return {
        result: result.slice(0, result.length).map((r) => ({
          ...r,
          assignments: schoolAssignments.filter(
            (a) => a.school_id === r.school_id
          ),
          school: {
            ...r.school,
            account: exclude(r.school.account, ["password"]),
          },
        })),
        has_more: result.length > input.limit,
        total_count,
      };
    }),

  /**
   * Search within persons WITHOUT an application for the current session.
   * This is restricted to admin users as there are no use-cases besides
   * the initial Secretariat assignments.
   */
  searchPersonsWithoutApplication: authenticatedProcedure
    .input(searchTextQueryBaseSchema)
    .query(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { userGroupName: "secretariat" });

      const result = await ctx.prisma.person.findMany({
        where: {
          created_at: { lt: input.cursor },
          full_name: input.query
            ? { contains: input.query, mode: "insensitive" }
            : undefined,
        },
        take: input.limit + 1,
      });

      const total_count = await ctx.prisma.person.count({
        where: {
          full_name: input.query
            ? { contains: input.query, mode: "insensitive" }
            : undefined,
        },
      });

      return {
        result,
        has_more: result.length > input.limit,
        total_count,
      };
    }),
});

export default searchRouter;
