import React from 'react';
import '../styles/main.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', className = '', type = 'button' }) => {
  return (
    <button onClick={onClick} className={`btn ${variant} ${className}`} type={type}>
      {children}
    </button>
  );
};

export default Button;
