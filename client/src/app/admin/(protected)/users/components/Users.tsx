"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchUsers } from "@/redux/user/usersSlice";
import { FaRegTrashCan, FaPlus } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AddUserForm from "./UsersForm";
import { User } from "@/types/user";
import { toast } from "react-toastify";
import Error from "@/app/admin/components/Error/Error";
import ConfirmationModal from "@/app/admin/components/Utils/ConfirmationModal";
import AxiosConfig from "@/components/utils/AxiosConfig";
import Image from "next/image";

interface SortConfig {
  key: keyof User | null;
  direction: "ascending" | "descending";
}

function Users() {
  const dispatch: AppDispatch = useDispatch();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | string[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const loggedInUserId = "sampleLoggedInUserId";
  const itemsPerPage = 5;

  const fetchNewUsers = useCallback(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    fetchNewUsers();
  }, [dispatch, fetchNewUsers]);

  const handleAddUser = () => {
    setEditingUser(null);
    setShowAddUserModal(true);
  };

  const handleEditUser = (user: User) => {
    if (user.id === loggedInUserId) {
      toast.error("You cannot edit the currently logged-in user.");
      return;
    }
    setEditingUser(user);
    setShowAddUserModal(true);
  };

  const openModal = (userId: string) => {
    if (userId === loggedInUserId) {
      toast.error("You cannot delete the currently logged-in user.");
      return;
    }
    setModalIsOpen(true);
    setUserToDelete(userId);
    setIsBulkDelete(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setUserToDelete(null);
  };

  const closeAddModal = () => {
    setShowAddUserModal(false);
    setEditingUser(null);
    setCurrentPage(1);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete || typeof userToDelete !== "string") return;

    try {
      setIsLoading(true);
      await AxiosConfig.delete(`/users/${userToDelete}`);
      fetchNewUsers();
      toast.success("User deleted successfully");
      setIsLoading(false);
      closeModal();
    } catch (error: any) {
      toast.error("Error deleting user: " + error);
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllChange = () => {
    setSelectedUsers((prev) =>
      prev.length === currentItems.length
        ? []
        : currentItems.map((user) => user.id)
    );
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return;
    if (selectedUsers.includes(loggedInUserId)) {
      toast.error("You cannot delete the currently logged-in user.");
      return;
    }
    setUserToDelete(selectedUsers);
    setModalIsOpen(true);
    setIsBulkDelete(true);
  };

  const handleConfirmBulkDelete = async () => {
    if (!userToDelete || !Array.isArray(userToDelete)) return;

    try {
      setIsLoading(true);
      await Promise.all(
        userToDelete.map((userId) => AxiosConfig.delete(`/users/${userId}`))
      );
      fetchNewUsers();
      setSelectedUsers([]);
      closeModal();
      toast.success("Users deleted successfully");
      setIsLoading(false);
    } catch (error: any) {
      toast.error("Error deleting users: " + error);
      setIsLoading(false);
    }
  };

  const handleSort = (key: keyof User) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const sortedUsers = useMemo(() => {
    const sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <Error error={error as unknown as Error} />;
  }

  return (
    <section className="container px-4 mx-auto mt-8">
      <h2 className="text-lg font-medium text-gray-800">User Details</h2>
      <div className="flex items-center justify-end gap-x-3 mt-6">
        {selectedUsers.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="flex items-center justify-center h-12 w-12 px-2 text-white bg-red-600 rounded-full hover:bg-red-500 focus:outline-none"
          >
            <FaRegTrashCan size={24} />
          </button>
        )}
        <button
          onClick={handleAddUser}
          className="flex items-center justify-center h-12 w-12 px-2 text-white bg-black rounded-full hover:bg-gray-500 focus:outline-none"
        >
          <FaPlus size={24} />
        </button>
      </div>
      {showAddUserModal && (
        <div className="flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <div className="rounded-lg shadow-lg w-3/4 max-w-2xl">
            <AddUserForm
              onClose={closeAddModal}
              refreshUsers={fetchNewUsers}
              initialData={editingUser}
              isEditMode={!!editingUser}
            />
          </div>
        </div>
      )}
      <div className="mt-6 flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="text-black border-gray-300 rounded"
                    onChange={handleSelectAllChange}
                    checked={selectedUsers.length === currentItems.length}
                  />
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("authProvider")}
                >
                  Auth Provider
                  {sortConfig.key === "authProvider" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("username")}
                >
                  Username
                  {sortConfig.key === "username" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email
                  {sortConfig.key === "email" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  Role
                  {sortConfig.key === "role" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status
                  {sortConfig.key === "status" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  scope="col"
                  className="relative py-3.5
                  px-4"
                >
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : (
                currentItems.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="text-black border-gray-300 rounded"
                        onChange={() => handleCheckboxChange(user.id)}
                        checked={selectedUsers.includes(user.id)}
                      />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                      <div className="flex items-center">
                        <Image
                          className="object-cover w-10 h-10 rounded-full mr-2"
                          width={0}
                          height={0}
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,..."
                          sizes="(max-width: 768px) 100vw, 50vw"
                          src={user.avatar}
                          alt={user.username + " avatar"}
                        />
                        <div>
                          <h2 className="font-medium text-gray-800">
                            {user.authProvider}
                          </h2>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                      {user.username}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                      {user.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-4 py-4 text-sm capitalize text-gray-800 whitespace-nowrap">
                      {user.role}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${
                          user.status === "active"
                            ? "bg-emerald-100/60"
                            : "bg-red-100/60"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.status === "active"
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                        <span
                          className={`text-sm font-normal ${
                            user.status === "active"
                              ? "text-emerald-500"
                              : "text-red-500"
                          }`}
                        >
                          {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-x-6">
                        <div className="h-auto w-auto">
                          <button
                            className="text-red-600 transition-colors duration-200 hover:text-red-500 focus:outline-none"
                            onClick={() => openModal(user.id)}
                          >
                            <FaRegTrashCan size={22} />
                          </button>
                        </div>
                        <div className="h-auto w-auto">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-black transition-colors duration-200 hover:text-gray-600 focus:outline-none"
                          >
                            <FaRegEdit size={22} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePreviousPage}
            className={`flex items-center px-5 py-3 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPage === 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:-scale-x-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>
            <span>Previous</span>
          </button>
          <div className="items-center hidden lg:flex gap-x-3">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-2 py-1 text-sm rounded-md ${
                  currentPage === index + 1
                    ? "text-black bg-blue-100"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={handleNextPage}
            className={`flex items-center px-5 py-3 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPage === totalPages}
          >
            <span>Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:-scale-x-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </button>
        </div>
      </div>
      <ConfirmationModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        onConfirm={isBulkDelete ? handleConfirmBulkDelete : handleDeleteUser}
        isLoading={isLoading}
        isBulkDelete={isBulkDelete}
      />
    </section>
  );
}

export default Users;
