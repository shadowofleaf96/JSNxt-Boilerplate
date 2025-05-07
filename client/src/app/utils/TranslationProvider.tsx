'use client';

import React, { memo } from 'react';
import { I18nextProvider } from 'react-i18next';
import { createInstance } from 'i18next';
import initTranslations from '@/app/utils/i18n';

interface TranslationProviderProps {
  children: React.ReactNode;
  locale: string;
  namespaces: string[];
  resources: Record<string, any>;
}

const TranslationProvider = memo(
  ({ children, locale, namespaces, resources }: TranslationProviderProps) => {
    const i18n = createInstance();

    initTranslations(locale, namespaces, i18n, resources);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
  }
);

TranslationProvider.displayName = 'TranslationProvider';

export default TranslationProvider;
