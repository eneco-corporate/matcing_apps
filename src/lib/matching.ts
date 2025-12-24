import { prisma } from './prisma';
import { User, Preference, Profile } from '@prisma/client';

type UserWithPreference = User & {
  preferences: Preference | null;
  profile: Profile | null;
};

interface MatchScore {
  userId: string;
  score: number;
}

export async function calculateCompatibilityScore(
  user1: UserWithPreference,
  user2: UserWithPreference
): Promise<number> {
  if (!user1.preferences || !user2.preferences || !user1.profile || !user2.profile) {
    return 0;
  }

  let score = 0;
  const maxScore = 100;

  const pref1 = user1.preferences;
  const pref2 = user2.preferences;
  const profile1 = user1.profile;
  const profile2 = user2.profile;

  // Age compatibility (20 points)
  const age1 = new Date().getFullYear() - profile1.birthYear;
  const age2 = new Date().getFullYear() - profile2.birthYear;

  if (age2 >= pref1.ageBandMin && age2 <= pref1.ageBandMax &&
      age1 >= pref2.ageBandMin && age1 <= pref2.ageBandMax) {
    score += 20;
  } else if (Math.abs(age1 - age2) <= 5) {
    score += 10;
  }

  // Area overlap (15 points)
  const areas1 = JSON.parse(pref1.preferredAreas || '[]');
  const areas2 = JSON.parse(pref2.preferredAreas || '[]');
  const areaOverlap = areas1.filter((a: string) => areas2.includes(a)).length;

  if (areaOverlap > 0) {
    score += Math.min(15, areaOverlap * 5);
  }

  // Time availability overlap (15 points)
  const times1 = JSON.parse(pref1.availableTimes || '[]');
  const times2 = JSON.parse(pref2.availableTimes || '[]');
  const timeOverlap = times1.filter((t: string) => times2.includes(t)).length;

  if (timeOverlap > 0) {
    score += Math.min(15, timeOverlap * 3);
  }

  // Interest overlap (20 points)
  const interests1 = JSON.parse(pref1.interests || '[]');
  const interests2 = JSON.parse(pref2.interests || '[]');
  const interestOverlap = interests1.filter((i: string) => interests2.includes(i)).length;

  if (interestOverlap > 0) {
    score += Math.min(20, interestOverlap * 4);
  }

  // Lifestyle compatibility (15 points)
  if (pref1.drinkingOk === pref2.drinkingOk) score += 5;
  if (pref1.smokingOk === pref2.smokingOk) score += 5;
  if (pref1.conversationDepth === pref2.conversationDepth) {
    score += 5;
  } else if (
    (pref1.conversationDepth === 'BALANCED') ||
    (pref2.conversationDepth === 'BALANCED')
  ) {
    score += 2;
  }

  // Quiet mode compatibility (10 points)
  if (pref1.quietMode === pref2.quietMode) {
    score += 10;
  } else if (!pref1.quietMode && !pref2.quietMode) {
    score += 5;
  }

  // Boundary compatibility (5 points)
  if (pref1.noAlcoholMeetups && !pref2.drinkingOk) score += 5;
  if (pref2.noAlcoholMeetups && !pref1.drinkingOk) score += 5;

  return Math.min(maxScore, score);
}

export async function findMatchesForUser(
  userId: string,
  excludeUserIds: string[] = []
): Promise<MatchScore[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      preferences: true,
      profile: true,
      verification: true,
    },
  });

  if (!user || user.verification?.status !== 'VERIFIED') {
    return [];
  }

  // Get all verified users except the current user and excluded users
  const candidates = await prisma.user.findMany({
    where: {
      id: { notIn: [userId, ...excludeUserIds] },
      status: 'ACTIVE',
      verification: {
        status: 'VERIFIED',
      },
    },
    include: {
      preferences: true,
      profile: true,
    },
  });

  const scores: MatchScore[] = [];

  for (const candidate of candidates) {
    const score = await calculateCompatibilityScore(user, candidate);
    if (score > 30) { // Minimum threshold
      scores.push({ userId: candidate.id, score });
    }
  }

  return scores.sort((a, b) => b.score - a.score);
}

export async function createGroupFromMatches(
  userIds: string[],
  cohortName?: string
): Promise<string> {
  // Calculate all pairwise compatibility scores
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    include: {
      preferences: true,
      profile: true,
    },
  });

  const scores: number[] = [];
  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      const score = await calculateCompatibilityScore(users[i], users[j]);
      scores.push(score);
    }
  }

  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  // Find common area
  const allAreas = users
    .map(u => JSON.parse(u.preferences?.preferredAreas || '[]'))
    .flat();
  const areaCount = allAreas.reduce((acc: Record<string, number>, area: string) => {
    acc[area] = (acc[area] || 0) + 1;
    return acc;
  }, {});
  const targetArea = Object.entries(areaCount)
    .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0];

  // Find common time
  const allTimes = users
    .map(u => JSON.parse(u.preferences?.availableTimes || '[]'))
    .flat();
  const timeCount = allTimes.reduce((acc: Record<string, number>, time: string) => {
    acc[time] = (acc[time] || 0) + 1;
    return acc;
  }, {});
  const targetTime = Object.entries(timeCount)
    .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0];

  const group = await prisma.group.create({
    data: {
      cohortName: cohortName || `Cohort ${new Date().toISOString().slice(0, 10)}`,
      status: 'FORMING',
      targetArea,
      targetTimeSlot: targetTime,
      members: {
        create: userIds.map(userId => ({
          userId,
          compatibilityScore: avgScore,
        })),
      },
    },
  });

  return group.id;
}

export async function runMatchingAlgorithm(minGroupSize = 4, maxGroupSize = 6) {
  // Get all verified users not currently in an active group
  const availableUsers = await prisma.user.findMany({
    where: {
      status: 'ACTIVE',
      verification: { status: 'VERIFIED' },
      groupMemberships: {
        none: {
          isActive: true,
          group: {
            status: { in: ['FORMING', 'ACTIVE'] },
          },
        },
      },
    },
    include: {
      preferences: true,
      profile: true,
    },
  });

  if (availableUsers.length < minGroupSize) {
    console.log(`Not enough users for matching: ${availableUsers.length} available`);
    return { groups: [], waitlisted: availableUsers.length };
  }

  const matched: Set<string> = new Set();
  const groups: string[] = [];

  // Greedy matching: pick a user, find best matches, form group
  for (const user of availableUsers) {
    if (matched.has(user.id)) continue;

    const matches = await findMatchesForUser(
      user.id,
      Array.from(matched)
    );

    const groupMembers = [user.id];
    for (const match of matches) {
      if (groupMembers.length >= maxGroupSize) break;
      if (!matched.has(match.userId)) {
        groupMembers.push(match.userId);
      }
    }

    if (groupMembers.length >= minGroupSize) {
      const groupId = await createGroupFromMatches(groupMembers);
      groups.push(groupId);
      groupMembers.forEach(id => matched.add(id));
    }
  }

  const waitlisted = availableUsers.length - matched.size;

  return { groups, waitlisted };
}
