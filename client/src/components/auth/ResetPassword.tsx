'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError(t('passwordTooShort'));
      return;
    }
    if (password !== confirm) {
      setError(t('passwordsDontMatch'));
      return;
    }
    setError('');
    try {
      setLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success(t('passwordResetSuccess'));
      router.push('/login');
    } catch (err: any) {
      setError(err?.response?.data?.message || t('passwordResetError'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-2 pb-6">
          <div className="flex justify-center mb-2">
            <Image
              src="/images/jsnxt-logo-black.webp"
              alt="Logo"
              className="h-16 w-16"
              width={0}
              height={0}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-foreground">
            {t('reset.resetPassword')}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {t('reset.enterNewPassword')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">{t('reset.newPassword')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">{t('reset.confirmPassword')}</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive text-center font-medium">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <LoadingSpinner size={20} /> : t('confirm')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
