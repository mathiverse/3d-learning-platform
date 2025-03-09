import React from 'react';
import styled from 'styled-components';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

const IconWrapper = styled.span<{
  size?: number;
  color?: string;
}>`
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: ${props => props.size ? `${props.size}px` : '24px'};
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  color: ${props => props.color || 'inherit'};
`;

/**
 * Icon component using Material Icons font
 * @param {string} name - Icon name from Material Icons
 * @param {number} size - Icon size in pixels
 * @param {string} color - Icon color
 * @param {string} className - Additional class names
 */
export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color,
  className 
}) => {
  return (
    <IconWrapper 
      size={size} 
      color={color} 
      className={className}
    >
      {name}
    </IconWrapper>
  );
};

export default Icon; 