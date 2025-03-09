import React from 'react';
import styled from '@emotion/styled';
import { Button } from './Button';
import { Icon } from './Icon';

// Repositioned to match the sidebar location from the screenshot
const FloatingButtonContainer = styled.div`
  position: fixed;
  top: 205px; // Position it near the top of the sidebar content area
  left: 280px; // Position it at the right edge of the sidebar
  transform: translateX(-50%); // Center it horizontally
  z-index: 900;
`;

// Style the button to match the "i" button in the screenshot
const InfoButton = styled(Button)`
  background-color: #2e3440; // Dark background matching your UI theme
  color: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background-color: #3b4252;
  }
`;

interface FloatingActionButtonProps {
  handleClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ handleClick }) => {
  return (
    <FloatingButtonContainer>
      <InfoButton onClick={handleClick}>
        <Icon name="info" />
      </InfoButton>
    </FloatingButtonContainer>
  );
};

export default FloatingActionButton; 