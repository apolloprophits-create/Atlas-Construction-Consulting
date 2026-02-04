import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-brand-dark text-white hover:bg-brand-primary focus:ring-brand-dark shadow-sm border border-transparent',
    secondary: 'bg-brand-accent text-white hover:bg-blue-700 focus:ring-brand-accent shadow-sm border border-transparent',
    outline: 'bg-transparent text-brand-dark border-2 border-brand-dark hover:bg-brand-surface',
    ghost: 'bg-transparent text-brand-secondary hover:text-brand-dark hover:bg-slate-100',
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5 rounded-md',
    md: 'text-base px-6 py-3 rounded-lg',
    lg: 'text-lg px-8 py-4 rounded-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;