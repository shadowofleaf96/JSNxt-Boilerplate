'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [hcaptchaToken, setHcaptchaToken] = useState<string | null>(null);
  const hcaptchaRef = React.useRef<HCaptcha>(null);
  const router = useRouter();

  useEffect(() => {
    // Ensure any existing session is cleared when accessing admin login
    const supabase = createClient();
    const signOut = async () => {
      await supabase.auth.signOut();
    };
    signOut();
  }, []);

  const validateCredentials = (): boolean => {
    if (!username || !password) return false;
    if (username.length < 4 || username.length > 20) return false;
    if (password.length < 8 || password.length > 50) return false;
    return true;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateCredentials()) {
      setError(t('adminLogin.errors.invalidFormat'));
      return;
    }

    try {
      setLoading(true);
      setError('');

      const supabase = createClient();
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: username, // Assuming username field is used for email in this flow
          password: password,
          options: {
            captchaToken: hcaptchaToken || undefined,
          },
        });

      if (signInError) throw signInError;

      const role = data.user?.user_metadata?.role || 'user';

      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        setLoading(false);
        toast.error(t('adminLogin.errors.invalidCredentials'));
        return;
      }
    } catch (err: any) {
      setLoading(false);
      hcaptchaRef.current?.resetCaptcha();
      setHcaptchaToken(null);
      console.log(err);
      const message = err.message || t('adminLogin.errors.invalidCredentials');
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

            <div className="flex justify-center py-2">
              <HCaptcha
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ''}
                onVerify={(token: string) => setHcaptchaToken(token)}
                ref={hcaptchaRef}
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !hcaptchaToken}
              className="w-full"
            >
              {loading ? (
                <LoadingSpinner size={24} />
              ) : (
                t('adminLogin.login.submit')
              )}
            </Button>
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
          <p className="text-xs text-muted-foreground text-center">
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
