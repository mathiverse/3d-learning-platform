import React from 'react';
import { Tooltip, TooltipProps, styled, Zoom } from '@mui/material';

// Create a styled tooltip with consistent placement and animation
const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    arrow
    placement="top"
    leaveDelay={200}
    enterDelay={500}
    PopperProps={{
      disablePortal: true,
      sx: { zIndex: 10000 }
    }}
    TransitionComponent={Zoom}
    TransitionProps={{ timeout: 300 }}
  />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(30, 30, 30, 0.9)' 
      : 'rgba(97, 97, 97, 0.9)',
    color: theme.palette.mode === 'dark' ? '#fff' : '#fff',
    fontSize: 12,
    padding: '6px 12px',
    borderRadius: 4,
    fontWeight: 500,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  },
  [`& .MuiTooltip-arrow`]: {
    color: theme.palette.mode === 'dark' 
      ? 'rgba(30, 30, 30, 0.9)' 
      : 'rgba(97, 97, 97, 0.9)',
  }
}));

export default CustomTooltip;