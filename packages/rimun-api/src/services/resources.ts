import { TRPCError } from "@trpc/server";
import { z } from "zod";
import Storage from "../storage";
import { authenticatedProcedure, trpc } from "../trpc";
import {
  checkPersonPermission,
  getCurrentSession,
  getDocumentBuffer,
  getImageBuffer,
  getThumbnailImageBuffer,
} from "./utils";

const resourcesRouter = trpc.router({
  /** Retrieve all informative documents for the current session. */
  getDocuments: trpc.procedure.query(
    async ({ ctx }) =>
      await ctx.prisma.document.findMany({
        where: { session_id: (await getCurrentSession(ctx)).id },
      })
  ),

  /** Retrieve all FAQs for the current session. */
  getFaqs: trpc.procedure.query(
    async ({ ctx }) =>
      await ctx.prisma.faqCategory.findMany({
        include: { faqs: true },
      })
  ),

  /** Retrieve metadata for all Gallery Images. */
  getImages: trpc.procedure.query(
    async ({ ctx }) =>
      await ctx.prisma.session.findMany({
        include: { gallery_images: true },
      })
  ),

  /** Create an informative document for the current session. */
  createDocument: authenticatedProcedure
    .input(
      z.object({
        name: z.string(),
        document: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "document" });

      const currentSession = await getCurrentSession(ctx);

      const document = getDocumentBuffer(input.document);
      const document_path = await Storage.upload(
        document.data,
        document.type,
        "files/documents"
      );

      const { document: _, ...data } = input;

      return await ctx.prisma.document.create({
        data: {
          ...data,
          path: document_path,
          session_id: currentSession.id,
        },
      });
    }),

  /** Delete an informative document for the current session. */
  deleteDocument: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "document" });

      const document = await ctx.prisma.document.delete({
        where: { id: input },
      });

      if (!document)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This document does not exist.",
        });

      await Storage.remove(document.path);
    }),

  /** Create a Frequently Asked Question. */
  createFaq: authenticatedProcedure
    .input(
      z.object({
        question: z.string(),
        answer: z.string(),
        category_id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "faq" });
      return await ctx.prisma.faq.create({
        data: input,
      });
    }),

  /** Update a Frequently Asked Question. */
  updateFaq: authenticatedProcedure
    .input(
      z.object({
        id: z.number(),
        question: z.string().optional(),
        answer: z.string().optional(),
        category_id: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "faq" });

      const faq = await ctx.prisma.faq.update({
        where: { id: input.id },
        data: input,
      });

      if (!faq)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This FAQ does not exist.",
        });

      return faq;
    }),

  /** Update a Frequently Asked Question. */
  deleteFaq: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "faq" });

      const faq = await ctx.prisma.faq.delete({
        where: { id: input },
      });

      if (!faq)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This FAQ does not exist.",
        });

      return faq;
    }),

  /** Create a Frequently Asked Question Category. */
  createFaqCategory: authenticatedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "faq" });
      return await ctx.prisma.faqCategory.create({
        data: input,
      });
    }),

  /** Create a Gallery Image. */
  createGalleryImage: authenticatedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        image: z.string(),
        session_id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "gallery" });

      const thumbnail = await getThumbnailImageBuffer(input.image);
      const full_image = await getImageBuffer(input.image);

      const [thumbnail_path, full_image_path] = await Promise.all([
        Storage.upload(
          thumbnail.data,
          thumbnail.type,
          "img/gallery/thumbnails"
        ),
        Storage.upload(full_image.data, full_image.type, "img/gallery"),
      ]);

      const { image: _, ...data } = input;

      return await ctx.prisma.galleryImage.create({
        data: { ...data, full_image_path, thumbnail_path },
      });
    }),

  /** Delete a Gallery Image. */
  deleteGalleryImage: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "gallery" });

      const galleryImage = await ctx.prisma.galleryImage.delete({
        where: { id: input },
      });

      if (!galleryImage)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This gallery image does not exist.",
        });

      await Promise.all([
        Storage.remove(galleryImage.full_image_path),
        Storage.remove(galleryImage.thumbnail_path),
      ]);
    }),
});

export default resourcesRouter;
