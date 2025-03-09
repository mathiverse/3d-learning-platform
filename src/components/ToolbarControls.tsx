import React from 'react';
import styled from 'styled-components';
import { Icon } from './Icon';

const ToolbarContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ToolButton = styled.button`
  background-color: #2e3440;
  color: white;
  border: none;
  border-radius: 4px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: #3b4252;
  }
`;

interface ToolbarControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
  onExitFullscreen?: () => void;
}

/**
 * Toolbar controls for 3D viewer navigation
 * @param {Function} onZoomIn - Zoom in handler
 * @param {Function} onZoomOut - Zoom out handler
 * @param {Function} onReset - Reset view handler
 * @param {Function} onExitFullscreen - Exit fullscreen handler
 */
const ToolbarControls: React.FC<ToolbarControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  onExitFullscreen
}) => {
  return (
    <ToolbarContainer>
      <ToolButton onClick={onZoomIn}>
        <Icon name="zoom_in" />
      </ToolButton>
      <ToolButton onClick={onZoomOut}>
        <Icon name="zoom_out" />
      </ToolButton>
      <ToolButton onClick={onReset}>
        <Icon name="refresh" />
      </ToolButton>
      <ToolButton onClick={onExitFullscreen}>
        <Icon name="fullscreen_exit" />
      </ToolButton>
    </ToolbarContainer>
  );
};

export default ToolbarControls; 