"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import Error from "../../../components/Error/Error";
import { FaUserClock, FaUsers } from "react-icons/fa6";
import LoadingSpinner from "../../../../../components/Utils/LoadingSpinner";
import { toast } from "react-toastify";
import { User } from "../../../../../types/user";
import AxiosConfig from "../../../../../components/Utils/AxiosConfig";

interface UserStats {
  totalUsers: number;
  activeUsers: number;
}

interface UsersDataItem {
  month: string;
  count: number;
}

const Dashboard: React.FC = () => {
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
        const res = await AxiosConfig.get<{ users: User[] }>(
          "/users/getallusers"
        );
        const users = res.data.users || [];

        const activeUsers = users.filter(
          (user) => user.status === "active"
        ).length;

        const usersByMonth: Record<string, number> = users.reduce(
          (acc, user) => {
            const createdAt = new Date(user.createdAt);
            const month = createdAt.toLocaleString("default", {
              month: "short",
              year: "numeric",
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
        setUserStats({
          totalUsers: users.length,
          activeUsers,
        });

        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err);
        toast.error("Error fetching user data");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const userChartData = {
    labels: usersData.map((u) => u.month),
    datasets: [
      {
        label: "Users Registered",
        data: usersData.map((u) => u.count),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 30,
      },
    },
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
    <div className="min-h-screen p-8">
      <h1 className="text-xl font-medium text-gray-800 mb-6">
        Users Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <div className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between hover:scale-105 transition duration-300">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Total Users</h3>
            <p className="text-2xl font-bold text-black">
              {userStats.totalUsers}
            </p>
          </div>
          <FaUsers size={30} className="text-black" />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between hover:scale-105 transition duration-300">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Active Users</h3>
            <p className="text-2xl font-bold text-green-600">
              {userStats.activeUsers}
            </p>
          </div>
          <FaUsers size={30} className="text-green-500" />
        </div>

        {recentUser && (
          <div className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between hover:scale-105 transition duration-300">
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                Recently Active
              </h3>
              <p className="text-md font-semibold text-gray-600">
                {recentUser.name || recentUser.email}
              </p>
              <p className="text-sm text-gray-500">
                Last active:{" "}
                {recentUser.lastActive
                  ? new Date(recentUser.lastActive).toLocaleString("default", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "N/A"}
              </p>
            </div>
            <FaUserClock size={30} className="text-orange-500" />
          </div>
        )}
      </div>

      <div
        className="bg-white p-6 rounded-xl shadow-md mt-12"
        style={{ height: "400px" }}
      >
        <h2 className="text-xl font-medium mb-4">
          User Registrations by Month
        </h2>
        <Bar data={userChartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
