import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Button, 
  useTheme, 
  Menu, 
  MenuItem, 
  Tooltip, 
  useMediaQuery,
  Fade,
  Avatar,
  Badge
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  Home,
  Search,
  Info,
  Help,
  ViewInAr,
  Person,
  Notifications
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavBarProps {
  darkMode: boolean;
  handleToggleDarkMode: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ darkMode, handleToggleDarkMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  
  const isModelViewerPage = location.pathname.includes('/model/');
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
    setMobileMenuOpen(false);
  };
  
  // Define navigation items
  const navItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Explore', path: '/explore', icon: <Search /> },
    { label: 'About', path: '/about', icon: <Info /> },
    { label: 'Help', path: '/help', icon: <Help /> }
  ];
  
  // Parse discipline and model info from URL if on model viewer page
  let discipline = '';
  let modelName = '';
  
  if (isModelViewerPage) {
    const pathParts = location.pathname.split('/');
    discipline = pathParts[2] || '';
    
    // Convert model ID to readable name
    const modelId = pathParts[3] || '';
    modelName = modelId
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={1}
      sx={{
        zIndex: 10,
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
      <Toolbar>
        {/* Mobile menu toggle */}
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        {/* Logo and title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ViewInAr sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography 
            variant="h6" 
            component={Link} 
            to="/"
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}
          >
            EduDive
          </Typography>
        </Box>
        
        {/* Breadcrumb navigation for model viewer */}
        {isModelViewerPage && (
          <Fade in={true}>
            <Box 
              sx={{ 
                ml: 2, 
                display: 'flex', 
                alignItems: 'center',
                '& > *': { color: 'text.secondary' }
              }}
            >
              <Typography variant="body2" sx={{ mx: 0.5 }}>/</Typography>
              <Typography 
                variant="body2" 
                component={Link}
                to={`/explore/${discipline}`}
                sx={{ 
                  textDecoration: 'none', 
                  color: 'text.secondary',
                  '&:hover': { color: theme.palette.primary.main }
                }}
              >
                {discipline.charAt(0).toUpperCase() + discipline.slice(1)}
              </Typography>
              <Typography variant="body2" sx={{ mx: 0.5 }}>/</Typography>
              <Typography 
                variant="body2"
                sx={{ 
                  fontWeight: 500,
                  color: theme.palette.primary.main
                }}
              >
                {modelName}
              </Typography>
            </Box>
          </Fade>
        )}
        
        {/* Desktop navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', flexGrow: 1, ml: 4 }}>
            {navItems.map(item => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                sx={{ 
                  mx: 1,
                  opacity: location.pathname === item.path ? 1 : 0.7,
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  '&:hover': { opacity: 1 }
                }}
                startIcon={item.icon}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
        
        {/* Right side controls */}
        <Box sx={{ display: 'flex', ml: 'auto', alignItems: 'center' }}>
          {/* Theme toggle */}
          <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton onClick={handleToggleDarkMode} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
          
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* User menu */}
          <Box sx={{ ml: 1 }}>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleUserMenuOpen}
                size="small"
                sx={{ ml: 1 }}
                aria-controls={Boolean(userMenuAnchorEl) ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(userMenuAnchorEl) ? 'true' : undefined}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: theme.palette.primary.main 
                  }}
                >
                  <Person fontSize="small" />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              id="user-menu"
              anchorEl={userMenuAnchorEl}
              open={Boolean(userMenuAnchorEl)}
              onClose={handleUserMenuClose}
              PaperProps={{
                elevation: 2,
                sx: { mt: 1.5 }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleUserMenuClose}>My Learning</MenuItem>
              <MenuItem onClick={handleUserMenuClose}>Settings</MenuItem>
              <MenuItem onClick={handleUserMenuClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
      
      {/* Mobile menu */}
      {isMobile && (
        <Menu
          anchorEl={menuAnchorEl}
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          PaperProps={{
            elevation: 2,
            sx: { width: '100%', maxWidth: 320, mt: 1 }
          }}
        >
          {navItems.map(item => (
            <MenuItem 
              key={item.path} 
              onClick={() => handleNavigate(item.path)}
              selected={location.pathname === item.path}
            >
              <Box sx={{ mr: 2 }}>{item.icon}</Box>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </AppBar>
  );
};

export default NavBar; 