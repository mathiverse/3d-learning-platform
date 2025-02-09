import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  useTheme
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Dashboard,
  Timeline,
  School
} from '@mui/icons-material';

interface NavigationProps {
  username: string;
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ username, onThemeToggle, isDarkMode }) => {
  const theme = useTheme();

  return (
    <AppBar position="static">
      <Toolbar>
        <School sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          3D Learning Platform
        </Typography>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button
            component={NavLink}
            to="/"
            startIcon={<Dashboard />}
            color="inherit"
            end
          >
            Dashboard
          </Button>
          <Button
            component={NavLink}
            to="/progress"
            startIcon={<Timeline />}
            color="inherit"
          >
            My Progress
          </Button>
        </Box>
        <Typography sx={{ mr: 2 }}>Welcome, {username}</Typography>
        <IconButton onClick={onThemeToggle} color="inherit">
          {isDarkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 