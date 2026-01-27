'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const Verification = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
      <div className="py-8">
        <Image
          className="md:w-32 w-20 h-auto mx-auto"
          width={0}
          height={0}
          placeholder="blur"
          blurDataURL="data:image/png;base64,..."
          sizes="(max-width: 768px) 100vw, 50vw"
          src="/images/jsnxt-logo-black.webp"
          alt={t('verification.logoAlt')}
        />
      </div>
      <h1 className="text-3xl font-bold mb-4 text-foreground">
        {t('verification.title')}
      </h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-md">
        {t('verification.message')}
      </p>
      <Button
        onClick={() => router.push('/login')}
        className="w-full sm:w-auto"
      >
        {t('verification.back')}
      </Button>
    </div>
  );
};

export default Verification;
