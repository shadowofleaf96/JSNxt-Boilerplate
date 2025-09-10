'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchCurrentUser } from '@/redux/user/usersSlice';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { IoMenu } from 'react-icons/io5';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'react-toastify';
import AxiosConfig from '@/components/utils/AxiosConfig';
import Image from 'next/image';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useTranslation } from 'next-i18next';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

function Navbar({ toggleSidebar, isSidebarOpen }: NavbarProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { currentUser, loading: userLoading } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error(t('navbar.errors.notLoggedIn'));

      await AxiosConfig.post(
        `/users/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      router.push('/admin/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('navbar.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-[60] bg-white border-b border-gray-200 text-sm py-2 sm:py-4">
      <nav
        className="max-w-7xl flex basis-full items-center w-full mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex-1 flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {!isSidebarOpen && <IoMenu className="text-xl" />}
          </button>

          <div className="hidden sm:block flex-1 max-w-xl">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                <svg
                  className="w-4 h-4 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('navbar.placeholders.search')}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <LanguageSwitcher />

          {userLoading ? (
            <LoadingSpinner size={20} />
          ) : currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-1.5 rounded-full border-2 border-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Image
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
                  src={currentUser.avatar}
                  alt={t('navbar.alt.userAvatar')}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2 flex items-center gap-2 border-b border-gray-200">
                    <FiUser className="text-gray-600" />
                    <span className="text-sm font-medium">
                      {currentUser.username}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-4 text-left text-red-600 hover:bg-gray-50 flex items-center gap-3 transition-colors rounded-md font-semibold cursor-pointer"
                  >
                    {loading ? (
                      <LoadingSpinner size={16} className="mx-auto" />
                    ) : (
                      <>
                        <FiLogOut className="flex-shrink-0" />
                        <span>{t('navbar.buttons.logout')}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
