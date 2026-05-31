import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      icon,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles con mejores prácticas de accesibilidad
    const baseStyles =
      'font-semibold rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 inline-flex items-center justify-center gap-2';

    // Variantes de color modernas
    const variantStyles = {
      primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-glow-red hover:scale-105 active:from-primary-700 active:to-primary-800',
      secondary: 'bg-secondary-100 text-accent-800 hover:bg-secondary-200 hover:shadow-md active:bg-secondary-300',
      ghost: 'text-accent-800 hover:bg-secondary-50 active:bg-secondary-100',
      danger: 'bg-error-600 text-white hover:bg-error-700 hover:shadow-lg active:bg-error-800',
      success: 'bg-success-600 text-white hover:bg-success-700 hover:shadow-lg active:bg-success-800',
      outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100',
    };

    // Tamaños mejorados con spacing 8px grid
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm min-h-8',
      md: 'px-4 py-2 text-base min-h-10',
      lg: 'px-6 py-3 text-lg min-h-12',
      xl: 'px-8 py-4 text-lg min-h-14 font-bold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="h-5 w-5 animate-spin"
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
            {children}
          </>
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
