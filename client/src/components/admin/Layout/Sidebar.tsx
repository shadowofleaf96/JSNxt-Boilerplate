'use client';
import { Home, Users, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

export default function Sidebar({
  isOpen,
  toggleSidebar,
  isMobile,
}: SidebarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();

  const pathSegments = pathname.split('/').filter(Boolean);
  const currentLocale = pathSegments[0] || 'en';

  const sideElements = [
    {
      key: 'dashboard',
      name: t('navbar.dashboard'),
      href: `/${currentLocale}/admin/dashboard`,
      current: pathname === `/${currentLocale}/admin/dashboard`,
      icon: Home,
    },
    {
      key: 'users',
      name: t('navbar.users'),
      href: `/${currentLocale}/admin/users`,
      current: pathname === `/${currentLocale}/admin/users`,
      icon: Users,
    },
  ];

  return (
    <>
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed z-50 flex h-screen w-56 flex-col border-r border-border bg-background transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="relative flex items-center justify-center p-4">
          <Link
            href={`/${currentLocale}`}
            prefetch={true}
            className="flex justify-center"
          >
            <Image
              width={0}
              height={0}
              placeholder="blur"
              blurDataURL="data:image/png;base64,..."
              sizes="(max-width: 768px) 100vw, 50vw"
              className="max-h-16 w-auto object-contain"
              src="/images/jsnxt-logo-black.webp"
              alt={t('navbar.alt.logo')}
            />
          </Link>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="absolute right-2 top-2 md:hidden"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">{t('navbar.buttons.close')}</span>
            </Button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {sideElements.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => isMobile && toggleSidebar()}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2.5 transition-colors text-sm font-medium',
                  item.current
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5',
                    item.current ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
