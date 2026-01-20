'use client';

import React from 'react';
import Link from 'next/link';
import { Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'next-i18next';

function NotFound() {
  const { t } = useTranslation();

  return (
    <section className="bg-background">
      <div className="container flex items-center min-h-screen px-6 py-12 mx-auto">
        <div className="flex flex-col items-center max-w-sm mx-auto text-center">
          <p className="p-3 text-sm font-medium text-blue-500 rounded-full bg-blue-50 dark:bg-gray-800">
            <Info className="w-6 h-6" />
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-foreground md:text-3xl">
            {t('notfound.title')}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {t('notfound.description')}
          </p>

          <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto gap-x-2"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                <span>{t('notfound.goBack')}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
