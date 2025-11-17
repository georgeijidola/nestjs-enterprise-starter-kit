import { PrismaClient, UserRole } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await argon2.hash('Admin123!@#');
  await prisma.user.upsert({
    where: { email: 'admin@mailinator.com' },
    update: {},
    create: {
      name: faker.person.fullName(),
      email: 'admin@mailinator.com',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  // Create regular user
  const userPassword = await argon2.hash('User123!@#');
  await prisma.user.upsert({
    where: { email: 'user@mailinator.com' },
    update: {},
    create: {
      name: faker.person.fullName(),
      email: 'user@mailinator.com',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
