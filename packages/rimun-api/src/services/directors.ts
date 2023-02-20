import { TRPCError } from "@trpc/server";
import { prisma } from "../database";
import Storage from "../storage";
import { authenticatedProcedure, trpc } from "../trpc";
import {
  getCurrentSession,
  getGroup,
  getRole,
  getSchoolUserFromAccountId,
  getThumbnailImageBuffer,
  identifierSchema,
  personBaseSchema,
} from "./utils";

const directorsRouter = trpc.router({
  addDirectors: authenticatedProcedure
    .input(personBaseSchema)
    .mutation(async ({ input, ctx }) => {
      const school = await getSchoolUserFromAccountId(ctx.userId);
      const currentSession = await getCurrentSession();

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

      const person = await prisma.person.create({
        data: {
          ...input,
          fullName: `${input.name} ${input.surname}`,
          picture_path,
        },
      });

      const directorGroup = await getGroup("director");
      const directorRole = await getRole("Director", directorGroup.id);

      return await prisma.personApplication.create({
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
      const school = await getSchoolUserFromAccountId(ctx.userId);
      const currentSession = await getCurrentSession();

      const deletedApplications = await prisma.personApplication.deleteMany({
        where: {
          person_id: input,
          session_id: currentSession.id,
          school_id: school.id,
        },
      });
      if (deletedApplications.count === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This director does not exist.",
        });

      const person = await prisma.person.delete({
        where: { id: input },
      });
      if (!person)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This director does not exist.",
        });
    }),
});

export default directorsRouter;
