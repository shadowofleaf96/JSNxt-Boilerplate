'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AxiosConfig from '@/components/utils/AxiosConfig';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/user/usersSlice';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useReCaptcha } from 'next-recaptcha-v3';
import DOMPurify from 'dompurify';
import ForgotPasswordModal from '@/app/[locale]/(auth)/forgot-password/components/ForgotPassword';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [password, setPassword] = useState('');
  const { executeRecaptcha } = useReCaptcha();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role === 'user') {
      router.push('/');
    }
  }, [router]);

  const sanitizeInput = (input: string) => DOMPurify.sanitize(input.trim());

  const validateCredentials = () => {
    if (!email || !password) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    if (password.length < 8 || password.length > 50) return false;
    return true;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    if (!validateCredentials()) {
      if (!email) {
        setError('Email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address');
      } else if (!password) {
        setError('Password is required');
      } else if (password.length < 8) {
        setError('Password must be at least 8 characters');
      }
      return;
    }

    const recaptchaToken = await executeRecaptcha('form_submit');

    try {
      setLoading(true);
      const res = await AxiosConfig.post<{
        data: any;
        role: string;
        token: string;
      }>(`/users/login`, {
        identifier: sanitizedEmail,
        password: sanitizedPassword,
        recaptchaToken,
      });

      const respdata = res.data.data;

      if (respdata.role === 'user') {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', respdata.role);
        dispatch(setUser(respdata));
        router.push('/');
      } else {
        setLoading(false);
        toast.error(t('login.invalidCredentials'));
        return;
      }
    } catch (err: any) {
      setLoading(false);
      const message = err?.response?.data?.message;
      toast.error(message);
      console.log(err);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const recaptchaToken = await executeRecaptcha('google_login');
      const res = await AxiosConfig.post('/users/google-login', {
        credential: credentialResponse.credential,
        recaptchaToken,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.data.role);
      router.push('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t('login.googleLoginFailed'));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm border-border shadow-md">
        <CardHeader className="space-y-2 pb-6">
          <div className="flex justify-center mx-auto mb-2">
            <Image
              className="w-auto h-20 sm:h-20"
              width={0}
              height={0}
              priority
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
              sizes="(max-width: 768px) 100vw, 50vw"
              src="/images/jsnxt-logo-black.webp"
              alt="JSNXT"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/fallback-logo.png';
              }}
            />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-center text-foreground">
            {t('login.title')}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {t('login.registerPrompt')}{' '}
            <Link
              href="/registration"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {t('login.registerLink')}
            </Link>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('login.email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                autoComplete="email"
                minLength={5}
                maxLength={320}
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('login.password')}</Label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  {t('login.forgotPassword')}
                </button>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                autoComplete="current-password"
                minLength={8}
                maxLength={50}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            {error && (
              <p className="text-sm text-destructive font-medium" role="alert">
                {error}
              </p>
            )}

            <div className="pt-2 space-y-4">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <LoadingSpinner size={20} /> : t('login.signIn')}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground font-medium">
                    {t('login.orContinueWith')}
                  </span>
                </div>
              </div>

              <div className="flex w-full justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error(t('login.googleLoginFailed'))}
                  size="large"
                  type="standard"
                  shape="rectangular"
                  width="100%"
                  useOneTap
                  ux_mode="popup"
                  context="signin"
                  use_fedcm_for_prompt={true}
                />
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4">
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
          </form>
        </CardContent>
      </Card>
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </div>
  );
};

export default Login;
