-- CreateEnum
CREATE TYPE "TimelineEventType" AS ENUM ('EDITION', 'OTHER');

-- CreateTable
CREATE TABLE "timeline_event" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "TimelineEventType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "picture_path" TEXT,
    "document_path" TEXT,

    CONSTRAINT "timeline_event_pkey" PRIMARY KEY ("id")
);
