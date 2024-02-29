-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('accepted', 'refused', 'hold');

-- CreateEnum
CREATE TYPE "HousingStatus" AS ENUM ('accepted', 'refused', 'hold', 'not-required');

-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_school" BOOLEAN NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "committee" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "session_id" INTEGER NOT NULL,
    "forum_id" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,

    CONSTRAINT "committee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delegation" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "session_id" INTEGER,
    "is_individual" BOOLEAN NOT NULL,
    "school_id" INTEGER,
    "n_delegates" INTEGER NOT NULL,
    "country_id" INTEGER,
    "name" TEXT,
    "type" TEXT NOT NULL,

    CONSTRAINT "delegation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delegation_committee_assignment" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "session_id" INTEGER NOT NULL,
    "delegation_id" INTEGER NOT NULL,
    "committee_id" INTEGER NOT NULL,

    CONSTRAINT "delegation_committee_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "session_id" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "path" TEXT NOT NULL,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_category" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "faq_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acronym" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "forum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_image" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "session_id" INTEGER,
    "name" TEXT,
    "description" TEXT,
    "full_image_path" TEXT NOT NULL,
    "thumbnail_path" TEXT NOT NULL,

    CONSTRAINT "gallery_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "housing_match" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "host_id" INTEGER NOT NULL,
    "guest_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,

    CONSTRAINT "housing_match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "person_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "resource_id" INTEGER NOT NULL,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "birthday" DATE,
    "gender" TEXT,
    "picture_path" TEXT NOT NULL,
    "tshirt_size" TEXT,
    "phone_number" TEXT,
    "allergies" TEXT,
    "account_id" INTEGER,
    "country_id" INTEGER NOT NULL,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person_application" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "person_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "school_id" INTEGER,
    "school_year" INTEGER,
    "school_section" TEXT,
    "eng_certificate" TEXT,
    "experience_mun" TEXT,
    "experience_other" TEXT,
    "requested_group_id" INTEGER,
    "requested_role_id" INTEGER,
    "confirmed_group_id" INTEGER,
    "confirmed_role_id" INTEGER,
    "city" TEXT,
    "university" TEXT,
    "is_resident" BOOLEAN,
    "status_application" "ApplicationStatus" NOT NULL,
    "status_housing" "HousingStatus" NOT NULL,
    "housing_is_available" BOOLEAN NOT NULL DEFAULT false,
    "housing_n_guests" INTEGER,
    "housing_address_street" TEXT,
    "housing_address_number" TEXT,
    "housing_address_postal" TEXT,
    "housing_phone_number" TEXT,
    "housing_pets" TEXT,
    "housing_gender_preference" TEXT,
    "committee_id" INTEGER,
    "delegation_id" INTEGER,
    "is_ambassador" BOOLEAN,

    CONSTRAINT "person_application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "session_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "is_for_schools" BOOLEAN NOT NULL DEFAULT true,
    "is_for_persons" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "committee_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "document_path" TEXT NOT NULL,

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "forum_id" INTEGER,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address_street" TEXT NOT NULL,
    "address_number" TEXT NOT NULL,
    "address_postal" TEXT NOT NULL,
    "is_network" BOOLEAN NOT NULL DEFAULT false,
    "account_id" INTEGER NOT NULL,
    "country_id" INTEGER NOT NULL,

    CONSTRAINT "school_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_application" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "school_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "experience_mun" TEXT,
    "communications" TEXT,
    "contact_name" TEXT NOT NULL,
    "contact_surname" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,
    "contact_title" TEXT NOT NULL,
    "status_application" "ApplicationStatus" NOT NULL,
    "status_housing" "HousingStatus" NOT NULL,

    CONSTRAINT "school_application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_group_assignment" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "school_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "n_requested" INTEGER,
    "n_confirmed" INTEGER,

    CONSTRAINT "school_group_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edition" INTEGER NOT NULL,
    "edition_display" INTEGER NOT NULL,
    "date_start" DATE,
    "date_end" DATE,
    "title" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL,
    "image_path" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topic" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "committee_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "external_url" TEXT,

    CONSTRAINT "topic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_email_key" ON "account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "committee_name_session_id_forum_id_key" ON "committee"("name", "session_id", "forum_id");

-- CreateIndex
CREATE UNIQUE INDEX "country_code_key" ON "country"("code");

