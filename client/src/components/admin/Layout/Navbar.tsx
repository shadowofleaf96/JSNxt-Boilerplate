'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { LogOut, Menu, Search } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'react-toastify';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { createClient } from '@/utils/supabase/client';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

function Navbar({ toggleSidebar, isSidebarOpen }: NavbarProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const { currentUser, loading: userLoading } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    // Current user handled by SupabaseAuthProvider
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/admin/login');
    } catch (err: any) {
      toast.error(t('navbar.errors.generic'));
    }
  };

  return (
    <header className="sticky top-0 z-50 flex w-full flex-wrap border-b border-border bg-background py-2 sm:flex-nowrap sm:justify-start sm:py-4">
      <nav
        className="mx-auto flex w-full max-w-7xl basis-full items-center px-4 sm:px-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex flex-1 items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden text-muted-foreground"
          >
            {!isSidebarOpen && <Menu className="h-5 w-5" />}
          </Button>

          <div className="hidden max-w-xl flex-1 sm:block">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                type="text"
                className="w-full ps-10"
                placeholder={t('navbar.placeholders.search')}
              />
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <LanguageSwitcher />

          {userLoading ? (
            <LoadingSpinner size={20} />
          ) : currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={currentUser.avatar}
                      alt={t('navbar.alt.userAvatar')}
                    />
                    <AvatarFallback>
                      {currentUser.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {currentUser.username}
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
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('navbar.buttons.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
