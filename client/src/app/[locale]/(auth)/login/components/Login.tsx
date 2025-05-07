'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AxiosConfig from '@/components/utils/AxiosConfig';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useReCaptcha } from 'next-recaptcha-v3';
import DOMPurify from 'dompurify';
import ForgotPasswordModal from '@/app/[locale]/(auth)/forgot-password/components/ForgotPassword';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import Image from 'next/image';

const Login: React.FC = () => {
  const { t } = useTranslation();
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
    <div className="flex min-h-screen flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Image
              className="md:w-32 w-20 h-auto mx-auto"
              width={0}
              height={0}
              placeholder="blur"
              blurDataURL="data:image/png;base64,..."
              sizes="(max-width: 768px) 100vw, 50vw"
              src="/images/jsnxt-logo-black.webp"
              alt="JSNXT"
            />
            <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">
              {t('login.title')}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {t('login.registerPrompt')}{' '}
              <Link
                href="/registration"
                prefetch={false}
                className="font-semibold text-gray-600 hover:text-gray-500"
              >
                {t('login.registerLink')}
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900"
                >
                  {t('login.email')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                  minLength={5}
                  maxLength={320}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-600 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  {t('login.password')}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  minLength={8}
                  maxLength={50}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-600 sm:text-sm"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="font-semibold text-gray-600 hover:text-gray-500 cursor-pointer"
                  >
                    {t('login.forgotPassword')}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-black px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:opacity-50"
                >
                  {loading ? <LoadingSpinner size={5} /> : t('login.signIn')}
                </button>
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-2 text-gray-500">
                        {t('login.orContinueWith')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex w-full justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => toast.error(t('login.googleLoginFailed'))}
                      size="large"
                      type="standard"
                      shape="square"
                      useOneTap
                      ux_mode="popup"
                      context="signin"
                      use_fedcm_for_prompt={true}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 mt-6">
                {t('register.recaptcha_disclaimer')}{' '}
                <a
                  href="https://policies.google.com/privacy"
                  className="underline"
                >
                  {t('register.privacy')}
                </a>{' '}
                &{' '}
                <a
                  href="https://policies.google.com/terms"
                  className="underline"
                >
                  {t('register.terms')}
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          width={0}
          height={0}
          placeholder="blur"
          blurDataURL="data:image/png;base64,..."
          sizes="(max-width: 768px) 100vw, 50vw"
          alt="Background"
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </div>
  );
};

export default Login;
