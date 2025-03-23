import React, { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  useTheme,
  Container,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Dashboard,
  Menu as MenuIcon,
  Help,
  ViewInAr,
  School,
  Info,
} from '@mui/icons-material';
import CustomTooltip from './CustomTooltip';

interface NavigationProps {
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ onThemeToggle, isDarkMode }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(18, 18, 18, 0.9)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          zIndex: 1200
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 64 }}>
            {isMobile && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleMobileMenu}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Box 
              component={Link} 
              to="/" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: 'inherit',
                transition: 'opacity 0.2s',
                '&:hover': {
                  opacity: 0.8
                }
              }}
            >
              <ViewInAr sx={{ 
                mr: 1.5, 
                color: theme.palette.primary.main,
                fontSize: 32,
                filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))'
              }} />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  flexGrow: 0, 
                  mr: 4,
                  fontWeight: 700,
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: 1,
                  fontSize: '1.5rem',
                  display: { xs: 'none', sm: 'block' },
                  background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(90deg, #64b5f6 0%, #2196f3 100%)' 
                    : 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                EduDive
              </Typography>
            </Box>
            
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                <Button
                  component={NavLink}
                  to="/"
                  startIcon={<Dashboard />}
                  sx={{
                    color: theme.palette.text.primary,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    '&.active': {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                    },
                    '&:hover:not(.active)': {
                      backgroundColor: theme.palette.action.hover,
                    }
                  }}
                  end
                >
                  Home
                </Button>
                <Button
                  component={NavLink}
                  to="/explore"
                  startIcon={<School />}
                  sx={{
                    color: theme.palette.text.primary,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    '&.active': {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                    },
                    '&:hover:not(.active)': {
                      backgroundColor: theme.palette.action.hover,
                    }
                  }}
                >
                  Explore Models
                </Button>
                <Button
                  component={NavLink}
                  to="/about"
                  startIcon={<Info />}
                  sx={{
                    color: theme.palette.text.primary,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    '&.active': {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                    },
                    '&:hover:not(.active)': {
                      backgroundColor: theme.palette.action.hover,
                    }
                  }}
                >
                  About
                </Button>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Theme Toggle */}
              <CustomTooltip title={isDarkMode ? "Light Mode" : "Dark Mode"}>
                <IconButton onClick={onThemeToggle} color="inherit">
                  {isDarkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </CustomTooltip>

              {/* Help button */}
              <CustomTooltip title="Help">
                <IconButton 
                  color="inherit" 
                  component={Link} 
                  to="/help"
                >
                  <Help />
                </IconButton>
              </CustomTooltip>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            bgcolor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ViewInAr sx={{ 
              mr: 1,
              color: theme.palette.primary.main,
              fontSize: 28
            }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: 1,
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(45deg, #64b5f6 30%, #2196f3 90%)' 
                  : 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              EduDive
            </Typography>
          </Box>
        </Box>
        
        <Divider />
        
        <List>
          <ListItem button onClick={() => navigateTo('/')}>
            <ListItemIcon>
              <Dashboard color={location.pathname === '/' ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText 
              primary="Home" 
              primaryTypographyProps={{
                color: location.pathname === '/' ? theme.palette.primary.main : theme.palette.text.primary
              }}
            />
          </ListItem>
          
          <ListItem button onClick={() => navigateTo('/explore')}>
            <ListItemIcon>
              <School color={location.pathname === '/explore' ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText 
              primary="Explore Models" 
              primaryTypographyProps={{
                color: location.pathname === '/explore' ? theme.palette.primary.main : theme.palette.text.primary
              }}
            />
          </ListItem>
          
          <ListItem button onClick={() => navigateTo('/about')}>
            <ListItemIcon>
              <Info color={location.pathname === '/about' ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText 
              primary="About" 
              primaryTypographyProps={{
                color: location.pathname === '/about' ? theme.palette.primary.main : theme.palette.text.primary
              }}
            />
          </ListItem>
        </List>
        
        <Divider />
        
        <List>
          <ListItem button onClick={() => navigateTo('/help')}>
            <ListItemIcon>
              <Help />
            </ListItemIcon>
            <ListItemText primary="Help" />
          </ListItem>
          
          <ListItem button onClick={onThemeToggle}>
            <ListItemIcon>
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </ListItemIcon>
            <ListItemText primary={isDarkMode ? "Light Mode" : "Dark Mode"} />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Navigation; 