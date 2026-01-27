import { ReactNode } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ButtonProps {
  children: ReactNode;
  loading?: boolean;
  spinnerSize?: number;
  className?: string;
  [key: string]: any;
}

const Button = ({
  children,
  loading = false,
  spinnerSize = 6,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <div className="mt-2">
      <button
        {...props}
        disabled={loading}
        className={`w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 disabled:opacity-75 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? <LoadingSpinner size={spinnerSize} /> : children}
      </button>
    </div>
  );
};

export default Button;
