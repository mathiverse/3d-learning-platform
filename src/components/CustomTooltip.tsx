import React, { useState } from 'react';
import { Tooltip, Typography, Box } from '@mui/material';

interface CustomTooltipProps {
  title: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
  title, 
  children, 
  placement = 'top' 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <React.Fragment>
      <Tooltip
        title={
          <Typography variant="body2">{title}</Typography>
        }
        placement={placement}
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
      >
        <Box onClick={() => setIsOpen(!isOpen)}>
          {children}
        </Box>
      </Tooltip>
    </React.Fragment>
  );
};

export default CustomTooltip;