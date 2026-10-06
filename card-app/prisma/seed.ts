import { PrismaClient } from "@prisma/client";

// Adds starter offices. Edit the list or manage offices from the Admin page.
const db = new PrismaClient();
const OFFICES = ["Corporate"]; // add your real office list here

async function main() {
  for (const name of OFFICES) {
    await db.office.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log(`Seeded ${OFFICES.length} offices`);
}

main().finally(() => db.$disconnect());
