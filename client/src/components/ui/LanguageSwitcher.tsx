"use client";

import { Fragment } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import ReactCountryFlag from "react-country-flag";
import { FaChevronDown } from "react-icons/fa";

const languages = [
  { code: "en", countryCode: "GB", label: "English" },
  { code: "fr", countryCode: "FR", label: "Français" },
  { code: "ar", countryCode: "MA", label: "العربية" },
];

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);

  const isFirstSegmentLanguage = languages.some(
    (lang) => lang.code === pathSegments[0]
  );

  const currentLangCode = isFirstSegmentLanguage ? pathSegments[0] : "en";
  const currentLanguage =
    languages.find((lang) => lang.code === currentLangCode) || languages[0];

  const handleLanguageChange = (newLang: string) => {
    let newPath: string;

    if (isFirstSegmentLanguage) {
      newPath = `/${newLang}/${pathSegments.slice(1).join("/")}`;
    } else {
      newPath = `/${newLang}${pathname}`;
    }

    router.push(newPath);
  };

  return (
    <Menu as="div" className="relative inline-block text-left mr-3 rtl:ml-3">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-2 rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors">
          <div className="flex items-center space-x-2">
            <ReactCountryFlag
              countryCode={currentLanguage.countryCode}
              svg
              style={{ width: "1.5em", height: "1.5em" }}
              className="rounded-sm"
            />
            <span className="text-gray-700 dark:text-gray-200">
              {currentLanguage.label}
            </span>
          </div>
          <FaChevronDown
            className="-mr-1 h-5 w-5 text-gray-600 dark:text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-36 sm:w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 focus:outline-none">
          <div className="py-1">
            {languages.map(({ code, countryCode, label }) => (
              <Menu.Item key={code}>
                {({ active }) => (
                  <button
                    onClick={() => handleLanguageChange(code)}
                    className={`${
                      active
                        ? "bg-blue-50 text-blue-700 dark:bg-gray-700/80 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-200"
                    } flex w-full items-center space-x-3 px-4 py-2.5 text-sm transition-colors`}
                  >
                    <ReactCountryFlag
                      countryCode={countryCode}
                      svg
                      style={{ width: "1.5em", height: "1.5em" }}
                      className="rounded-sm"
                    />
                    <span>{label}</span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default LanguageSwitcher;
