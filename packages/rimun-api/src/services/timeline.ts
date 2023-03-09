import { TRPCError } from "@trpc/server";
import { z } from "zod";
import Storage from "../storage";
import { authenticatedProcedure, trpc } from "../trpc";
import {
  checkPersonPermission,
  getDocumentBuffer,
  getImageBuffer,
  identifierSchema,
} from "./utils";

const timelineRouter = trpc.router({
  createEvent: authenticatedProcedure
    .input(
      z.object({
        name: z.string(),
        date: z.date(),
        description: z.string(),
        document: z.string().optional(),
        picture: z.string().optional(),
        type: z.enum(["EDITION", "OTHER"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, {
        resourceName: "hall-of-fame",
      });

      const { picture, document, ...data } = input;

      let picture_path: string | undefined = undefined;
      if (!!picture) {
        const pictureImage = await getImageBuffer(picture);
        picture_path = await Storage.upload(
          pictureImage.data,
          pictureImage.type,
          "img/timeline"
        );
      }

      let document_path: string | undefined = undefined;
      if (!!document) {
        const buffer = getDocumentBuffer(document);
        document_path = await Storage.upload(
          buffer.data,
          buffer.type,
          "files/timeline"
        );
      }

      return await ctx.prisma.timelineEvent.create({
        data: { ...data, picture_path, document_path },
      });
    }),

  updateEvent: authenticatedProcedure
    .input(
      z.object({
        id: identifierSchema,
        name: z.string().optional(),
        date: z.date().optional(),
        description: z.string().optional(),
        document: z.string().optional(),
        picture: z.string().optional(),
        type: z.enum(["EDITION", "OTHER"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, {
        resourceName: "hall-of-fame",
      });

      const event = await ctx.prisma.timelineEvent.findUnique({
        where: { id: input.id },
      });
      if (!event) throw new TRPCError({ code: "NOT_FOUND" });

      const { picture, document, ...data } = input;

      let picture_path = event.picture_path;
      if (picture) {
        const pictureImage = await getImageBuffer(picture);
        picture_path = await Storage.upload(
          pictureImage.data,
          pictureImage.type,
          "img/timeline"
        );
      }

      let document_path = event.document_path;
      if (document) {
        const buffer = getDocumentBuffer(document);
        document_path = await Storage.upload(
          buffer.data,
          buffer.type,
          "files/timeline"
        );
      }

      return await ctx.prisma.timelineEvent.update({
        where: { id: input.id },
        data: { ...data, picture_path, document_path },
      });
    }),

  deleteEvent: authenticatedProcedure
    .input(identifierSchema)
    .mutation(async ({ input: id, ctx }) => {
      await checkPersonPermission(ctx, {
        resourceName: "hall-of-fame",
      });

      const deleted = await ctx.prisma.timelineEvent.delete({
        where: { id },
      });

      if (!deleted) throw new TRPCError({ code: "NOT_FOUND" });
    }),

  getEvents: trpc.procedure.query(async ({ ctx }) => {
    return await ctx.prisma.timelineEvent.findMany();
  }),
});

export default timelineRouter;