-- CreateIndex
CREATE UNIQUE INDEX "delegation_committee_assignment_delegation_id_committee_id__key" ON "delegation_committee_assignment"("delegation_id", "committee_id", "session_id");

-- CreateIndex
CREATE UNIQUE INDEX "document_name_session_id_key" ON "document"("name", "session_id");

-- CreateIndex
CREATE UNIQUE INDEX "faq_question_category_id_key" ON "faq"("question", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "faq_category_name_key" ON "faq_category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "forum_acronym_key" ON "forum"("acronym");

-- CreateIndex
CREATE UNIQUE INDEX "forum_name_key" ON "forum"("name");

-- CreateIndex
CREATE UNIQUE INDEX "group_name_key" ON "group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "housing_match_session_id_guest_id_key" ON "housing_match"("session_id", "guest_id");

-- CreateIndex
CREATE UNIQUE INDEX "permission_person_id_session_id_resource_id_key" ON "permission"("person_id", "session_id", "resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "person_account_id_key" ON "person"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "person_application_person_id_session_id_key" ON "person_application"("person_id", "session_id");

-- CreateIndex
CREATE UNIQUE INDEX "report_committee_id_key" ON "report"("committee_id");

-- CreateIndex
CREATE UNIQUE INDEX "resource_name_key" ON "resource"("name");

-- CreateIndex
CREATE UNIQUE INDEX "school_account_id_key" ON "school"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "school_application_school_id_session_id_key" ON "school_application"("school_id", "session_id");

-- CreateIndex
CREATE UNIQUE INDEX "school_group_assignment_school_id_session_id_group_id_key" ON "school_group_assignment"("school_id", "session_id", "group_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_edition_key" ON "session"("edition");

-- CreateIndex
CREATE UNIQUE INDEX "session_edition_display_key" ON "session"("edition_display");

-- CreateIndex
CREATE UNIQUE INDEX "topic_committee_id_name_key" ON "topic"("committee_id", "name");

-- AddForeignKey
ALTER TABLE "committee" ADD CONSTRAINT "committee_forum_id_fkey" FOREIGN KEY ("forum_id") REFERENCES "forum"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "committee" ADD CONSTRAINT "committee_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delegation" ADD CONSTRAINT "delegation_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delegation" ADD CONSTRAINT "delegation_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delegation" ADD CONSTRAINT "delegation_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delegation_committee_assignment" ADD CONSTRAINT "delegation_committee_assignment_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delegation_committee_assignment" ADD CONSTRAINT "delegation_committee_assignment_delegation_id_fkey" FOREIGN KEY ("delegation_id") REFERENCES "delegation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delegation_committee_assignment" ADD CONSTRAINT "delegation_committee_assignment_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "faq" ADD CONSTRAINT "faq_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "faq_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gallery_image" ADD CONSTRAINT "gallery_image_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "housing_match" ADD CONSTRAINT "housing_match_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "housing_match" ADD CONSTRAINT "housing_match_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "housing_match" ADD CONSTRAINT "housing_match_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resource"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "person_application" ADD CONSTRAINT "person_application_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "person_application" ADD CONSTRAINT "person_application_confirmed_group_id_fkey" FOREIGN KEY ("confirmed_group_id") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "person_application" ADD CONSTRAINT "person_application_confirmed_role_id_fkey" FOREIGN KEY ("confirmed_role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "person_application" ADD CONSTRAINT "person_application_requested_group_id_fkey" FOREIGN KEY ("requested_group_id") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "person_application" ADD CONSTRAINT "person_application_requested_role_id_fkey" FOREIGN KEY ("requested_role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "person_application" ADD CONSTRAINT "person_application_delegation_id_fkey" FOREIGN KEY ("delegation_id") REFERENCES "delegation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "person_application" ADD CONSTRAINT "person_application_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "person_application" ADD CONSTRAINT "person_application_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "person_application" ADD CONSTRAINT "person_application_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_forum_id_fkey" FOREIGN KEY ("forum_id") REFERENCES "forum"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "school" ADD CONSTRAINT "school_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "school" ADD CONSTRAINT "school_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "school_application" ADD CONSTRAINT "school_application_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "school_application" ADD CONSTRAINT "school_application_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "school_group_assignment" ADD CONSTRAINT "school_group_assignment_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "school_group_assignment" ADD CONSTRAINT "school_group_assignment_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "school_group_assignment" ADD CONSTRAINT "school_group_assignment_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "topic" ADD CONSTRAINT "topic_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
