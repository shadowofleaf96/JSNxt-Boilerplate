import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import LoadingSpinner from '../ui/LoadingSpinner';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const { currentUser, loading } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    if (loading) return;

    if (!currentUser) {
      if (pathname.includes('/admin')) {
        router.push('/admin/login');
      } else {
        router.push('/login');
      }
      return;
    }

    const userRole = currentUser.role || 'user';
    if (!allowedRoles.includes(userRole)) {
      router.push('/');
    } else {
      setAuthorized(true);
    }
  }, [router, allowedRoles, pathname, currentUser, loading]);

  if (loading || !authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
