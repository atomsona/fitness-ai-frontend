import React from 'react';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
  const variants = {
    default: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50',
    outline: 'border border-white border-opacity-30 bg-white bg-opacity-10 hover:bg-opacity-20',
    ghost: 'hover:bg-white hover:bg-opacity-10'
  };

  const sizes = {
    default: 'px-6 py-2',
    sm: 'px-4 py-1.5 text-sm',
    lg: 'px-8 py-3 text-lg'
  };

  return (
    <button
      ref={ref}
      className={cn(
        'rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export { Button };