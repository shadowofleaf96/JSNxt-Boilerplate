import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'next-i18next';

interface ErrorProps {
  error: {
    message: string;
  };
}

const Error: React.FC<ErrorProps> = ({ error }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col mt-24 items-center h-screen mx-auto">
      <Image
        width={0}
        height={0}
        placeholder="blur"
        blurDataURL="data:image/png;base64,..."
        sizes="(max-width: 768px) 100vw, 50vw"
        className="h-auto w-52 object-cover"
        src="/images/error.webp"
        alt="errorImg"
      />
      <h2 className="flex flex-row font-semibold text-2xl mt-4 mb-4">
        {t('navbar.errors.generic')}
      </h2>
      <p>{error.message}</p>
    </div>
  );
};

export default Error;
