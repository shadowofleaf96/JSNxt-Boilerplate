'use client';

import React from 'react';
import {
  HiCloudArrowUp,
  HiArrowPath,
  HiFingerPrint,
  HiCog6Tooth,
  HiChartBar,
  HiRss,
} from 'react-icons/hi2';
import { useTranslation } from 'next-i18next';

const Features: React.FC = () => {
  const { t } = useTranslation();
  
  const features = t('features.items', { returnObjects: true }) as Array<{
    name: string;
    description: string;
    icon: string;
  }>;

  const iconComponents: { [key: string]: React.ComponentType<any> } = {
    HiCloudArrowUp,
    HiArrowPath,
    HiFingerPrint,
    HiCog6Tooth,
    HiChartBar,
    HiRss,
  };

  return (
    <div id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-gray-400">
            {t('features.subtitle')}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('features.title')}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-4xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-y-10 text-base leading-7 text-gray-900 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {features.map((feature) => {
              const IconComponent = iconComponents[feature.icon];
              return (
                <div key={feature.name} className="relative pl-9">
                  <dt className="font-semibold text-gray-900">
                    {IconComponent && (
                      <IconComponent
                        className="absolute left-1 top-1 h-5 w-5 text-gray-800"
                        aria-hidden="true"
                      />
                    )}
                    {feature.name}
                  </dt>
                  <dd className="mt-2">{feature.description}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Features;