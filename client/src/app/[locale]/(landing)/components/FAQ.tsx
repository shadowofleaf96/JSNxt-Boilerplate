'use client';
import React from 'react';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { HiPlusSmall, HiMinusSmall } from 'react-icons/hi2';
import { useTranslation } from 'next-i18next';

const FAQ: React.FC = () => {
  const { t } = useTranslation();

  const faqs = t('faq.items', { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <div
      id="faq"
      className="mx-auto mt-24 max-w-7xl pb-4 sm:pb-8 px-6 sm:mt-48 lg:px-8"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          {t('faq.title')}
        </h2>
        <dl className="mt-16 divide-y divide-gray-900/10">
          {faqs.map((faq) => (
            <Disclosure key={faq.question} as="div" className="py-6">
              <dt>
                <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                  <span className="text-base font-semibold">
                    {faq.question}
                  </span>
                  <span className="ml-6 flex h-7 items-center">
                    <HiPlusSmall
                      aria-hidden="true"
                      className="size-6 group-data-[open]:hidden"
                    />
                    <HiMinusSmall
                      aria-hidden="true"
                      className="size-6 hidden group-data-[open]:block"
                    />
                  </span>
                </DisclosureButton>
              </dt>
              <DisclosurePanel as="dd" className="mt-2 pr-12">
                <p className="text-base text-gray-600">{faq.answer}</p>
              </DisclosurePanel>
            </Disclosure>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default FAQ;
