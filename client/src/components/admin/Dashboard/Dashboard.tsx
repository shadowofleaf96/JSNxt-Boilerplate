'use client';

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Error from '@/components/admin/Error/Error';
import { Users, UserCheck, Clock } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'react-toastify';
import { User } from '@/types/user';
import { createClient } from '@/utils/supabase/client';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
}

interface UsersDataItem {
  month: string;
  count: number;
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [usersData, setUsersData] = useState<UsersDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
  });
  const [recentUser, setRecentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const supabase = createClient();
        const { data: users, error: fetchError } = await supabase
          .from('users')
          .select('*');
        if (fetchError) throw fetchError;
        if (!users) return;

        const activeUsers = users.filter(
          (user) => user.status === 'active'
        ).length;

        const usersByMonth: Record<string, number> = users.reduce(
          (acc, user) => {
            const createdAt = new Date(user.createdAt);
            const month = createdAt.toLocaleString('default', {
              month: 'short',
              year: 'numeric',
            });
            if (!acc[month]) acc[month] = 0;
            acc[month]++;
            return acc;
          },
          {} as Record<string, number>
        );

        const usersArray: UsersDataItem[] = Object.keys(usersByMonth).map(
          (month) => ({
            month,
            count: usersByMonth[month],
          })
        );

        const sortedByActivity = [...users].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setRecentUser(sortedByActivity[0]);

        setUsersData(usersArray);
        setUserStats({ totalUsers: users.length, activeUsers });
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err);
        toast.error(t('Dashboard.errorFetch'));
        setLoading(false);
      }
    };

    fetchUsers();
  }, [t]);

  const userChartData = {
    labels: usersData.map((u) => u.month),
    datasets: [
      {
        label: t('Dashboard.usersRegistered'),
        data: usersData.map((u) => u.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { bottom: 30 } },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {t('Dashboard.title')}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('Dashboard.totalUsers')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('Dashboard.activeUsers')}
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {userStats.activeUsers}
            </div>
          </CardContent>
        </Card>

        {recentUser && (
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('Dashboard.recentlyActive')}
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold truncate">
                {recentUser.name || recentUser.email}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('Dashboard.lastActive')}{' '}
                {recentUser.lastActive
                  ? new Date(recentUser.lastActive).toLocaleString('default', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : 'N/A'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>{t('Dashboard.userRegistrationsByMonth')}</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div style={{ height: '400px' }}>
            <Bar data={userChartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
