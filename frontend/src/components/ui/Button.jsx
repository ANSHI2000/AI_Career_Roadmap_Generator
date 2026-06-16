import React from 'react';

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
  outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
};

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
