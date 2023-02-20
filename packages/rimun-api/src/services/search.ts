import { z } from "zod";
import { prisma } from "../database";
import { authenticatedProcedure, trpc } from "../trpc";
import {
  applicationStatusSchema,
  genderSchema,
  getCurrentSession,
  housingStatusSchema,
  identifierSchema,
} from "./utils";

const searchInputBaseSchema = z.object({
  limit: z.number().int().optional().default(10),
  cursor: z.date().optional(),
});

const searchTextQueryBaseSchema = z
  .object({
    query: z.string().optional(),
  })
  .and(searchInputBaseSchema);

const searchRouter = trpc.router({
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
          }),
        })
      )
    )
    .query(async ({ input }) => {
      const currentSession = await getCurrentSession();

      const result = await prisma.personApplication.findMany({
        where: {
          ...input,
          session_id: currentSession.id,
          person: input.query
            ? { fullName: { contains: input.query } }
            : undefined,
        },
        include: {
          person: { include: { account: true } },
          school: true,
        },
        take: input.limit + 1,
      });

      const total_count = await prisma.personApplication.count({
        where: {
          ...input,
          session_id: currentSession.id,
        },
      });

      return {
        result: result.slice(0, result.length),
        has_more: result.length > input.limit,
        total_count,
      };
    }),

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
    .query(async ({ input }) => {
      const currentSession = await getCurrentSession();

      const result = await prisma.schoolApplication.findMany({
        where: {
          ...input,
          session_id: currentSession.id,
          school: input.query ? { name: { contains: input.query } } : undefined,
        },
        include: {
          school: { include: { account: true } },
        },
        take: input.limit + 1,
      });

      const total_count = await prisma.schoolApplication.count({
        where: {
          ...input,
          session_id: currentSession.id,
        },
      });

      return {
        result: result.slice(0, result.length),
        has_more: result.length > input.limit,
        total_count,
      };
    }),
});

export default searchRouter;
