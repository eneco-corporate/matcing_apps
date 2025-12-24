import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@friendmatch.app' },
    update: {},
    create: {
      email: 'admin@friendmatch.app',
      passwordHash: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      profile: {
        create: {
          nickname: 'Admin',
          birthYear: 1990,
          bio: 'FriendMatch administrator',
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
          ageBandMax: 50,
          preferredAreas: JSON.stringify(['新宿', '渋谷']),
          availableTimes: JSON.stringify(['平日夜(18-20時)']),
          interests: JSON.stringify(['カフェ巡り']),
        },
      },
    },
  });

  console.log('Admin user created:', admin.email);

  // Create sample users
  const sampleUsers = [
    {
      email: 'yuki@example.com',
      nickname: 'ゆき',
      birthYear: 1995,
      bio: 'カフェ巡りと読書が好きです',
      interests: ['カフェ巡り', '読書', '映画'],
      areas: ['渋谷', '恵比寿'],
      times: ['平日夜(18-20時)', '土曜午後'],
      quietMode: true,
    },
    {
      email: 'sakura@example.com',
      nickname: 'さくら',
      birthYear: 1992,
      bio: 'ヨガとヘルシーライフスタイルに興味があります',
      interests: ['ヨガ', 'ハイキング', '料理'],
      areas: ['渋谷', '表参道'],
      times: ['土曜午後', '日曜午後'],
      quietMode: false,
    },
    {
      email: 'haruka@example.com',
      nickname: 'はるか',
      birthYear: 1997,
      bio: 'アートと写真が好きです',
      interests: ['アート', '写真', '旅行'],
      areas: ['渋谷', '中目黒'],
      times: ['平日夜(20-22時)', '日曜午後'],
      quietMode: false,
    },
    {
      email: 'mio@example.com',
      nickname: 'みお',
      birthYear: 1994,
      bio: '音楽フェスとライブが好き',
      interests: ['音楽', 'ダンス', '旅行'],
      areas: ['新宿', '渋谷'],
      times: ['土曜夕方', '日曜夕方'],
      quietMode: false,
    },
    {
      email: 'aoi@example.com',
      nickname: 'あおい',
      birthYear: 1996,
      bio: 'ランニングとフィットネスが趣味',
      interests: ['ランニング', 'ヨガ', 'スポーツ観戦'],
      areas: ['恵比寿', '六本木'],
      times: ['平日夜(18-20時)', '土曜午後'],
      quietMode: false,
    },
  ];

  const createdUsers = [];
  for (const userData of sampleUsers) {
    const password = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        passwordHash: password,
        emailVerified: true,
        profile: {
          create: {
            nickname: userData.nickname,
            birthYear: userData.birthYear,
            bio: userData.bio,
          },
        },
        verification: {
          create: {
            status: 'VERIFIED',
            submittedAt: new Date(),
            reviewedAt: new Date(),
            reviewedBy: admin.id,
          },
        },
        preferences: {
          create: {
            ageBandMin: 25,
            ageBandMax: 40,
            preferredAreas: JSON.stringify(userData.areas),
            availableTimes: JSON.stringify(userData.times),
            interests: JSON.stringify(userData.interests),
            drinkingOk: true,
            smokingOk: false,
            conversationDepth: 'BALANCED',
            quietMode: userData.quietMode,
            noAlcoholMeetups: false,
          },
        },
      },
    });
    createdUsers.push(user);
    console.log('Created user:', user.email);
  }

  // Create a sample group
  const group = await prisma.group.create({
    data: {
      cohortName: '渋谷カフェ好き Cohort #1',
      status: 'ACTIVE',
      weekNumber: 2,
      maxWeeks: 6,
      targetArea: '渋谷',
      targetTimeSlot: '土曜午後',
      members: {
        create: createdUsers.slice(0, 4).map((user, index) => ({
          userId: user.id,
          compatibilityScore: 75 + index * 5,
        })),
      },
    },
  });

  console.log('Created group:', group.cohortName);

  // Create events for the group
  const nextSaturday = new Date();
  nextSaturday.setDate(nextSaturday.getDate() + ((6 - nextSaturday.getDay() + 7) % 7));
  nextSaturday.setHours(14, 0, 0, 0);

  const event = await prisma.event.create({
    data: {
      groupId: group.id,
      weekNumber: 2,
      status: 'SCHEDULED',
      scheduledAt: nextSaturday,
      location: 'カフェ ブルーボトル 渋谷',
      address: '東京都渋谷区渋谷2-21-1',
      title: 'Week 2: お互いを知ろう',
      description: '2回目の集まりです。お互いの趣味や興味について話しましょう。',
      rsvps: {
        create: createdUsers.slice(0, 4).map(user => ({
          userId: user.id,
          status: 'CONFIRMED',
        })),
      },
    },
  });

  console.log('Created event:', event.title);

  // Create chat thread
  const chatThread = await prisma.chatThread.create({
    data: {
      groupId: group.id,
      name: `${group.cohortName} Chat`,
    },
  });

  // Add some messages
  await prisma.message.createMany({
    data: [
      {
        threadId: chatThread.id,
        userId: createdUsers[0].id,
        content: '次の土曜日、楽しみですね！',
      },
      {
        threadId: chatThread.id,
        userId: createdUsers[1].id,
        content: 'はい！ブルーボトル、初めてなので楽しみです',
      },
      {
        threadId: chatThread.id,
        userId: createdUsers[2].id,
        content: '私も楽しみです。何か話題を考えておきますね',
      },
    ],
  });

  console.log('Created chat thread and messages');

  // Create prompt cards
  const prompts = [
    {
      titleJa: 'アイスブレイク',
      titleEn: 'Icebreaker',
      promptJa: '最近ハマっていることは何ですか？',
      promptEn: 'What are you currently into?',
      weekNumber: 1,
      category: 'ICEBREAKER',
    },
    {
      titleJa: '価値観',
      titleEn: 'Values',
      promptJa: 'あなたにとって大切な価値観は何ですか？',
      promptEn: 'What values are important to you?',
      weekNumber: 2,
      category: 'DEEP',
    },
    {
      titleJa: '趣味',
      titleEn: 'Hobbies',
      promptJa: '週末はどう過ごすのが好きですか？',
      promptEn: 'How do you like to spend your weekends?',
      weekNumber: 1,
      category: 'ICEBREAKER',
    },
    {
      titleJa: '夢',
      titleEn: 'Dreams',
      promptJa: '今年中に実現したいことは何ですか？',
      promptEn: 'What do you want to achieve this year?',
      weekNumber: 3,
      category: 'DEEP',
    },
    {
      titleJa: 'おすすめ',
      titleEn: 'Recommendations',
      promptJa: '最近見た映画やドラマでおすすめは？',
      promptEn: 'Any recent movie or show recommendations?',
      weekNumber: 2,
      category: 'LIGHT',
    },
  ];

  for (const promptData of prompts) {
    await prisma.promptCard.create({
      data: promptData,
    });
  }

  console.log('Created prompt cards');

  // Assign prompts to event
  const promptCards = await prisma.promptCard.findMany({ take: 3 });
  for (let i = 0; i < promptCards.length; i++) {
    await prisma.eventPromptAssignment.create({
      data: {
        eventId: event.id,
        promptId: promptCards[i].id,
        order: i,
      },
    });
  }

  console.log('Assigned prompts to event');

  console.log('Seed completed!');
  console.log('\nTest accounts:');
  console.log('Admin: admin@friendmatch.app / admin123');
  console.log('User: yuki@example.com / password123');
  console.log('User: sakura@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
