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

const searchTextQueryBaseSchema = z
  .object({
    query: z.string().optional(),
  })
  .and(searchInputBaseSchema);

const searchRouter = trpc.router({
  /**
   * Search within persons with an application for the current session.
   */
  searchPersons: authenticatedProcedure
    .input(
      searchTextQueryBaseSchema.and(
        z.object({
          filters: z.object({
            requested_group_id: identifierSchema.optional(),
            requested_role_id: identifierSchema.optional(),
            confirmed_group_id: identifierSchema.optional(),
            confirmed_role_id: identifierSchema.optional(),
            country_id: identifierSchema.optional(),
            committee_id: identifierSchema.optional(),
            school_id: identifierSchema.optional(),
            status_application: applicationStatusSchema.optional(),
            status_housing: housingStatusSchema.optional(),
            gender: genderSchema.optional(),
            housing_is_available: z.boolean().optional(),
            confirmed_group: z
              .object({ name: z.string().optional() })
              .optional(),
            requested_group: z
              .object({ name: z.string().optional() })
              .optional(),
          }),
        })
      )
    )
    .query(async ({ input, ctx }) => {
      const currentSession = await getCurrentSession(ctx);

      const result = await ctx.prisma.personApplication.findMany({
        where: {
          ...input,
          created_at: { lt: input.cursor },
          session_id: currentSession.id,
          person: input.query
            ? { full_name: { contains: input.query } }
            : undefined,
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
          school: true,
          confirmed_group: true,
          requested_group: true,
          confirmed_role: true,
          requested_role: true,
        },
        take: input.limit + 1,
      });

      const total_count = await ctx.prisma.personApplication.count({
        where: {
          ...input,
          session_id: currentSession.id,
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
      searchTextQueryBaseSchema.and(
        z.object({
          filters: z.object({
            country_id: identifierSchema.optional(),
            status_application: applicationStatusSchema.optional(),
            status_housing: housingStatusSchema.optional(),
            is_network: z.boolean().optional(),
          }),
        })
      )
    )
    .query(async ({ input, ctx }) => {
      const currentSession = await getCurrentSession(ctx);

      const result = await ctx.prisma.schoolApplication.findMany({
        where: {
          ...input,
          created_at: { lt: input.cursor },
          session_id: currentSession.id,
          school: input.query ? { name: { contains: input.query } } : undefined,
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
          ...input,
          session_id: currentSession.id,
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
          full_name: input.query ? { contains: input.query } : undefined,
        },
        take: input.limit + 1,
      });

      const total_count = await ctx.prisma.person.count({
        where: {
          full_name: input.query ? { contains: input.query } : undefined,
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
