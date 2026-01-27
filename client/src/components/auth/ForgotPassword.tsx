'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/buttons/Button';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [hcaptchaToken, setHcaptchaToken] = useState<string | null>(null);
  const hcaptchaRef = React.useRef<HCaptcha>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
        captchaToken: hcaptchaToken || undefined,
      });
      if (error) throw error;
      toast.success(t('forgot.success'));
      setEmail('');
      onClose();
    } catch (error: any) {
      hcaptchaRef.current?.resetCaptcha();
      setHcaptchaToken(null);
      console.error('Forgot Password Error:', error);
      const message = error.message || t('forgot.error');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Image
              src="/images/jsnxt-logo-black.webp"
              width={0}
              height={0}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
              sizes="(max-width: 768px) 100vw, 50vw"
              alt="Logo"
              className="h-16 w-16"
            />
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-gray-800">
            {t('forgot.title')}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {t('forgot.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="sr-only">
              {t('forgot.placeholder')}
            </Label>
            <Input
              id="email"
              type="email"
              required
              placeholder={t('forgot.placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex justify-center py-2">
            <HCaptcha
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ''}
              onVerify={(token: string) => setHcaptchaToken(token)}
              ref={hcaptchaRef}
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full bg-black hover:bg-gray-800"
            disabled={loading || !hcaptchaToken}
          >
            {t('forgot.button')}
          </Button>

          <p className="text-xs text-center text-gray-500 mt-2">
            {t('register.recaptcha_disclaimer')}{' '}
            <a
              href="https://policies.google.com/privacy"
              className="underline hover:text-gray-800"
            >
              {t('register.privacy')}
            </a>{' '}
            &{' '}
            <a
              href="https://policies.google.com/terms"
              className="underline hover:text-gray-800"
            >
              {t('register.terms')}
            </a>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
