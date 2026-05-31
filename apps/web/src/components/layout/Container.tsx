import React from 'react';
import clsx from 'clsx';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full' | 'fullscreen';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = '4xl',
  className,
  ...props
}) => {
  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-4xl',
    '4xl': 'max-w-6xl',
    full: 'max-w-full',
    fullscreen: 'w-screen',
  };

  return (
    <div
      className={clsx(
        'mx-auto px-6 w-full',
        maxWidthStyles[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Container.displayName = 'Container';
