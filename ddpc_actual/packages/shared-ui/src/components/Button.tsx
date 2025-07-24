
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
    >
      {children}
    </button>
  );
};

export default Button; 