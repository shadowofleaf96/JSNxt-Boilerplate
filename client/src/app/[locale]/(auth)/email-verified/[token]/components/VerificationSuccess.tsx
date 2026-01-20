'use client';

export const dynamic = 'force-dynamic';
import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Image from 'next/image';

const VerificationSuccess = () => {
  const router = useRouter();
  const { token } = useParams();
  useEffect(() => {
    if (typeof token === 'string') {
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'user');
      router.push('/');
    } else {
      const timeout = setTimeout(() => router.push('/login'), 5000);
      return () => clearTimeout(timeout);
    }
  }, [router, token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
      <div className="py-8">
        <Image
          className="h-24 w-24 mx-auto py-4"
          width={0}
          height={0}
          placeholder="blur"
          blurDataURL="data:image/png;base64,..."
          sizes="(max-width: 768px) 100vw, 50vw"
          src="/images/jsnxt-logo-black.webp"
          alt="Company Logo"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/fallback-logo.png';
          }}
        />
      </div>
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 py-4 text-foreground">
          Email Verified!
        </h1>
        <p className="text-lg text-muted-foreground mb-8 py-4">
          Logging you in automatically...
        </p>
        <LoadingSpinner size={32} className="mx-auto" />
      </div>
    </div>
  );
};

export default VerificationSuccess;
