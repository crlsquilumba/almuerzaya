import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  hoverable?: boolean;
  interactive?: boolean;
  noPadding?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'elevated',
      hoverable = false,
      interactive = false,
      noPadding = false,
      className,
      ...props
    },
    ref
  ) => {
    // Variantes de diseño profesional
    const variantStyles = {
      elevated: 'bg-white shadow-lg border border-white/20 backdrop-blur-sm',
      outlined: 'bg-white/50 backdrop-blur-sm border-2 border-secondary-200 shadow-sm',
      filled: 'bg-secondary-50 border border-secondary-200',
    };

    // Estados interactivos
    const interactiveStyles = (hoverable || interactive) &&
      'transition-all duration-200 ease-out hover:shadow-2xl hover:-translate-y-1';

    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-xl',
          variantStyles[variant],
          !noPadding && 'p-6',
          hoverable && 'cursor-pointer',
          interactive && 'cursor-pointer select-none',
          interactiveStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
