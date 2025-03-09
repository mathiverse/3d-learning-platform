import React from 'react';
import styled from 'styled-components';

interface TooltipProps {
  children: React.ReactNode;
  className?: string;
}

const TooltipContainer = styled.div`
  z-index: 1000;
  position: absolute;
  top: auto;
  bottom: 100%;
  margin-bottom: 5px;
`;

const Tooltip: React.FC<TooltipProps> = ({ children, className }) => {
  return (
    <TooltipContainer className={className}>
      {children}
    </TooltipContainer>
  );
};

export default Tooltip; 