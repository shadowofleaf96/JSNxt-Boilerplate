'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import {
  FaNodeJs,
  FaReact,
  FaDatabase,
  FaCss3Alt,
  FaGithub,
} from 'react-icons/fa';
import { RiNextjsFill } from 'react-icons/ri';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  return (
    <main>
      <div className="relative isolate overflow-hidden min-h-screen bg-gray-900 pt-14 pb-20 sm:pb-24">
        <Image
          width={0}
          height={0}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
          sizes="(max-width: 768px) 100vw, 50vw"
          alt="Background Image"
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75"
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-24 sm:py-48 lg:py-48">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
                {t('hero.announcement.text')}{' '}
                <Link href="/changelog" className="font-semibold text-white">
                  {t('hero.announcement.link')}{' '}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-5xl font-semibold tracking-tight lg:leading-24 text-white sm:text-7xl">
                {t('hero.title')}
              </h1>
              <p className="mt-8 text-lg font-medium text-gray-400 sm:text-xl">
                {t('hero.subtitle')}
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 mb-20">
                <Link
                  href="/docs"
                  className={cn(buttonVariants({ variant: 'secondary' }))}
                >
                  {t('hero.cta.docs')}
                </Link>
                <Link
                  href="https://github.com/shadowofleaf96/JSNXT-Boilerplate"
                  className={cn(
                    buttonVariants({ variant: 'link' }),
                    'text-white hover:text-gray-300'
                  )}
                >
                  {t('hero.cta.github')}{' '}
                  <span aria-hidden="true" className="ml-2">
                    →
                  </span>
                </Link>
              </div>
            </div>
            <div className="mx-auto grid max-w-lg grid-cols-3 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-7 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-6">
              <div className="flex items-center justify-center">
                <RiNextjsFill
                  size={64}
                  className="text-white opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="flex items-center justify-center">
                <FaReact
                  size={64}
                  className="text-white opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="flex items-center justify-center">
                <FaNodeJs
                  size={64}
                  className="text-white opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="flex items-center justify-center">
                <FaDatabase
                  size={64}
                  className="text-white opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="flex items-center justify-center">
                <FaCss3Alt
                  size={64}
                  className="text-white opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="flex items-center justify-center">
                <FaGithub
                  size={64}
                  className="text-white opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-288.75"
          />
        </div>
      </div>
    </main>
  );
};
export default Hero;
