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

const ToolbarControls = () => {
  return (
    <ToolbarContainer>
      <ToolButton>
        <Icon name="zoom_in" />
      </ToolButton>
      <ToolButton>
        <Icon name="zoom_out" />
      </ToolButton>
      <ToolButton>
        <Icon name="refresh" />
      </ToolButton>
      <ToolButton>
        <Icon name="fullscreen_exit" />
      </ToolButton>
    </ToolbarContainer>
  );
};

export default ToolbarControls; 