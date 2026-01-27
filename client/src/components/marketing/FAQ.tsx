'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl text-center mb-16">
          {t('faq.title')}
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base font-semibold text-gray-900">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
