'use client';

import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { HiBars3, HiXMark } from 'react-icons/hi2';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchCurrentUser } from '@/redux/user/usersSlice';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { googleLogout } from '@react-oauth/google';
import AxiosConfig from '@/components/utils/AxiosConfig';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const { currentUser, loading } = useSelector((state: RootState) => {
    return state.users as { currentUser: any; loading: boolean };
  });
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No user is currently logged in.');
      await AxiosConfig.post(
        `/users/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      googleLogout();
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      location.reload();
    } catch (error: any) {
      toast.error(error);
      console.error(error);
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

  const isRegularUser = currentUser?.role === 'user';

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5" prefetch={false}>
            <span className="sr-only">{t('header.ariaLabels.company')}</span>
            <Image
              width={0}
              height={0}
              placeholder="blur"
              blurDataURL="data:image/png;base64,..."
              sizes="(max-width: 768px) 100vw, 50vw"
              alt={t('header.ariaLabels.logo')}
              src="/images/jsnxt-logo-white.webp"
              className="h-16 w-auto"
            />
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
          >
            <span className="sr-only">{t('header.ariaLabels.openMenu')}</span>
            <HiBars3 className="size-6" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              prefetch={false}
              className="text-sm font-semibold text-white"
            >
              {t(`header.navigation.${item.key}`)}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center">
          <LanguageSwitcher />
          {loading ? (
            <LoadingSpinner size={5} />
          ) : currentUser && isRegularUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="p-1.5 rounded-full hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <Image
                  width={0}
                  height={0}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,..."
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
                  src={currentUser.avatar}
                  alt="User Avatar"
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-2 flex items-center gap-2 border-b border-gray-200">
                    <FiUser className="text-gray-600" />
                    <span className="text-sm font-medium">
                      {currentUser.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-4 text-left text-red-600 hover:bg-gray-50 flex items-center gap-3 transition-colors rounded-md font-semibold cursor-pointer"
                  >
                    {logoutLoading ? (
                      <LoadingSpinner size={16} className="mx-auto" />
                    ) : (
                      <>
                        <FiLogOut className="flex-shrink-0" />
                        <span className="font-semibold">
                          {t('header.auth.logout')}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              prefetch={false}
              className="text-sm font-semibold text-white"
            >
              {t('header.auth.login')} <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>

      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
          <div className="flex items-center justify-between">
            <Link href="/" prefetch={false} className="-m-1.5 p-1.5">
              <span className="sr-only">{t('header.ariaLabels.company')}</span>
              <Image
                alt="Background Image"
                width={0}
                height={0}
                placeholder="blur"
                blurDataURL="data:image/png;base64,..."
                sizes="(max-width: 768px) 100vw, 50vw"
                src="/images/jsnxt-logo-black.webp"
                className="h-12 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-400"
            >
              <span className="sr-only">
                {t('header.ariaLabels.closeMenu')}
              </span>
              <HiXMark className="size-6" />
            </button>
          </div>

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
              <div className="py-6 flex items-center">
                <LanguageSwitcher />
                {currentUser && isRegularUser ? (
                  <>
                    <h1 className="text-white underline py-2.5">
                      {currentUser.name}
                    </h1>
                    <Link
                      href="/"
                      prefetch={false}
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
                  </>
                ) : (
                  <Link
                    href="/login"
                    prefetch={false}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-white hover:bg-gray-800"
                  >
                    {t('header.auth.login')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default Header;
