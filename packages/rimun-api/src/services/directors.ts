import { TRPCError } from "@trpc/server";
import Storage from "../storage";
import { authenticatedProcedure, trpc } from "../trpc";
import {
  checkPersonPermission,
  getCurrentSession,
  getGroup,
  getRole,
  getSchoolUser,
  getThumbnailImageBuffer,
  identifierSchema,
  personBaseSchema,
} from "./utils";

const directorsRouter = trpc.router({
  addDirector: authenticatedProcedure
    .input(personBaseSchema)
    .mutation(async ({ input, ctx }) => {
      const school = await getSchoolUser(ctx);
      const currentSession = await getCurrentSession(ctx);

      const schoolApplication = school.applications.find(
        (a) => a.session_id === currentSession.id
      );
      if (!schoolApplication)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You must first apply to this session.",
        });

      const picture = await getThumbnailImageBuffer(input.picture);
      const picture_path = await Storage.upload(
        picture.data,
        picture.type,
        "img/profile"
      );

      const person = await ctx.prisma.person.create({
        data: {
          ...input,
          full_name: `${input.name} ${input.surname}`,
          picture_path,
        },
      });

      const directorGroup = await getGroup("director", ctx);
      const directorRole = await getRole("Director", directorGroup.id, ctx);

      return await ctx.prisma.personApplication.create({
        data: {
          person_id: person.id,
          session_id: currentSession.id,
          status_application: schoolApplication.status_application,
          status_housing: "NOT_REQUIRED",
          requested_group_id: directorGroup.id,
          requested_role_id: directorRole.id,
          confirmed_group_id: directorGroup.id,
          confirmed_role_id: directorRole.id,
          school_id: school.id,
        },
        include: { person: true },
      });
    }),

  removeDirector: authenticatedProcedure
    .input(identifierSchema)
    .mutation(async ({ input, ctx }) => {
      const school = await getSchoolUser(ctx);
      const currentSession = await getCurrentSession(ctx);

      const deletedApplications = await ctx.prisma.personApplication.deleteMany(
        {
          where: {
            person_id: input,
            session_id: currentSession.id,
            school_id: school.id,
          },
        }
      );
      if (deletedApplications.count === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This director does not exist.",
        });

      const person = await ctx.prisma.person.delete({
        where: { id: input },
      });
      if (!person)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This director does not exist.",
        });
    }),

  getAllDirectors: authenticatedProcedure.query(async ({ ctx }) => {
    await checkPersonPermission(ctx, { userGroupName: "secretariat" });

    const currentSession = await getCurrentSession(ctx);

    return await ctx.prisma.schoolApplication.findMany({
      where: { session_id: currentSession.id },
      include: {
        school: {
          include: {
            person_applications: {
              include: { person: { include: { account: true } } },
              where: {
                session_id: currentSession.id,
                confirmed_group: {
                  name: "director",
                },
              },
            },
          },
        },
      },
    });
  }),
});

export default directorsRouter;
