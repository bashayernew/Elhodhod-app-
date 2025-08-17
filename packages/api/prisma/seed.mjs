import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.user.count();
  if (count === 0) {
    await prisma.user.create({ data: { email: 'admin@example.com', name: 'Admin' } });
  }
}

main().then(() => prisma.$disconnect()).catch((e) => { console.error(e); process.exit(1); });


