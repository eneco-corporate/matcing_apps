import React from 'react';

interface SafetyBannerProps {
  locale?: 'ja' | 'en';
}

export default function SafetyBanner({ locale = 'ja' }: SafetyBannerProps) {
  const content = {
    ja: {
      title: '安全に関する重要なお知らせ',
      items: [
        '公共の場所で会いましょう',
        '信頼できる人に予定を共有しましょう',
        '違和感を感じたらすぐに報告してください',
        '個人情報（住所、職場など）は慎重に共有しましょう',
      ],
    },
    en: {
      title: 'Safety Guidelines',
      items: [
        'Meet in public places',
        'Share your plans with someone you trust',
        'Report anything that makes you uncomfortable',
        'Be cautious when sharing personal information',
      ],
    },
  };

  const text = content[locale];

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-amber-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-semibold text-amber-800">{text.title}</h3>
          <ul className="mt-2 text-sm text-amber-700 list-disc list-inside space-y-1">
            {text.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
