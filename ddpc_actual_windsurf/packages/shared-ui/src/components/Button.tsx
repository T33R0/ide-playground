import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual style of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * The size of the button
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * If true, the button will take up the full width of its container
   */
  fullWidth?: boolean;
  /**
   * If true, the button will show a loading spinner
   */
  loading?: boolean;
  /**
   * The loading text to show when loading is true
   */
  loadingText?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

/**
 * A reusable button component with multiple variants and sizes
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      disabled = false,
      fullWidth = false,
      loading = false,
      loadingText = 'Loading...',
      size = 'md',
      type = 'button',
      variant = 'primary',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const buttonClasses = clsx(
      'inline-flex items-center justify-center rounded-md font-medium transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantStyles[variant],
      sizeStyles[size],
      { 'w-full': fullWidth },
      className
    );

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {loadingText}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
