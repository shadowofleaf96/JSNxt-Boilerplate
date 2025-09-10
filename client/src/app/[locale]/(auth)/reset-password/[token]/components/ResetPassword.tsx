'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import AxiosConfig from '@/components/utils/AxiosConfig';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams();
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
      await AxiosConfig.put(`/users/reset-password/${token}`, { password });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/jsnxt-logo-black.webp"
            alt="Logo"
            className="h-16 w-16"
            width={0}
            height={0}
            placeholder="blur"
            blurDataURL="data:image/png;base64,..."
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {t('reset.resetPassword')}
        </h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          {t('reset.enterNewPassword')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('reset.newPassword')}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('reset.confirmPassword')}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 transition"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white font-medium py-3 rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size={20} /> : t('confirm')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
