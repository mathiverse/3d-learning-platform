import React from 'react';
import styled from 'styled-components';
import FloatingActionButton from './FloatingActionButton';
import ToolbarControls from './ToolbarControls'; // Import your toolbar component
// Import other tools/dialogs you want to display in full screen

const FullScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #202225; // Dark background to match your UI
  z-index: 800; // Below floating elements but above regular content
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.div`
  flex: 1;
  position: relative;
`;

const ControlsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  background-color: rgba(46, 52, 64, 0.7);
  padding: 8px;
  border-radius: 4px;
  z-index: 901;
`;

const FullScreenMode = ({ 
  isFullScreen, 
  onExitFullScreen, 
  children,
  handleFloatingActionClick
}) => {
  if (!isFullScreen) return null;
  
  return (
    <FullScreenContainer>
      <ContentArea>
        {/* Main 3D content */}
        {children}
        
        {/* Floating information button */}
        <FloatingActionButton handleClick={handleFloatingActionClick} />
        
        {/* Floating toolbar controls (zoom, rotate, etc.) */}
        <ControlsContainer>
          <ToolbarControls />
        </ControlsContainer>
      </ContentArea>
      
      {/* Add other floating tools or dialogs here */}
      {/* For example: <ToolPalette /> or <DialogComponent /> */}
    </FullScreenContainer>
  );
};

export default FullScreenMode; 