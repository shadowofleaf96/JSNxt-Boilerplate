'use client';

import React, { useState } from 'react';
import AxiosConfig from '@/components/utils/AxiosConfig';
import { toast } from 'react-toastify';
import { useReCaptcha } from 'next-recaptcha-v3';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  const { executeRecaptcha } = useReCaptcha();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const recaptchaToken = await executeRecaptcha('form_submit');

      await AxiosConfig.post('/users/forgot-password', {
        email,
        recaptchaToken,
      });
      toast.success(t('forgot.success'));
      setEmail('');
      onClose();
    } catch (error: any) {
      console.error(error);
      const message = error?.response?.data?.message || t('forgot.error');
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

          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-800"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size={20} /> : t('forgot.button')}
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
