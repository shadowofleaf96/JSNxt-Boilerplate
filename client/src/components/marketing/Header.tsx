'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Menu, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, loading } = useSelector((state: RootState) => {
    return state.users as { currentUser: any; loading: boolean };
  });
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || error);
      console.error(error);
    } finally {
      setLogoutLoading(false);
    }
  };

  const navigation = [
    { key: 'features', href: '#features' },
    { key: 'testimonials', href: '#testimonials' },
    { key: 'pricing', href: '#pricing' },
    { key: 'faq', href: '#faq' },
    {
      key: 'github',
      href: 'https://github.com/shadowofleaf96/JSNXT-Boilerplate',
    },
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">{t('header.ariaLabels.company')}</span>
            <Image
              width={0}
              height={0}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
              sizes="(max-width: 768px) 100vw, 50vw"
              alt={t('header.ariaLabels.logo')}
              src="/images/jsnxt-logo-white.webp"
              className="h-16 w-auto"
            />
          </Link>
        </div>

        <div className="flex lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-m-2.5 text-gray-400"
              >
                <span className="sr-only">
                  {t('header.ariaLabels.openMenu')}
                </span>
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-gray-900 border-gray-800 text-white"
            >
              <SheetHeader>
                <SheetTitle className="sr-only">
                  {t('header.ariaLabels.company')}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Mobile Navigation
                </SheetDescription>
                <div className="flex items-center justify-between">
                  <Link href="/" className="-m-1.5 p-1.5">
                    <Image
                      alt="Background Image"
                      width={0}
                      height={0}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                      sizes="(max-width: 768px) 100vw, 50vw"
                      src="/images/jsnxt-logo-black.webp"
                      className="h-12 w-auto"
                    />
                  </Link>
                </div>
              </SheetHeader>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/25">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-gray-800"
                      >
                        {t(`header.navigation.${item.key}`)}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6 flex items-center gap-4 flex-wrap">
                    <LanguageSwitcher />
                    {currentUser ? (
                      <div className="w-full">
                        <div className="flex items-center gap-3 py-2.5 text-white">
                          <Avatar>
                            <AvatarImage
                              src={currentUser.avatar}
                              alt={currentUser.name}
                            />
                            <AvatarFallback>
                              {currentUser.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-base font-semibold">
                            {currentUser.name}
                          </span>
                        </div>

                        <Link
                          href="/"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-white hover:bg-gray-800"
                        >
                          {t('header.profile.title')}
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left -mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-white hover:bg-gray-800"
                        >
                          {t('header.auth.logout')}
                        </button>
                      </div>
                    ) : (
                      <Link
                        href="/login"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-white hover:bg-gray-800"
                      >
                        {t('header.auth.login')}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-sm font-semibold text-white hover:text-gray-300 transition-colors"
            >
              {t(`header.navigation.${item.key}`)}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-4">
          <LanguageSwitcher />
          {loading ? (
            <LoadingSpinner size={20} />
          ) : currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={currentUser.avatar}
                      alt={currentUser.name}
                    />
                    <AvatarFallback>
                      {currentUser.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {currentUser.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  {logoutLoading ? (
                    <LoadingSpinner size={16} />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  <span>{t('header.auth.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold text-white hover:text-gray-300 transition-colors"
            >
              {t('header.auth.login')} <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
