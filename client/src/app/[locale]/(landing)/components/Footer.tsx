'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'next-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const footerNavigation = {
    solutions: {
      title: t('footer.navigation.solutions.title'),
      items: t('footer.navigation.solutions.items', { returnObjects: true }) as Array<{
        name: string;
        href: string;
      }>
    },
    support: {
      title: t('footer.navigation.support.title'),
      items: t('footer.navigation.support.items', { returnObjects: true }) as Array<{
        name: string;
        href: string;
      }>
    },
    company: {
      title: t('footer.navigation.company.title'),
      items: t('footer.navigation.company.items', { returnObjects: true }) as Array<{
        name: string;
        href: string;
      }>
    },
    legal: {
      title: t('footer.navigation.legal.title'),
      items: t('footer.navigation.legal.items', { returnObjects: true }) as Array<{
        name: string;
        href: string;
      }>
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-12 sm:pb-4 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <Image
            alt="JSNXT"
            src="/images/jsnxt-logo-white.webp"
            className="h-auto w-28"
            width={0}
            height={0}
            placeholder="blur"
            blurDataURL="data:image/png;base64,..."
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="mt-8 flex flex-wrap gap-8 xl:col-span-2 xl:mt-0">
            {Object.entries(footerNavigation).map(([sectionKey, section]) => (
              <div key={sectionKey} className="min-w-[120px]">
                <h3 className="text-sm font-semibold capitalize">{section.title}</h3>
                <ul className="mt-4 space-y-2">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        prefetch={false}
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-sm text-gray-400 text-center">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;