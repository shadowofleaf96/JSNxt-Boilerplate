'use client';

import Link from 'next/link';
import { HiCheck } from 'react-icons/hi';
import { useTranslation } from 'next-i18next';

const Pricing: React.FC = () => {
  const { t } = useTranslation();

  const tiers = t('pricing.tiers', { returnObjects: true }) as Array<{
    name: string;
    id: string;
    href: string;
    priceMonthly: string;
    description: string;
    features: string[];
    featured: boolean;
  }>;

  function classNames(
    ...classes: (string | false | null | undefined)[]
  ): string {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <div
      id="pricing"
      className="relative isolate mt-24 bg-white px-6 sm:mt-48 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="mx-auto aspect-1155/678 w-[72.1875rem] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      <div className="mx-auto max-w-2xl sm:text-center">
        <h2 className="text-base font-semibold text-gray-600">
          {t('pricing.title')}
        </h2>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl sm:text-balance">
          {t('pricing.heading')}
        </p>
        <p className="mt-6 text-lg text-gray-600">{t('pricing.subheading')}</p>
      </div>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured
                ? 'relative bg-gray-900 shadow-2xl'
                : 'bg-white/60 sm:mx-8 lg:mx-0',
              'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10'
            )}
          >
            <h3
              id={tier.id}
              className={classNames(
                tier.featured ? 'text-gray-400' : 'text-gray-600',
                'text-base font-semibold'
              )}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={classNames(
                  tier.featured ? 'text-white' : 'text-gray-900',
                  'text-5xl font-semibold tracking-tight'
                )}
              >
                {tier.priceMonthly}
              </span>
              <span
                className={classNames(
                  tier.featured ? 'text-gray-400' : 'text-gray-500',
                  'text-base'
                )}
              >
                /month
              </span>
            </p>
            <p
              className={classNames(
                tier.featured ? 'text-gray-300' : 'text-gray-600',
                'mt-6 text-base'
              )}
            >
              {tier.description}
            </p>
            <ul
              role="list"
              className={classNames(
                tier.featured ? 'text-gray-300' : 'text-gray-600',
                'mt-8 space-y-3 text-sm'
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <HiCheck
                    aria-hidden="true"
                    className={classNames(
                      tier.featured ? 'text-gray-400' : 'text-gray-600',
                      'h-6 w-5 flex-none'
                    )}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={tier.href}
              className={classNames(
                tier.featured
                  ? 'bg-gray-500 text-white hover:bg-gray-400'
                  : 'text-gray-600 ring-1 ring-gray-200 hover:ring-gray-300',
                'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold'
              )}
            >
              {t('pricing.cta')}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
