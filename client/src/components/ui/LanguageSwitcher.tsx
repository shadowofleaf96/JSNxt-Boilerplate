'use client';

import { useRouter, usePathname } from 'next/navigation';
import ReactCountryFlag from 'react-country-flag';
import { FaChevronDown } from 'react-icons/fa';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'en', countryCode: 'GB', label: 'English' },
  { code: 'fr', countryCode: 'FR', label: 'Français' },
  { code: 'ar', countryCode: 'MA', label: 'العربية' },
];

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();

  const pathSegments = pathname.split('/').filter(Boolean);

  const isFirstSegmentLanguage = languages.some(
    (lang) => lang.code === pathSegments[0]
  );

  const currentLangCode = isFirstSegmentLanguage ? pathSegments[0] : 'en';
  const currentLanguage =
    languages.find((lang) => lang.code === currentLangCode) || languages[0];

  const handleLanguageChange = (newLang: string) => {
    let newPath: string;

    if (isFirstSegmentLanguage) {
      newPath = `/${newLang}/${pathSegments.slice(1).join('/')}`;
    } else {
      newPath = `/${newLang}${pathname}`;
    }

    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-x-2 bg-gray-700 text-gray-100 hover:bg-gray-600 border-gray-600"
        >
          <ReactCountryFlag
            countryCode={currentLanguage.countryCode}
            svg
            style={{ width: '1.5em', height: '1.5em' }}
            className="rounded-sm"
          />
          <span className="hidden sm:inline-block">
            {currentLanguage.label}
          </span>
          <FaChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-36 bg-white dark:bg-gray-800"
      >
        {languages.map(({ code, countryCode, label }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code)}
            className={cn(
              'flex items-center gap-x-3 cursor-pointer',
              currentLangCode === code && 'bg-gray-100 dark:bg-gray-700'
            )}
          >
            <ReactCountryFlag
              countryCode={countryCode}
              svg
              style={{ width: '1.5em', height: '1.5em' }}
              className="rounded-sm"
            />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
