'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'react-toastify';
import { useReCaptcha } from 'next-recaptcha-v3';
import AxiosConfig from '@/components/utils/AxiosConfig';
import DOMPurify from 'dompurify';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { executeRecaptcha } = useReCaptcha();
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input.trim());
  };

  const validateCredentials = (): boolean => {
    if (!username || !password) return false;
    if (username.length < 4 || username.length > 20) return false;
    if (password.length < 8 || password.length > 50) return false;
    return true;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);

    if (!validateCredentials()) {
      setError(t('adminLogin.errors.invalidFormat'));
      return;
    }

    try {
      setLoading(true);
      setError('');

      const recaptchaToken = await executeRecaptcha('form_submit');

      const response = await AxiosConfig.post<{
        data: any;
        token: string;
      }>(`/users/login`, {
        identifier: sanitizedUsername,
        password: sanitizedPassword,
        recaptchaToken,
      });

      const respdata = response.data.data;

      if (respdata.role === 'admin') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', respdata.role);
        router.push('/admin/dashboard');
      } else {
        setLoading(false);
        toast.error(t('adminLogin.errors.invalidCredentials'));
        return;
      }
    } catch (err: any) {
      setLoading(false);
      console.log(err);
      const message = t('adminLogin.errors.invalidCredentials');
      toast.error(message);
      setError(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm border-border shadow-md">
        <CardHeader className="space-y-2 pb-6">
          <div className="flex justify-center mx-auto mb-2">
            <Image
              className="w-auto h-24 sm:h-24"
              width={0}
              height={0}
              priority
              placeholder="blur"
              blurDataURL="data:image/png;base64,..."
              sizes="(max-width: 768px) 100vw, 50vw"
              src="/images/jsnxt-logo-black.webp"
              alt="Company Logo"
            />
          </div>
          <CardTitle className="text-2xl font-bold flex justify-center text-foreground my-4">
            {t('adminLogin.login.title')}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">
                {t('adminLogin.fields.username')}
              </Label>
              <Input
                id="username"
                type="text"
                name="username"
                required
                minLength={4}
                maxLength={20}
                pattern="[a-zA-Z0-9]+"
                value={username}
                autoComplete="username"
                onChange={(e) =>
                  setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {t('adminLogin.fields.password')}
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                required
                minLength={8}
                maxLength={50}
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <div className="mt-6">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <LoadingSpinner size={24} />
                ) : (
                  t('adminLogin.login.submit')
                )}
              </Button>
            </div>
          </form>

          <div className="mt-4 text-left text-sm text-muted-foreground">
            {t('adminLogin.login.securityPrompt')}
            <ul className="list-disc list-inside text-left mt-2">
              {t('adminLogin.login.secureTip1')}
              <br />
              {t('adminLogin.login.secureTip2')}
              <br />
              {t('adminLogin.login.secureTip3')}
            </ul>
          </div>
          <p className="mt-6 text-xs text-muted-foreground text-center">
            {t('register.recaptcha_disclaimer')}{' '}
            <a
              href="https://policies.google.com/privacy"
              className="underline hover:text-foreground"
            >
              {t('register.privacy')}
            </a>{' '}
            &{' '}
            <a
              href="https://policies.google.com/terms"
              className="underline hover:text-foreground"
            >
              {t('register.terms')}
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
