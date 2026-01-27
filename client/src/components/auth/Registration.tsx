'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import DOMPurify from 'dompurify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import HCaptcha from '@hcaptcha/react-hcaptcha';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Button from '@/components/ui/buttons/Button';

const registrationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be at most 50 characters'),
  acceptPolicy: z.boolean().refine((val) => val === true, {
    message: 'You must accept the privacy policy',
  }),
});

const Registration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [hcaptchaToken, setHcaptchaToken] = useState<string | null>(null);
  const hcaptchaRef = React.useRef<HCaptcha>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      acceptPolicy: false,
    },
  });

  useEffect(() => {
    // Auth state handled globally by SupabaseAuthProvider
  }, []);

  const onSubmit = async (data: z.infer<typeof registrationSchema>) => {
    const sanitizedData = {
      name: DOMPurify.sanitize(data.name.trim()),
      email: DOMPurify.sanitize(data.email.trim()),
      password: DOMPurify.sanitize(data.password.trim()),
    };

    try {
      setLoading(true);
      setError('');
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: sanitizedData.email,
        password: sanitizedData.password,
        options: {
          data: {
            full_name: sanitizedData.name,
            role: 'user',
          },
          captchaToken: hcaptchaToken || undefined,
        },
      });

      if (signUpError) {
        console.error('Supabase SignUp Error:', signUpError);
        throw signUpError;
      }

      if (data.user && data.session) {
        // User is logged in automatically if email verification is disabled
        router.push('/');
      } else {
        // Verification email sent
        router.push('/verify-email');
      }
    } catch (err: any) {
      console.error('Registration Catch Block:', err);
      const msg = err.message || 'Registration failed. Please try again.';
      toast.error(msg);
      setError(msg);
      hcaptchaRef.current?.resetCaptcha();
      setHcaptchaToken(null);
    } finally {
      setLoading(false);
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
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
              sizes="(max-width: 768px) 100vw, 50vw"
              src="/images/jsnxt-logo-black.webp"
              alt="Your Company"
            />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-center text-foreground">
            {t('register.create_account')}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {t('register.already_have_account')}{' '}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {t('register.sign_in_here')}
            </Link>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('register.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('register.email')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('register.password')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acceptPolicy"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-muted/50 border border-muted">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal text-sm text-foreground">
                        {t('register.accept_policy')}{' '}
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(true)}
                          className="underline font-medium text-primary hover:text-primary/80"
                        >
                          {t('register.privacy_policy')}
                        </button>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {error && (
                <div className="text-sm text-destructive font-medium">
                  {error}
                </div>
              )}

              <div className="flex justify-center py-2">
                <HCaptcha
                  sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ''}
                  onVerify={(token: string) => setHcaptchaToken(token)}
                  ref={hcaptchaRef}
                />
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={loading || !hcaptchaToken}
                  className="flex w-full justify-center rounded-md bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:opacity-60"
                >
                  {loading ? (
                    <LoadingSpinner size={20} />
                  ) : (
                    t('register.submit')
                  )}
                </Button>
              </div>
              <p className="text-xs text-center text-gray-500 mt-6">
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
          </Form>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>{t('register.policy_title')}</DialogTitle>
            <DialogDescription>
              {t('register.policy_description') ||
                'Please read our privacy policy carefully.'}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {Object.values(
              t('register.policy_content', { returnObjects: true })
            ).map((text: any, index: number) => (
              <p key={index} className="mb-2 text-sm text-muted-foreground">
                {text}
              </p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Registration;
