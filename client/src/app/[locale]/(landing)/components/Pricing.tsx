'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

  return (
    <div
      id="pricing"
      className="relative isolate mt-24 bg-background px-6 sm:mt-48 lg:px-8"
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
          className="mx-auto aspect-1155/678 w-288.75 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      <div className="mx-auto max-w-2xl sm:text-center">
        <h2 className="text-base font-semibold text-primary">
          {t('pricing.title')}
        </h2>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl sm:text-balance">
          {t('pricing.heading')}
        </p>
        <p className="mt-6 text-lg text-muted-foreground">
          {t('pricing.subheading')}
        </p>
      </div>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3 lg:gap-x-8">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className={cn(
              tier.featured
                ? 'relative bg-gray-900 text-white shadow-2xl border-gray-900 scale-105 z-10'
                : 'bg-card text-card-foreground border-border',
              'rounded-3xl transition-transform hover:scale-[1.02] duration-300'
            )}
          >
            <CardHeader>
              <CardTitle
                id={tier.id}
                className={cn(
                  tier.featured ? 'text-gray-300' : 'text-foreground',
                  'text-base font-semibold'
                )}
              >
                {tier.name}
              </CardTitle>
              <CardDescription className="flex items-baseline gap-x-2 mt-4">
                <span
                  className={cn(
                    tier.featured ? 'text-white' : 'text-foreground',
                    'text-5xl font-semibold tracking-tight'
                  )}
                >
                  {tier.priceMonthly}
                </span>
                <span
                  className={cn(
                    tier.featured ? 'text-gray-400' : 'text-muted-foreground',
                    'text-base'
                  )}
                >
                  /month
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p
                className={cn(
                  tier.featured ? 'text-gray-300' : 'text-muted-foreground',
                  'text-base'
                )}
              >
                {tier.description}
              </p>
              <ul
                role="list"
                className={cn(
                  tier.featured ? 'text-gray-300' : 'text-muted-foreground',
                  'mt-8 space-y-3 text-sm'
                )}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      aria-hidden="true"
                      className={cn(
                        tier.featured ? 'text-white' : 'text-primary',
                        'h-6 w-5 flex-none'
                      )}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className={cn(
                  tier.featured
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'w-full',
                  'w-full'
                )}
                variant={tier.featured ? 'default' : 'outline'}
              >
                <Link href={tier.href} aria-describedby={tier.id}>
                  {t('pricing.cta')}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
