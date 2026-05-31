import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      variant = 'default',
      className,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default:
        'border-2 border-secondary-200 hover:border-secondary-300 focus:border-primary-600 bg-white',
      filled:
        'border-b-2 border-secondary-300 focus:border-primary-600 bg-secondary-50 rounded-t-lg',
      outlined:
        'border-2 border-secondary-300 focus:border-primary-600 bg-transparent rounded-lg',
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-accent-800 mb-2 transition-colors">
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-600 flex items-center">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ease-out',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              variantStyles[variant],
              icon && 'pl-10',
              error
                ? 'border-error-400 focus:ring-error-400 focus:border-error-500 bg-error-50'
                : 'focus:ring-primary-400/20',
              'disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-secondary-100',
              'placeholder:text-accent-400 placeholder:font-normal',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <div className="mt-2 flex items-center gap-1">
            <span className="text-error-600 text-sm font-medium">⚠️ {error}</span>
          </div>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-accent-600">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
