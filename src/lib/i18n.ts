export type Locale = 'ja' | 'en';

export const translations = {
  ja: {
    // Navigation
    nav: {
      home: 'ホーム',
      explore: '探す',
      chat: 'チャット',
      grads: '特典',
      profile: 'プロフィール',
    },
    // Home screen
    home: {
      greeting: 'こんにちは、{name}',
      cantMakeIt: '日程が合わない？',
      change: '変更する',
      personalityTest: '性格診断',
      free: '無料',
      whatIsYourType: 'あなたのソーシャルタイプは？',
      takeDiagnostic: '診断する',
      confirmAttendance: '参加確認',
      unconfirmed: '未確認',
      addIntro: '自己紹介を追加',
      inviteFriend: '友だちを招待（無料）',
    },
    // Explore screen
    explore: {
      title: '探す',
      filter: '絞り込み',
      reset: 'リセット',
    },
    // Event detail
    event: {
      confirmed: '確認済み',
      unconfirmed: '未確認',
      attending: '参加済み',
      details: '詳細',
      confirmAttendance: '参加を確定する',
      changeSchedule: '日程変更',
      location: '場所',
      time: '時間',
    },
    // Series/Experiences
    series: {
      title: '体験プラン',
      locked: 'ロック中',
      completed: '完了',
      current: '現在',
    },
    // Grads/Perks
    grads: {
      title: '特典',
      membersOnly: '✨ 会員限定',
      subtitle: 'シリーズ完走後のコミュニティ特典',
      pricePerYear: '年額 ¥{price}｜いつでも解約',
      join: '年額プランに参加する',
      comingSoon: '近日公開',
    },
    // Chat
    chat: {
      title: 'チャット',
      typeMessage: 'メッセージを入力...',
      send: '送信',
      report: '報告',
    },
    // Profile/Settings
    profile: {
      title: 'プロフィール',
      language: '言語',
      japanese: '日本語',
      english: 'English',
      verification: '本人確認',
      verificationStatus: {
        unverified: '未確認',
        pending: '審査中',
        verified: '確認済み',
        rejected: '却下',
      },
      uploadPhoto: '写真をアップロード',
      guidelines: '利用ガイドライン',
      logout: 'ログアウト',
    },
    // Admin
    admin: {
      title: '管理画面',
      createSeries: 'シリーズを作成',
      verifications: '本人確認',
      pendingVerifications: '審査待ち',
      approve: '承認',
      reject: '却下',
    },
    // Common
    common: {
      back: '戻る',
      save: '保存',
      cancel: 'キャンセル',
      delete: '削除',
      edit: '編集',
      close: '閉じる',
    },
  },
  en: {
    // Navigation
    nav: {
      home: 'Home',
      explore: 'Explore',
      chat: 'Chat',
      grads: 'Perks',
      profile: 'Profile',
    },
    // Home screen
    home: {
      greeting: 'Hello, {name}',
      cantMakeIt: "Can't make it?",
      change: 'Change',
      personalityTest: 'Personality Test',
      free: 'Free',
      whatIsYourType: 'What is your social type?',
      takeDiagnostic: 'Take Test',
      confirmAttendance: 'Confirm Attendance',
      unconfirmed: 'Unconfirmed',
      addIntro: 'Add Introduction',
      inviteFriend: 'Invite a Friend (Free)',
    },
    // Explore screen
    explore: {
      title: 'Explore',
      filter: 'Filter',
      reset: 'Reset',
    },
    // Event detail
    event: {
      confirmed: 'Confirmed',
      unconfirmed: 'Unconfirmed',
      attending: 'Attending',
      details: 'Details',
      confirmAttendance: 'Confirm Attendance',
      changeSchedule: 'Change Schedule',
      location: 'Location',
      time: 'Time',
    },
    // Series/Experiences
    series: {
      title: 'Experiences',
      locked: 'Locked',
      completed: 'Completed',
      current: 'Current',
    },
    // Grads/Perks
    grads: {
      title: 'Perks',
      membersOnly: '✨ Members Only',
      subtitle: 'Community perks after completing the series',
      pricePerYear: '¥{price}/year｜Cancel anytime',
      join: 'Join Annual Plan',
      comingSoon: 'Coming Soon',
    },
    // Chat
    chat: {
      title: 'Chat',
      typeMessage: 'Type a message...',
      send: 'Send',
      report: 'Report',
    },
    // Profile/Settings
    profile: {
      title: 'Profile',
      language: 'Language',
      japanese: '日本語',
      english: 'English',
      verification: 'Verification',
      verificationStatus: {
        unverified: 'Unverified',
        pending: 'Pending',
        verified: 'Verified',
        rejected: 'Rejected',
      },
      uploadPhoto: 'Upload Photo',
      guidelines: 'Guidelines',
      logout: 'Logout',
    },
    // Admin
    admin: {
      title: 'Admin',
      createSeries: 'Create Series',
      verifications: 'Verifications',
      pendingVerifications: 'Pending Verifications',
      approve: 'Approve',
      reject: 'Reject',
    },
    // Common
    common: {
      back: 'Back',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
    },
  },
} as const;

export function formatDate(date: Date, locale: Locale = 'ja'): string {
  if (locale === 'ja') {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

export function formatDateTime(date: Date, locale: Locale = 'ja'): string {
  if (locale === 'ja') {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}年${month}月${day}日・${hours}:${minutes}`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

export function formatDateWithWeekday(date: Date, locale: Locale = 'ja'): string {
  if (locale === 'ja') {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return `${month}月${day}日(${weekday})`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    });
  }
}

export function t(key: string, locale: Locale = 'ja', params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value: any = translations[locale];

  for (const k of keys) {
    value = value?.[k];
  }

  if (typeof value !== 'string') {
    return key;
  }

  if (params) {
    return Object.entries(params).reduce((str, [key, val]) => {
      return str.replace(`{${key}}`, String(val));
    }, value);
  }

  return value;
}
