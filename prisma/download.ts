import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.personApplication.findMany({
    where: { session: { is_active: true }, status_application: "ACCEPTED" },
    include: {
      person: { include: { account: true } },
      school: { include: { country: true } },
      delegation: { include: { country: true } },
      committee: true,
      confirmed_role: true,
      confirmed_group: true,
    },
  });

  writeFile("output.json", JSON.stringify(result), () => {});
}

main();
