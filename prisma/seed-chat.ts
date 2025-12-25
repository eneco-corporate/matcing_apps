import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding chat data...');

  // Find or create a test user
  let testUser = await prisma.user.findFirst({
    where: { email: { contains: '@' } },
  });

  if (!testUser) {
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: '$2a$10$abcdefghijklmnopqrstuvwxyz', // dummy hash
        role: 'USER',
        status: 'ACTIVE',
        profile: {
          create: {
            nickname: 'Test User',
            birthYear: 1995,
          },
        },
        verification: {
          create: {
            status: 'VERIFIED',
          },
        },
        preferences: {
          create: {
            ageBandMin: 20,
            ageBandMax: 40,
            preferredAreas: JSON.stringify(['渋谷', '新宿']),
            availableTimes: JSON.stringify(['weekend_afternoon']),
            interests: JSON.stringify(['カフェ', '映画']),
          },
        },
      },
    });
  }

  // Create a test group
  let group = await prisma.group.findFirst();
  
  if (!group) {
    group = await prisma.group.create({
      data: {
        cohortName: '1月コホート',
        status: 'ACTIVE',
        weekNumber: 1,
        targetArea: '渋谷',
        members: {
          create: {
            userId: testUser.id,
            isActive: true,
          },
        },
      },
    });
  }

  // Create a chat thread
  let chatThread = await prisma.chatThread.findFirst({
    where: { groupId: group.id },
  });

  if (!chatThread) {
    chatThread = await prisma.chatThread.create({
      data: {
        groupId: group.id,
        name: `${group.cohortName}・グループA`,
      },
    });
  }

  console.log('Chat seed data created!');
  console.log('Group ID:', group.id);
  console.log('Chat Thread ID:', chatThread.id);
  console.log('User ID:', testUser.id);
  console.log('\nYou can now access the chat at: /app/chat/' + chatThread.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
