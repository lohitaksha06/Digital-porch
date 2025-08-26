import React from 'react';
import '../styles/main.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  return (
    <button onClick={onClick} className={`btn ${variant} ${className}`} type={type} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
