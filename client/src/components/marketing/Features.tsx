'use client';

import React from 'react';
import {
  CloudUpload,
  RefreshCcw,
  Fingerprint,
  Settings,
  BarChart3,
  Rss,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const Features: React.FC = () => {
  const { t } = useTranslation();

  const features = t('features.items', { returnObjects: true }) as Array<{
    name: string;
    description: string;
    icon: string;
  }>;

  const iconComponents: { [key: string]: React.ComponentType<any> } = {
    HiCloudArrowUp: CloudUpload,
    HiArrowPath: RefreshCcw,
    HiFingerPrint: Fingerprint,
    HiCog6Tooth: Settings,
    HiChartBar: BarChart3,
    HiRss: Rss,
  };

  return (
    <div id="features" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            {t('features.subtitle')}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('features.title')}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-4xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => {
              // Map old icon names to new Lucide components if needed, or assume translation file keys match
              // The translation file likely has 'HiCloudArrowUp' etc. so I matched them in iconComponents object.
              const IconComponent = iconComponents[feature.icon] || Settings;
              return (
                <Card
                  key={feature.name}
                  className="border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1 duration-300"
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-x-3 text-base font-semibold">
                      {IconComponent && (
                        <IconComponent
                          className="h-5 w-5 flex-none text-primary"
                          aria-hidden="true"
                        />
                      )}
                      {feature.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-7">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
