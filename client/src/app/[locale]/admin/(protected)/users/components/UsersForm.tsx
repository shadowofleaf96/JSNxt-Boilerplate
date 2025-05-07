'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AxiosConfig from '@/components/utils/AxiosConfig';
import { useForm } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@/types/user';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

const userSchema = z.object({
  authProvider: z.enum(['local', 'google']),
  avatar: z
    .any()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files[0] instanceof File;
    }, 'userForm:errors.invalidFile')
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= 5_000_000,
      'userForm:errors.fileSize'
    )
    .optional(),
  name: z
    .string()
    .min(3, 'userForm:errors.nameMin')
    .max(20, 'userForm:errors.nameMax')
    .trim(),
  username: z
    .string()
    .min(3, 'userForm:errors.usernameMin')
    .max(20, 'userForm:errors.usernameMax')
    .trim(),
  password: z
    .string()
    .min(6, 'userForm:errors.passwordMin')
    .max(20, 'userForm:errors.passwordMax')
    .trim(),
  email: z.string().email('userForm:errors.invalidEmail').trim(),
  role: z.string().min(1, 'userForm:errors.roleRequired'),
  status: z.enum(['active', 'inactive']),
});

interface UsersFormProps {
  onClose: () => void;
  refreshUsers: () => void;
  initialData?: User | null;
  isEditMode?: boolean;
}

const UsersForm: React.FC<UsersFormProps> = ({
  onClose,
  refreshUsers,
  initialData = null,
  isEditMode = false,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      authProvider: 'local',
      avatar: null,
      name: '',
      username: '',
      password: '',
      role: 'admin',
      email: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        authProvider: initialData.authProvider || 'local',
        status: initialData.status as 'active' | 'inactive',
        password: '',
      });
      if (initialData.avatar) {
        setImagePreview(initialData.avatar);
      }
      setValue('avatar', initialData.avatar || '');
      setValue('username', initialData.username || '');
      setValue('name', initialData.name || '');
      setValue('role', initialData.role || 'admin');
      setValue('email', initialData.email || '');
      setValue(
        'status',
        (initialData.status as 'active' | 'inactive') || 'active'
      );
    }
  }, [initialData, setValue, reset]);

  const onSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true);

    const userData = new FormData();

    const avatarFile = data.avatar?.item?.(0);
    if (avatarFile instanceof File) {
      userData.append('avatar', avatarFile);
    }

    Object.entries(data).forEach(([key, value]) => {
      if (value && key !== 'avatar') {
        userData.append(key, value);
      }
    });

    try {
      if (isEditMode && initialData?.id) {
        await AxiosConfig.put(`/users/${initialData.id}`, userData);
        toast.success(t('userForm.notifications.updated'));
      } else {
        await AxiosConfig.post(`/users/create-user`, userData);
        toast.success(t('userForm.notifications.added'));
      }
      onClose();
      refreshUsers();
    } catch (error: any) {
      console.log(error);
      toast.error(t('userForm.errors.generic') + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/75 z-50">
      <div
        ref={modalRef}
        className="bg-white p-4 rounded-xl shadow-lg w-3/4 max-w-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
        >
          <IoClose size={24} />
        </button>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {isEditMode
              ? t('userForm.form.editUser')
              : t('userForm.form.addUser')}
          </h2>

          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label htmlFor="username">{t('userForm.fields.username')}</label>
              <input
                type="text"
                id="username"
                placeholder="Example: Admin"
                {...register('username')}
                className={`border ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                } bg-white p-2 rounded w-full`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {t(errors.username.message as string)}
                </p>
              )}
            </div>

            {(!isEditMode || watch('authProvider') === 'local') && (
              <div className="w-1/2">
                <label htmlFor="password">
                  {t('userForm.fields.password')}
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder={
                    isEditMode
                      ? t('userForm.placeholders.passwordUnchanged')
                      : t('userForm.placeholders.password')
                  }
                  {...register('password', {
                    required: !isEditMode && 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                    maxLength: {
                      value: 20,
                      message: 'Password must be less than 20 characters',
                    },
                  })}
                  className={`border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } bg-white p-2 rounded w-full`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {t(errors.password.message as string)}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email">{t('userForm.fields.email')}</label>
            <input
              type="email"
              id="email"
              placeholder="Example: example@example.com"
              {...register('email')}
              className={`border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } bg-white p-2 rounded w-full`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {' '}
                {t(errors.email.message as string)}
              </p>
            )}
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label htmlFor="name">{t('userForm.fields.name')}</label>
              <input
                type="text"
                id="name"
                placeholder="Example: John Doe"
                {...register('name')}
                className={`border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } bg-white p-2 rounded w-full`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">
                  {' '}
                  {t(errors.name.message as string)}
                </p>
              )}
            </div>
            <div className="w-1/2">
              <label htmlFor="role" className="block mb-2">
                {t('userForm.fields.role')}
              </label>
              <select
                id="role"
                {...register('role')}
                className={`border ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                } bg-white p-2 rounded w-full`}
              >
                <option value="user">{t('userForm.roles.user')}</option>
                <option value="admin">{t('userForm.roles.admin')}</option>
                <option value="manager">{t('userForm.roles.manager')}</option>
                <option value="other">{t('userForm.roles.other')}</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm">
                  {t(errors.role.message as string)}
                </p>
              )}
            </div>
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label htmlFor="status">{t('userForm.fields.status')}</label>
              <select
                id="status"
                {...register('status')}
                className={`border ${
                  errors.status ? 'border-red-500' : 'border-gray-300'
                } bg-white p-2 rounded w-full`}
              >
                <option value="active">{t('userForm.statuses.active')}</option>
                <option value="inactive">
                  {t('userForm.statuses.inactive')}
                </option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm">
                  {t(errors.status.message as string)}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              {t('userForm.fields.avatar')}
            </label>
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  {...register('avatar', {
                    onChange: (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    },
                  })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <label
                  htmlFor="avatar"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  {t('userForm.buttons.chooseFile')}
                </label>
              </div>

              <div className="flex items-center gap-2">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      width={0}
                      height={0}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,..."
                      sizes="(max-width: 768px) 100vw, 50vw"
                      src={imagePreview}
                      alt="New avatar preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                ) : initialData?.avatar ? (
                  <Image
                    width={0}
                    height={0}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,..."
                    sizes="(max-width: 768px) 100vw, 50vw"
                    src={initialData?.avatar}
                    alt="Current avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/default-avatar.png';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}

                <span className="text-sm text-gray-500">
                  {watch('avatar')?.[0]?.name || t('userForm.alt.noAvatar')}
                </span>
              </div>
            </div>

            {errors.avatar && (
              <p className="mt-1 text-sm text-red-500">
                {t(errors.avatar.message as string)}
              </p>
            )}
          </div>

          <div className="flex justify-center items-start">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white py-3 font-light px-4 rounded transition-colors duration-200 hover:bg-blue-600"
            >
              {isSubmitting ? (
                <LoadingSpinner
                  size={6}
                  className="w-auto py-1 px-3 h-auto text-white"
                />
              ) : isEditMode ? (
                t('userForm.buttons.update')
              ) : (
                t('userForm.buttons.add')
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-light py-3 px-4 ml-4"
            >
              {t('userForm.buttons.close')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsersForm;
