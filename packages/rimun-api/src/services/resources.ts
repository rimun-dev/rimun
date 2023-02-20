import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../database";
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
    async () =>
      await prisma.document.findMany({
        where: { session_id: (await getCurrentSession()).id },
      })
  ),

  /** Retrieve all FAQs for the current session. */
  getFaqs: trpc.procedure.query(
    async () =>
      await prisma.faqCategory.findMany({
        include: { faqs: true },
      })
  ),

  /** Retrieve metadata for all Gallery Images. */
  getImages: trpc.procedure.query(
    async () =>
      await prisma.session.findMany({
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
      await checkPersonPermission(ctx.userId, { resourceName: "document" });

      const currentSession = await getCurrentSession();

      const document = getDocumentBuffer(input.document);
      const document_path = await Storage.upload(
        document.data,
        document.type,
        "documents"
      );

      return await prisma.document.create({
        data: {
          ...input,
          path: document_path,
          session_id: currentSession.id,
        },
      });
    }),

  /** Delete an informative document for the current session. */
  deleteDocument: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx.userId, { resourceName: "document" });

      const document = await prisma.document.delete({
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
      await checkPersonPermission(ctx.userId, { resourceName: "faq" });
      return await prisma.faq.create({
        data: input,
      });
    }),

  /** Update a Frequently Asked Question. */
  updateFaq: authenticatedProcedure
    .input(
      z.object({
        faq_id: z.number(),
        question: z.string().optional(),
        answer: z.string().optional(),
        category_id: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx.userId, { resourceName: "faq" });

      const faq = await prisma.faq.update({
        where: { id: input.faq_id },
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
      await checkPersonPermission(ctx.userId, { resourceName: "faq" });

      const faq = await prisma.faq.delete({
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
      await checkPersonPermission(ctx.userId, { resourceName: "faq" });
      return await prisma.faqCategory.create({
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
      await checkPersonPermission(ctx.userId, { resourceName: "gallery" });

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

      return await prisma.galleryImage.create({
        data: { ...input, full_image_path, thumbnail_path },
      });
    }),

  /** Delete a Gallery Image. */
  deleteGalleryImage: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx.userId, { resourceName: "gallery" });

      const galleryImage = await prisma.galleryImage.delete({
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
