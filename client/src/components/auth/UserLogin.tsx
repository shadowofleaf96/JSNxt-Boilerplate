'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/buttons/Button';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import ForgotPasswordModal from '@/components/auth/ForgotPassword';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import HCaptcha from '@hcaptcha/react-hcaptcha';
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

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hcaptchaToken, setHcaptchaToken] = useState<string | null>(null);
  const hcaptchaRef = React.useRef<HCaptcha>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push('/');
      }
    };
    checkUser();
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

    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: sanitizedEmail,
          password: sanitizedPassword,
          options: {
            captchaToken: hcaptchaToken || undefined,
          },
        });

      if (loginError) {
        console.error('Supabase Login Error:', loginError);
        throw loginError;
      }

      if (data.user) {
        const role = data.user.user_metadata.role || 'user';

        if (role === 'user') {
          router.push('/');
        } else {
          setLoading(false);
          toast.error(t('login.invalidCredentials'));
          return;
        }
      }
      hcaptchaRef.current?.resetCaptcha();
      setHcaptchaToken(null);
    } catch (err: any) {
      setLoading(false);
      hcaptchaRef.current?.resetCaptcha();
      setHcaptchaToken(null);
      console.error('Login Catch Block:', err);
      const message = err.message || 'Login failed. Please try again.';
      toast.error(message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/en/auth/callback?popup=true`,
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;

      if (data?.url) {
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        window.open(
          data.url,
          'Google Login',
          `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=yes,resizable=yes`
        );
      }
    } catch (err: any) {
      toast.error(t('login.googleLoginFailed'));
      console.error(err);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data === 'login-success'
      ) {
        setLoading(true); // Show loading spinner immediately
        toast.success(t('login.success'));
        router.refresh(); // Refresh to update server components/cookies
        router.replace('/'); // Use replace to avoid back behavior
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router, t]);

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
                disabled={loading || !hcaptchaToken}
                className="flex w-full justify-center rounded-md bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:opacity-60"
              >
                {t('login.signIn')}
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
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogleLogin}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  {t('login.orContinueWith')} Google
                </Button>
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
