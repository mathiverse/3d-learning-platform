import React from 'react';
import styled from '@emotion/styled';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

interface StyledButtonProps {
  variant?: string;
  size?: string;
}

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.size === 'small' ? '6px 12px' : props.size === 'large' ? '12px 24px' : '8px 16px'};
  font-size: ${props => props.size === 'small' ? '0.875rem' : props.size === 'large' ? '1.125rem' : '1rem'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  
  ${props => props.variant === 'primary' && `
    background-color: #1976d2;
    color: white;
    border: none;
    
    &:hover {
      background-color: #1565c0;
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background-color: transparent;
    color: #1976d2;
    border: 1px solid #1976d2;
    
    &:hover {
      background-color: rgba(25, 118, 210, 0.04);
    }
  `}
  
  ${props => props.variant === 'text' && `
    background-color: transparent;
    color: #1976d2;
    border: none;
    
    &:hover {
      background-color: rgba(25, 118, 210, 0.04);
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/**
 * Custom button component with different variants and sizes
 * @param variant - Button style variant
 * @param size - Button size
 * @param children - Button content
 * @param props - Additional button props
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 