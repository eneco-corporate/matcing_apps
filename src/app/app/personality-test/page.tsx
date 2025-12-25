'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const questions = [
  // Extraversion (1-5)
  { id: 'q1', text: '人と話すのが好きで、エネルギーがわいてくる', trait: 'extraversion' },
  { id: 'q2', text: '大勢のグループよりも少人数の方が落ち着く', trait: 'extraversion', reverse: true },
  { id: 'q3', text: '初対面の人とでもすぐに打ち解けられる', trait: 'extraversion' },
  { id: 'q4', text: '一人で静かに過ごす時間が必要', trait: 'extraversion', reverse: true },
  { id: 'q5', text: '新しい人と出会うことが楽しい', trait: 'extraversion' },

  // Openness (6-10)
  { id: 'q6', text: '新しいことや未知のものに興味がある', trait: 'openness' },
  { id: 'q7', text: 'アートや芸術に心が動かされる', trait: 'openness' },
  { id: 'q8', text: '想像力豊かで、抽象的な議論が好き', trait: 'openness' },
  { id: 'q9', text: '慣れた方法よりも新しいやり方を試したい', trait: 'openness' },
  { id: 'q10', text: '哲学的な話題や深い会話が好き', trait: 'openness' },

  // Agreeableness (11-15)
  { id: 'q11', text: '人の気持ちを考えて行動する', trait: 'agreeableness' },
  { id: 'q12', text: '競争するよりも協力する方が好き', trait: 'agreeableness' },
  { id: 'q13', text: '他人に親切にすることが自然', trait: 'agreeableness' },
  { id: 'q14', text: '人の意見を尊重し、対立を避けたい', trait: 'agreeableness' },
  { id: 'q15', text: '友達が困っていたら自分のことを後回しにする', trait: 'agreeableness' },

  // Conscientiousness (16-20)
  { id: 'q16', text: '計画を立ててから行動する', trait: 'conscientiousness' },
  { id: 'q17', text: '物事を最後までやり遂げる', trait: 'conscientiousness' },
  { id: 'q18', text: '整理整頓されていないと気になる', trait: 'conscientiousness' },
  { id: 'q19', text: '時間や締め切りを守ることを大切にする', trait: 'conscientiousness' },
  { id: 'q20', text: '細かいところまで気を配る', trait: 'conscientiousness' },

  // Neuroticism (21-25)
  { id: 'q21', text: 'ストレスを感じやすい', trait: 'neuroticism' },
  { id: 'q22', text: '小さなことでも心配になりやすい', trait: 'neuroticism' },
  { id: 'q23', text: '気分の浮き沈みが激しい', trait: 'neuroticism' },
  { id: 'q24', text: '失敗を引きずりやすい', trait: 'neuroticism' },
  { id: 'q25', text: '緊張しやすい', trait: 'neuroticism' },
];

const scaleLabels = [
  '全くそう思わない',
  'あまりそう思わない',
  'どちらでもない',
  'ややそう思う',
  'とてもそう思う',
];

export default function PersonalityTestPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnswer = (value: number) => {
    const question = questions[currentQuestion];
    const score = question.reverse ? 6 - value : value;

    setAnswers({
      ...answers,
      [question.id]: score,
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/personality-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      }
    } catch (error) {
      console.error('Failed to submit test:', error);
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isComplete = currentQuestion === questions.length - 1 && answers[questions[currentQuestion].id];

  if (result) {
    return (
      <>
        <Header title="性格診断結果" showBack />

        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          <Card>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto">
                <span className="text-4xl">✨</span>
              </div>
              <h2 className="text-heading-lg text-neutral-900">
                あなたは「{result.personalityType}」タイプ
              </h2>
              <p className="text-body text-neutral-600">
                性格診断が完了しました。結果は自動的にマッチングに反映されます。
              </p>
            </div>
          </Card>

          <Card>
            <h3 className="text-heading-sm text-neutral-900 mb-4">スコア詳細</h3>
            <div className="space-y-4">
              <ScoreBar label="外向性" score={result.scores.extraversion} />
              <ScoreBar label="開放性" score={result.scores.openness} />
              <ScoreBar label="協調性" score={result.scores.agreeableness} />
              <ScoreBar label="誠実性" score={result.scores.conscientiousness} />
              <ScoreBar label="神経症的傾向" score={result.scores.neuroticism} />
            </div>
          </Card>

          <Button
            variant="primary"
            fullWidth
            onClick={() => router.push('/app/profile')}
          >
            プロフィールに戻る
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="性格診断テスト" showBack />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-body-sm text-neutral-600">
              質問 {currentQuestion + 1} / {questions.length}
            </span>
            <span className="text-body-sm text-neutral-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <div className="space-y-6">
            <h2 className="text-heading-md text-neutral-900 text-center">
              {questions[currentQuestion].text}
            </h2>

            <div className="space-y-3">
              {scaleLabels.map((label, index) => {
                const value = index + 1;
                const isSelected = answers[questions[currentQuestion].id] ===
                  (questions[currentQuestion].reverse ? 6 - value : value);

                return (
                  <button
                    key={value}
                    onClick={() => handleAnswer(value)}
                    className={`w-full px-6 py-4 rounded-xl border-2 text-body font-medium transition-all ${
                      isSelected
                        ? 'border-primary bg-primary-50 text-primary-600'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-primary hover:bg-neutral-50'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentQuestion > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              前の質問
            </Button>
          )}

          {isComplete && (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1"
            >
              {loading ? '送信中...' : '診断結果を見る'}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-body-sm text-neutral-700">{label}</span>
        <span className="text-body-sm font-semibold text-neutral-900">{score}/100</span>
      </div>
      <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
