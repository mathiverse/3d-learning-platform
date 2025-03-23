import React, { useState, useEffect, useRef } from 'react';
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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ClickAwayListener
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
  
  const isModelViewerPage = location.pathname.includes('/model/');
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
    setMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  const handleClickAway = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };
  
  // Define navigation items
  const navItems = [
    { label: 'HOME', path: '/', icon: <Home /> },
    { label: 'EXPLORE', path: '/explore', icon: <Search /> },
    { label: 'ABOUT', path: '/about', icon: <Info /> },
    { label: 'HELP', path: '/help', icon: <Help /> }
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

  // Custom EduDive purple color
  const eduDivePurple = '#8e24aa';

  return (
    <>
      <AppBar 
        position="static" 
        color="default" 
        elevation={1}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff',
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
            <ViewInAr sx={{ mr: 1, color: eduDivePurple, fontSize: 28 }} />
            <Typography 
              variant="h6" 
              component={Link} 
              to="/"
              sx={{ 
                textDecoration: 'none', 
                color: 'inherit',
                fontWeight: 700,
                letterSpacing: '0.5px',
                display: 'flex',
                '& .edu': {
                  color: eduDivePurple,
                  fontWeight: 800,
                },
                '& .dive': {
                  color: theme.palette.mode === 'dark' ? '#b39ddb' : '#673ab7',
                  fontWeight: 700,
                }
              }}
            >
              <span className="edu">Edu</span><span className="dive">Dive</span>
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
                    '&:hover': { color: eduDivePurple }
                  }}
                >
                  {discipline.charAt(0).toUpperCase() + discipline.slice(1)}
                </Typography>
                <Typography variant="body2" sx={{ mx: 0.5 }}>/</Typography>
                <Typography 
                  variant="body2"
                  sx={{ 
                    fontWeight: 500,
                    color: eduDivePurple
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
              <IconButton onClick={handleToggleDarkMode} color="inherit" sx={{ ml: 1 }}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
            
            {/* Help button - replacing notifications and profile */}
            <Tooltip title="Help & Resources">
              <IconButton 
                color="inherit" 
                component={Link} 
                to="/help"
                sx={{ ml: 1 }}
              >
                <Help />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Mobile drawer menu - replaces the dropdown */}
      <Drawer
        anchor="left"
        open={isMobile && mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        variant="temporary"
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#f8f9fa'
          }
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2, 
            mt: 1,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <ViewInAr sx={{ mr: 1, color: eduDivePurple, fontSize: 28 }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              letterSpacing: '0.5px',
              display: 'flex',
              '& .edu': {
                color: eduDivePurple,
                fontWeight: 800,
              },
              '& .dive': {
                color: theme.palette.mode === 'dark' ? '#b39ddb' : '#673ab7',
                fontWeight: 700,
              }
            }}
          >
            <span className="edu">Edu</span><span className="dive">Dive</span>
          </Typography>
        </Box>
        
        <List sx={{ pt: 2 }}>
          {navItems.map((item) => (
            <ListItem
              key={item.path}
              button
              component={Link}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              selected={location.pathname === item.path}
              sx={{ 
                py: 1.5,
                borderLeft: location.pathname === item.path ? 
                  `4px solid ${eduDivePurple}` : '4px solid transparent',
                bgcolor: location.pathname === item.path ? 
                  theme.palette.mode === 'dark' ? 'rgba(142, 36, 170, 0.12)' : 'rgba(142, 36, 170, 0.08)' : 
                  'transparent',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(142, 36, 170, 0.08)' : 'rgba(142, 36, 170, 0.04)'
                }
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? eduDivePurple : 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                sx={{ 
                  '& .MuiListItemText-primary': {
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    color: location.pathname === item.path ? eduDivePurple : 'inherit'
                  }
                }} 
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default NavBar; 