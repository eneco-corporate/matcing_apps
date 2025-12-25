'use client';

import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLocale } from '@/contexts/LocaleContext';
import { t } from '@/lib/i18n';
import { ChevronRight, Upload, Globe } from 'lucide-react';
import Link from 'next/link';

// Mock data
const mockUser = {
  nickname: 'Natsuki',
  email: 'natsuki@example.com',
  photoUrl: '',
  verificationStatus: 'unverified' as const,
};

export default function ProfilePage() {
  const { locale, setLocale } = useLocale();

  const handleLanguageToggle = () => {
    setLocale(locale === 'ja' ? 'en' : 'ja');
  };

  const handleLogout = () => {
    // TODO: Implement logout
    console.log('Logout');
  };

  return (
    <>
      <Header title={t('profile.title', locale)} />

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Section */}
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center">
              {mockUser.photoUrl ? (
                <img
                  src={mockUser.photoUrl}
                  alt={mockUser.nickname}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-2xl font-semibold text-neutral-700">
                  {mockUser.nickname.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-heading-sm text-neutral-900 mb-1">
                {mockUser.nickname}
              </h2>
              <p className="text-body-sm text-neutral-600">{mockUser.email}</p>
            </div>
          </div>

          <Button variant="outline" fullWidth>
            プロフィールを編集
          </Button>
        </Card>

        {/* Verification Status */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading-sm text-neutral-900">
              {t('profile.verification', locale)}
            </h3>
            <Badge variant={mockUser.verificationStatus === 'unverified' ? 'error' : 'success'}>
              {t(`profile.verificationStatus.${mockUser.verificationStatus}`, locale)}
            </Badge>
          </div>
          {mockUser.verificationStatus === 'unverified' && (
            <div className="space-y-3">
              <p className="text-body text-neutral-700">
                本人確認を完了すると、すべてのイベントに参加できるようになります。
              </p>
              <Link href="/app/profile/verification">
                <Button variant="outline" fullWidth>
                  <Upload className="w-4 h-4 mr-2" />
                  {t('profile.uploadPhoto', locale)}
                </Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Language Toggle */}
        <Card padding="md">
          <button
            onClick={handleLanguageToggle}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-neutral-600" />
              <span className="text-body font-medium text-neutral-900">
                {t('profile.language', locale)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-body text-neutral-600">
                {locale === 'ja' ? t('profile.japanese', locale) : t('profile.english', locale)}
              </span>
              <ChevronRight className="w-5 h-5 text-neutral-400" />
            </div>
          </button>
        </Card>

        {/* Guidelines Link */}
        <Link href="/terms">
          <Card padding="md">
            <div className="flex items-center justify-between">
              <span className="text-body font-medium text-neutral-900">
                {t('profile.guidelines', locale)}
              </span>
              <ChevronRight className="w-5 h-5 text-neutral-400" />
            </div>
          </Card>
        </Link>

        {/* Logout Button */}
        <Button variant="outline" fullWidth onClick={handleLogout} className="text-red-600 border-red-300 hover:bg-red-50">
          {t('profile.logout', locale)}
        </Button>
      </div>
    </>
  );
}
