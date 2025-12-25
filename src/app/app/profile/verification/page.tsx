'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useLocale } from '@/contexts/LocaleContext';
import { t } from '@/lib/i18n';
import { Upload, CheckCircle } from 'lucide-react';

export default function VerificationPage() {
  const { locale } = useLocale();
  const [idImage, setIdImage] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);
  const [photoImage, setPhotoImage] = useState<File | null>(null);

  const handleFileChange = (type: 'id' | 'selfie' | 'photo') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'id') setIdImage(file);
      else if (type === 'selfie') setSelfieImage(file);
      else setPhotoImage(file);
    }
  };

  const handleSubmit = () => {
    // TODO: Upload images and submit for verification
    console.log('Submitting verification with:', { idImage, selfieImage, photoImage });
  };

  const canSubmit = idImage && selfieImage && photoImage;

  return (
    <>
      <Header title="本人確認" showBack />

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6 pb-32">
        <div className="space-y-2">
          <h1 className="text-heading-lg text-neutral-900">本人確認</h1>
          <p className="text-body text-neutral-700">
            安全なコミュニティのために、本人確認をお願いしています。
            提出いただいた情報は厳重に管理され、確認目的以外には使用されません。
          </p>
        </div>

        {/* ID Photo Upload */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-heading-sm text-neutral-900 mb-2">身分証明書</h3>
              <p className="text-body-sm text-neutral-600">
                運転免許証、パスポート、マイナンバーカードなど
              </p>
            </div>
            {idImage && <CheckCircle className="w-6 h-6 text-status-confirmed" />}
          </div>
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange('id')}
              className="hidden"
            />
            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-neutral-50 transition-colors">
              <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-body text-neutral-700">
                {idImage ? idImage.name : 'タップして写真をアップロード'}
              </p>
            </div>
          </label>
        </Card>

        {/* Selfie Upload */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-heading-sm text-neutral-900 mb-2">セルフィー</h3>
              <p className="text-body-sm text-neutral-600">
                身分証明書と一緒に撮影した自撮り写真
              </p>
            </div>
            {selfieImage && <CheckCircle className="w-6 h-6 text-status-confirmed" />}
          </div>
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange('selfie')}
              className="hidden"
            />
            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-neutral-50 transition-colors">
              <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-body text-neutral-700">
                {selfieImage ? selfieImage.name : 'タップして写真をアップロード'}
              </p>
            </div>
          </label>
        </Card>

        {/* Photo for Gender Verification */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-heading-sm text-neutral-900 mb-2">プロフィール写真</h3>
              <p className="text-body-sm text-neutral-600">
                顔がはっきりわかる写真（性別確認用）
              </p>
            </div>
            {photoImage && <CheckCircle className="w-6 h-6 text-status-confirmed" />}
          </div>
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange('photo')}
              className="hidden"
            />
            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-neutral-50 transition-colors">
              <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-body text-neutral-700">
                {photoImage ? photoImage.name : 'タップして写真をアップロード'}
              </p>
            </div>
          </label>
        </Card>

        <Card className="bg-background-pastel-blue border-blue-200">
          <p className="text-body-sm text-neutral-700">
            <strong>プライバシー保護について</strong><br />
            提出いただいた書類は暗号化されて保存され、承認後は速やかに削除されます。
            個人情報は本人確認の目的以外には使用されません。
          </p>
        </Card>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-background-card border-t border-neutral-200 p-4 safe-bottom">
        <div className="max-w-screen-xl mx-auto">
          <Button
            variant="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            確認書類を提出
          </Button>
        </div>
      </div>
    </>
  );
}
