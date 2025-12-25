import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Calculate personality scores from answers
function calculateScores(answers: Record<string, number>) {
  // Simple scoring algorithm based on Big Five personality traits
  // Questions are mapped to traits (1-15 for each trait)

  let extraversion = 0;
  let openness = 0;
  let agreeableness = 0;
  let conscientiousness = 0;
  let neuroticism = 0;

  // Extraversion questions (1-5)
  for (let i = 1; i <= 5; i++) {
    extraversion += answers[`q${i}`] || 0;
  }

  // Openness questions (6-10)
  for (let i = 6; i <= 10; i++) {
    openness += answers[`q${i}`] || 0;
  }

  // Agreeableness questions (11-15)
  for (let i = 11; i <= 15; i++) {
    agreeableness += answers[`q${i}`] || 0;
  }

  // Conscientiousness questions (16-20)
  for (let i = 16; i <= 20; i++) {
    conscientiousness += answers[`q${i}`] || 0;
  }

  // Neuroticism questions (21-25)
  for (let i = 21; i <= 25; i++) {
    neuroticism += answers[`q${i}`] || 0;
  }

  // Convert to 0-100 scale (each trait has 5 questions, max score 25)
  return {
    extraversion: Math.round((extraversion / 25) * 100),
    openness: Math.round((openness / 25) * 100),
    agreeableness: Math.round((agreeableness / 25) * 100),
    conscientiousness: Math.round((conscientiousness / 25) * 100),
    neuroticism: Math.round((neuroticism / 25) * 100),
  };
}

// Determine personality type based on scores
function getPersonalityType(scores: {
  extraversion: number;
  openness: number;
  agreeableness: number;
  conscientiousness: number;
  neuroticism: number;
}) {
  if (scores.extraversion > 70 && scores.agreeableness > 70) {
    return 'The Connector';
  } else if (scores.openness > 70 && scores.extraversion > 60) {
    return 'The Explorer';
  } else if (scores.conscientiousness > 70 && scores.agreeableness > 60) {
    return 'The Organizer';
  } else if (scores.openness > 70 && scores.neuroticism < 40) {
    return 'The Creative';
  } else if (scores.agreeableness > 70 && scores.conscientiousness > 60) {
    return 'The Supporter';
  } else if (scores.extraversion < 40 && scores.conscientiousness > 60) {
    return 'The Thinker';
  } else if (scores.extraversion > 60 && scores.openness > 60) {
    return 'The Adventurer';
  } else {
    return 'The Balanced';
  }
}

// POST /api/personality-test - Submit test results
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { answers } = body;

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: '回答が無効です' },
        { status: 400 }
      );
    }

    // Calculate scores
    const scores = calculateScores(answers);
    const personalityType = getPersonalityType(scores);

    // Save results
    const result = await prisma.personalityTestResult.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        answers: JSON.stringify(answers),
        extraversionScore: scores.extraversion,
        opennessScore: scores.openness,
        agreeablenessScore: scores.agreeableness,
        conscientiousnessScore: scores.conscientiousness,
        neuroticismScore: scores.neuroticism,
        personalityType,
      },
      update: {
        answers: JSON.stringify(answers),
        extraversionScore: scores.extraversion,
        opennessScore: scores.openness,
        agreeablenessScore: scores.agreeableness,
        conscientiousnessScore: scores.conscientiousness,
        neuroticismScore: scores.neuroticism,
        personalityType,
        completedAt: new Date(),
      },
    });

    // Update user preferences with personality data (upsert in case preferences don't exist)
    await prisma.preference.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        ageBandMin: 20,
        ageBandMax: 40,
        preferredAreas: JSON.stringify([]),
        availableTimes: JSON.stringify([]),
        interests: JSON.stringify([]),
        personalityType,
        socialBattery: scores.extraversion > 60 ? 'extrovert' : scores.extraversion < 40 ? 'introvert' : 'ambivert',
        communicationStyle: scores.agreeableness > 60 ? 'gentle' : scores.extraversion > 60 ? 'direct' : 'balanced',
      },
      update: {
        personalityType,
        socialBattery: scores.extraversion > 60 ? 'extrovert' : scores.extraversion < 40 ? 'introvert' : 'ambivert',
        communicationStyle: scores.agreeableness > 60 ? 'gentle' : scores.extraversion > 60 ? 'direct' : 'balanced',
      },
    });

    return NextResponse.json({
      result,
      scores,
      personalityType,
    });
  } catch (error) {
    console.error('Personality test error:', error);
    return NextResponse.json(
      { error: '性格診断の保存に失敗しました' },
      { status: 500 }
    );
  }
}

// GET /api/personality-test - Get user's test results
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    const result = await prisma.personalityTestResult.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Get personality test error:', error);
    return NextResponse.json(
      { error: '性格診断の取得に失敗しました' },
      { status: 500 }
    );
  }
}
