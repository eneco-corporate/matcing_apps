'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Input, { TextArea } from '@/components/Input';
import Card from '@/components/Card';
import Stepper from '@/components/Stepper';
import TagPicker from '@/components/TagPicker';

const STEPS = [
  { label: '基本情報', labelEn: 'Profile' },
  { label: '興味・趣味', labelEn: 'Interests' },
  { label: 'ライフスタイル', labelEn: 'Lifestyle' },
  { label: 'マッチング設定', labelEn: 'Preferences' },
];

const INTEREST_OPTIONS = [
  'カフェ巡り', 'ヨガ', 'ランニング', '読書', '映画',
  'アート', '料理', '旅行', '音楽', 'ハイキング',
  '写真', 'ゲーム', 'クラフト', 'ダンス', 'スポーツ観戦',
];

const AREA_OPTIONS = [
  '新宿', '渋谷', '恵比寿', '吉祥寺', '中目黒',
  '表参道', '六本木', '銀座', '代官山', '下北沢',
];

const TIME_SLOTS = [
  '平日夜(18-20時)', '平日夜(20-22時)',
  '土曜午後', '土曜夕方', '日曜午後', '日曜夕方',
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Basic Info
  const [nickname, setNickname] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [bio, setBio] = useState('');

  // Step 2: Interests
  const [interests, setInterests] = useState<string[]>([]);

  // Step 3: Lifestyle
  const [conversationDepth, setConversationDepth] = useState('BALANCED');
  const [drinkingOk, setDrinkingOk] = useState(true);
  const [smokingOk, setSmokingOk] = useState(false);
  const [quietMode, setQuietMode] = useState(false);
  const [noAlcoholMeetups, setNoAlcoholMeetups] = useState(false);

  // Step 4: Preferences
  const [ageBandMin, setAgeBandMin] = useState(25);
  const [ageBandMax, setAgeBandMax] = useState(40);
  const [preferredAreas, setPreferredAreas] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  const handleNext = () => {
    setError('');

    if (currentStep === 0) {
      if (!nickname || !birthYear) {
        setError('ニックネームと生まれ年を入力してください');
        return;
      }
      const year = parseInt(birthYear);
      if (year < 1950 || year > 2010) {
        setError('有効な生まれ年を入力してください');
        return;
      }
    }

    if (currentStep === 1) {
      if (interests.length === 0) {
        setError('少なくとも1つの興味を選択してください');
        return;
      }
    }

    if (currentStep === 3) {
      if (preferredAreas.length === 0) {
        setError('少なくとも1つのエリアを選択してください');
        return;
      }
      if (availableTimes.length === 0) {
        setError('少なくとも1つの時間帯を選択してください');
        return;
      }
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname,
          birthYear: parseInt(birthYear),
          bio,
          interests,
          conversationDepth,
          drinkingOk,
          smokingOk,
          quietMode,
          noAlcoholMeetups,
          ageBandMin,
          ageBandMax,
          preferredAreas,
          availableTimes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'エラーが発生しました');
        return;
      }

      router.push('/settings/verification');
    } catch (err) {
      setError('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            プロフィール設定
          </h1>
          <p className="text-neutral-600">
            あなたに最適なグループを見つけるために、いくつか質問にお答えください
          </p>
        </div>

        <Stepper steps={STEPS} currentStep={currentStep} />

        <Card>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-neutral-900">
                基本情報
              </h2>
              <Input
                label="ニックネーム"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                placeholder="例: さくら"
                helper="グループ内で表示される名前です"
              />
              <Input
                label="生まれ年"
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                required
                placeholder="1990"
                min="1950"
                max="2010"
              />
              <TextArea
                label="自己紹介（任意）"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="あなたについて簡単に教えてください"
                rows={4}
                helper="200文字以内"
                maxLength={200}
              />
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-neutral-900">
                興味・趣味
              </h2>
              <p className="text-neutral-600">
                あなたの興味や趣味を選んでください（最大5つ）
              </p>
              <TagPicker
                options={INTEREST_OPTIONS}
                selected={interests}
                onChange={setInterests}
                maxSelections={5}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-neutral-900">
                ライフスタイル
              </h2>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  会話の深さの好み
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'LIGHT', label: '軽い話題が好き', labelEn: 'Light topics' },
                    { value: 'BALANCED', label: 'バランス良く', labelEn: 'Balanced' },
                    { value: 'DEEP', label: '深い話がしたい', labelEn: 'Deep conversations' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="conversationDepth"
                        value={option.value}
                        checked={conversationDepth === option.value}
                        onChange={(e) => setConversationDepth(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-neutral-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={drinkingOk}
                    onChange={(e) => setDrinkingOk(e.target.checked)}
                    className="mr-2 h-4 w-4"
                  />
                  <span className="text-neutral-700">お酒を飲む場所でもOK</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={smokingOk}
                    onChange={(e) => setSmokingOk(e.target.checked)}
                    className="mr-2 h-4 w-4"
                  />
                  <span className="text-neutral-700">喫煙可の場所でもOK</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={quietMode}
                    onChange={(e) => setQuietMode(e.target.checked)}
                    className="mr-2 h-4 w-4"
                  />
                  <span className="text-neutral-700">静かな環境が好き（内向的）</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={noAlcoholMeetups}
                    onChange={(e) => setNoAlcoholMeetups(e.target.checked)}
                    className="mr-2 h-4 w-4"
                  />
                  <span className="text-neutral-700">アルコールなしの集まりを希望</span>
                </label>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-neutral-900">
                マッチング設定
              </h2>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  希望する年齢層
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={ageBandMin}
                    onChange={(e) => setAgeBandMin(parseInt(e.target.value))}
                    min="18"
                    max="80"
                    className="w-24"
                  />
                  <span>〜</span>
                  <Input
                    type="number"
                    value={ageBandMax}
                    onChange={(e) => setAgeBandMax(parseInt(e.target.value))}
                    min="18"
                    max="80"
                    className="w-24"
                  />
                  <span>歳</span>
                </div>
              </div>

              <TagPicker
                label="希望エリア（複数選択可）"
                options={AREA_OPTIONS}
                selected={preferredAreas}
                onChange={setPreferredAreas}
              />

              <TagPicker
                label="参加可能な時間帯（複数選択可）"
                options={TIME_SLOTS}
                selected={availableTimes}
                onChange={setAvailableTimes}
              />
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || isLoading}
            >
              戻る
            </Button>
            <Button
              onClick={handleNext}
              isLoading={isLoading}
            >
              {currentStep === STEPS.length - 1 ? '完了' : '次へ'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
