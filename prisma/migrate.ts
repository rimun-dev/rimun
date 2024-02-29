import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";

const prisma = new PrismaClient();

function mapModel(obj: any) {
  return {
    ...obj,
    id: obj.id ?? undefined,
    created_at: !!obj.created_at ? new Date(obj.created_at) : undefined,
    updated_at: !!obj.updated_at ? new Date(obj.updated_at) : undefined,
    country_id: obj.country_id === null ? 106 : obj.country_id,
  };
}

function mapPerson(obj: any) {
  return mapModel({
    ...obj,
    birthday: !!obj.birthday ? new Date(obj.birthday) : undefined,
    full_name: `${obj.name} ${obj.surname}`,
    picture_path: `img/profile/${obj.picture_path}`,
  });
}

function mapGalleryImage(obj: any) {
  return mapModel({
    ...obj,
    full_image_path: `img/gallery/${obj.full_image_path}`,
    thumbnail_path: `img/gallery/thumbnails/${obj.thumbnail_path}`,
  });
}

function mapDocument(obj: any) {
  return mapModel({
    ...obj,
    path: `files/documents/${obj.path}`,
  });
}

function mapReport(obj: any) {
  return mapModel({
    ...obj,
    document_path: `files/reports/${obj.document_path}`,
  });
}

function mapStatus(status: string) {
  switch (status) {
    case "accepted":
      return "ACCEPTED";
    case "refused":
      return "REFUSED";
    case "hold":
      return "HOLD";
    case "not-required":
      return "NOT_REQUIRED";
    default:
      return status;
  }
}

function mapApplication(obj: any) {
  return mapModel({
    ...obj,
    status_application: mapStatus(obj.status_application),
    status_housing: mapStatus(obj.status_housing),
    school_year: !!obj.school_year
      ? Number.parseInt(obj.school_year)
      : undefined,
  });
}

function mapSession(obj: any) {
  return mapModel({
    ...obj,
    edition: obj.id,
    image_path: `img/sessions/${obj.image_path}`,
  });
}

function mapTable(table: string, data: any) {
  switch (table) {
    case "person":
      // @ts-ignore
      return data["person"].map(mapPerson);
    case "session":
      // @ts-ignore
      return data["session"].map(mapSession);
    case "galleryImage":
      // @ts-ignore
      return data["galleryImage"].map(mapGalleryImage);
    case "document":
      // @ts-ignore
      return data["document"].map(mapDocument);
    case "report":
      // @ts-ignore
      return data["report"].map(mapReport);
    case "personApplication":
    case "schoolApplication":
      // @ts-ignore
      return data[table].map(mapApplication);
    default:
      // @ts-ignore
      return data[table].map(mapModel);
  }
}

async function main() {
  const file = await readFile("prisma/db-backup.json");
  const data = JSON.parse(file.toString());

  const ops = [];
  for (let table in data) {
    ops.push(
      // @ts-ignore
      prisma[table].createMany({
        // @ts-ignore
        data: mapTable(table, data),
      })
    );
  }
  await prisma.$transaction(ops);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
