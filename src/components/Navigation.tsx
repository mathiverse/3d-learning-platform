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
  Avatar,
  Menu,
  MenuItem,
  Container,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Dashboard,
  Timeline,
  Menu as MenuIcon,
  Settings,
  Logout,
  Notifications,
  Help,
  BookmarkBorder,
  ViewInAr,
} from '@mui/icons-material';
import CustomTooltip from './CustomTooltip';

interface NavigationProps {
  username: string;
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ username, onThemeToggle, isDarkMode }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    handleMenuClose();
    setMobileMenuOpen(false);
  };

  // Mock notifications
  const notifications = [
    { id: 1, message: "New quiz available: Mechanisms", time: "10 minutes ago" },
    { id: 2, message: "You completed the Gear Systems model", time: "2 hours ago" },
    { id: 3, message: "New model added: Pulley Systems", time: "Yesterday" }
  ];

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
                  Dashboard
                </Button>
                <Button
                  component={NavLink}
                  to="/progress"
                  startIcon={<Timeline />}
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
                  My Progress
                </Button>
                <Button
                  component={NavLink}
                  to="/bookmarks"
                  startIcon={<BookmarkBorder />}
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
                  Bookmarks
                </Button>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Notifications */}
              <CustomTooltip title="Notifications">
                <IconButton 
                  color="inherit"
                  onClick={handleNotificationsOpen}
                >
                  <Badge 
                    badgeContent={3} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: 10,
                        height: 18,
                        minWidth: 18
                      }
                    }}
                  >
                    <Notifications />
                  </Badge>
                </IconButton>
              </CustomTooltip>

              {/* Theme Toggle */}
              <CustomTooltip title={isDarkMode ? "Light Mode" : "Dark Mode"}>
                <IconButton onClick={onThemeToggle} color="inherit">
                  {isDarkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </CustomTooltip>
              
              {/* User Menu */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mr: 1.5, 
                    opacity: 0.9, 
                    display: { xs: 'none', lg: 'block' } 
                  }}
                >
                  {username}
                </Typography>
              </Box>
              
              <CustomTooltip title="Account settings">
                <IconButton
                  onClick={handleProfileMenuOpen}
                  size="small"
                  sx={{ ml: 1 }}
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                >
                  <Avatar 
                    sx={{ 
                      width: 34, 
                      height: 34,
                      bgcolor: theme.palette.primary.main
                    }}
                  >
                    {username.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </CustomTooltip>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
        PaperProps={{
          sx: {
            width: 320,
            maxWidth: '100%',
            mt: 1.5,
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="subtitle1" fontWeight="600">
            Recent Notifications
          </Typography>
        </Box>
        {notifications.map(notification => (
          <MenuItem 
            key={notification.id} 
            onClick={handleNotificationsClose}
            sx={{ 
              py: 1.5,
              borderBottom: `1px solid ${theme.palette.divider}`,
              '&:last-child': {
                borderBottom: 'none'
              }
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {notification.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {notification.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        <Box sx={{ p: 1.5, textAlign: 'center', borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button 
            fullWidth 
            variant="text" 
            onClick={() => {
              handleNotificationsClose();
              // Navigate to notifications page (if you create one)
            }}
          >
            View All Notifications
          </Button>
        </Box>
      </Menu>
      
      {/* User Menu */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: 2,
            minWidth: 180,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="subtitle2" fontWeight="600">
            {username}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Student
          </Typography>
        </Box>
        <MenuItem onClick={() => navigateTo('/settings')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => navigateTo('/help')}>
          <ListItemIcon>
            <Help fontSize="small" />
          </ListItemIcon>
          <ListItemText>Help Center</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: {
            width: 280,
            mt: '64px',
            height: 'calc(100% - 64px)'
          }
        }}
        ModalProps={{
          keepMounted: true
        }}
      >
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem 
              button 
              onClick={() => navigateTo('/')}
              selected={location.pathname === '/'}
            >
              <ListItemIcon>
                <Dashboard color={location.pathname === '/' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText 
                primary="Dashboard" 
                primaryTypographyProps={{
                  color: location.pathname === '/' ? 'primary' : 'inherit',
                  fontWeight: location.pathname === '/' ? 600 : 400
                }}
              />
            </ListItem>
            <ListItem 
              button 
              onClick={() => navigateTo('/progress')}
              selected={location.pathname === '/progress'}
            >
              <ListItemIcon>
                <Timeline color={location.pathname === '/progress' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText 
                primary="My Progress" 
                primaryTypographyProps={{
                  color: location.pathname === '/progress' ? 'primary' : 'inherit',
                  fontWeight: location.pathname === '/progress' ? 600 : 400
                }}
              />
            </ListItem>
            <ListItem 
              button 
              onClick={() => navigateTo('/bookmarks')}
              selected={location.pathname === '/bookmarks'}
            >
              <ListItemIcon>
                <BookmarkBorder color={location.pathname === '/bookmarks' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText 
                primary="Bookmarks" 
                primaryTypographyProps={{
                  color: location.pathname === '/bookmarks' ? 'primary' : 'inherit',
                  fontWeight: location.pathname === '/bookmarks' ? 600 : 400
                }}
              />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem 
              button 
              onClick={() => navigateTo('/settings')}
              selected={location.pathname === '/settings'}
            >
              <ListItemIcon>
                <Settings color={location.pathname === '/settings' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText 
                primary="Settings" 
                primaryTypographyProps={{
                  color: location.pathname === '/settings' ? 'primary' : 'inherit',
                  fontWeight: location.pathname === '/settings' ? 600 : 400
                }}
              />
            </ListItem>
            <ListItem 
              button 
              onClick={() => navigateTo('/help')}
              selected={location.pathname === '/help'}
            >
              <ListItemIcon>
                <Help color={location.pathname === '/help' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText 
                primary="Help Center" 
                primaryTypographyProps={{
                  color: location.pathname === '/help' ? 'primary' : 'inherit',
                  fontWeight: location.pathname === '/help' ? 600 : 400
                }}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navigation; 