import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Switch,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Grid,
  useTheme,
  Avatar,
  TextField,
  FormControl,
  FormLabel,
  Slider,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import {
  AccountCircle,
  Notifications,
  Visibility,
  Save,
  ColorLens,
  Language,
} from '@mui/icons-material';

interface SettingsPageProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ isDarkMode, onThemeToggle }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [modelQuality, setModelQuality] = useState('medium');
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [language, setLanguage] = useState('english');
  const [userName, setUserName] = useState('Student');
  const [email, setEmail] = useState('student@example.com');

  const handleSaveSettings = () => {
    // In a real app, we would save all settings here
    alert('Settings saved successfully!');
  };

  const handleColorModeChange = () => {
    onThemeToggle();
  };

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)',
      py: 6,
      background: isDarkMode 
        ? 'linear-gradient(145deg, #121212 0%, #1e1e1e 100%)' 
        : 'linear-gradient(145deg, #f5f5f5 0%, #ffffff 100%)'
    }}>
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            background: isDarkMode 
              ? 'linear-gradient(145deg, rgba(30,30,30,0.7) 0%, rgba(40,40,40,0.7) 100%)' 
              : 'linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(245,245,245,0.7) 100%)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              background: isDarkMode 
                ? 'linear-gradient(45deg, #90caf9 0%, #64b5f6 100%)' 
                : 'linear-gradient(45deg, #0d47a1 0%, #1976d2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Account Settings
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Customize your 3D Learning Hub experience
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          {/* Settings Navigation */}
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                height: '100%'
              }}
            >
              <Box 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: isDarkMode 
                    ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)` 
                    : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                  color: '#fff',
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mb: 2,
                    bgcolor: '#fff',
                    color: theme.palette.primary.main,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }}
                >
                  <Typography variant="h4">
                    {userName.charAt(0).toUpperCase()}
                  </Typography>
                </Avatar>
                <Typography variant="h6" fontWeight="600">
                  {userName}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {email}
                </Typography>
              </Box>
              
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  startIcon={<AccountCircle />}
                  onClick={() => setActiveTab('profile')}
                  variant={activeTab === 'profile' ? 'contained' : 'text'}
                  sx={{ justifyContent: 'flex-start', mb: 1, py: 1.5, borderRadius: 2 }}
                >
                  Profile
                </Button>
                <Button
                  fullWidth
                  startIcon={<ColorLens />}
                  onClick={() => setActiveTab('appearance')}
                  variant={activeTab === 'appearance' ? 'contained' : 'text'}
                  sx={{ justifyContent: 'flex-start', mb: 1, py: 1.5, borderRadius: 2 }}
                >
                  Appearance
                </Button>
                <Button
                  fullWidth
                  startIcon={<Visibility />}
                  onClick={() => setActiveTab('display')}
                  variant={activeTab === 'display' ? 'contained' : 'text'}
                  sx={{ justifyContent: 'flex-start', mb: 1, py: 1.5, borderRadius: 2 }}
                >
                  3D Rendering
                </Button>
                <Button
                  fullWidth
                  startIcon={<Notifications />}
                  onClick={() => setActiveTab('notifications')}
                  variant={activeTab === 'notifications' ? 'contained' : 'text'}
                  sx={{ justifyContent: 'flex-start', mb: 1, py: 1.5, borderRadius: 2 }}
                >
                  Notifications
                </Button>
                <Button
                  fullWidth
                  startIcon={<Language />}
                  onClick={() => setActiveTab('language')}
                  variant={activeTab === 'language' ? 'contained' : 'text'}
                  sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 2 }}
                >
                  Language
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Settings Content */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 4, borderRadius: 2 }}>
              {activeTab === 'profile' && (
                <>
                  <Typography variant="h5" fontWeight="600" gutterBottom>
                    Profile Settings
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Manage your personal information
                  </Typography>
                  <Divider sx={{ my: 3 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Institution"
                        defaultValue="University of Engineering"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<Save />}
                        onClick={handleSaveSettings}
                        sx={{ mt: 2 }}
                      >
                        Save Profile
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}

              {activeTab === 'appearance' && (
                <>
                  <Typography variant="h5" fontWeight="600" gutterBottom>
                    Appearance Settings
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Customize how the application looks
                  </Typography>
                  <Divider sx={{ my: 3 }} />
                  
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={isDarkMode} 
                        onChange={handleColorModeChange} 
                        color="primary" 
                      />
                    }
                    label="Dark Mode"
                  />
                  
                  <Box sx={{ mt: 4 }}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Color Theme</FormLabel>
                      <RadioGroup 
                        defaultValue="blue" 
                        name="color-theme-group"
                        sx={{ mt: 2 }}
                      >
                        <FormControlLabel value="blue" control={<Radio />} label="Blue (Default)" />
                        <FormControlLabel value="purple" control={<Radio />} label="Purple" />
                        <FormControlLabel value="green" control={<Radio />} label="Green" />
                        <FormControlLabel value="orange" control={<Radio />} label="Orange" />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<Save />}
                    onClick={handleSaveSettings}
                    sx={{ mt: 4 }}
                  >
                    Save Appearance
                  </Button>
                </>
              )}

              {activeTab === 'display' && (
                <>
                  <Typography variant="h5" fontWeight="600" gutterBottom>
                    3D Rendering Settings
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Configure how 3D models are displayed
                  </Typography>
                  <Divider sx={{ my: 3 }} />
                  
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <InputLabel id="quality-select-label">Model Quality</InputLabel>
                    <Select
                      labelId="quality-select-label"
                      value={modelQuality}
                      label="Model Quality"
                      onChange={(e) => setModelQuality(e.target.value)}
                    >
                      <MenuItem value="low">Low (Best Performance)</MenuItem>
                      <MenuItem value="medium">Medium (Balanced)</MenuItem>
                      <MenuItem value="high">High (Best Quality)</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Typography id="animation-speed-slider" gutterBottom>
                    Animation Speed
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography>Slow</Typography>
                    <Slider
                      value={animationSpeed}
                      min={0}
                      max={100}
                      step={10}
                      valueLabelDisplay="auto"
                      onChange={(_e, newValue) => setAnimationSpeed(newValue as number)}
                    />
                    <Typography>Fast</Typography>
                  </Box>
                  
                  <FormControlLabel
                    control={<Switch defaultChecked color="primary" />}
                    label="Enable Shadows"
                    sx={{ mt: 3, display: 'block' }}
                  />
                  
                  <FormControlLabel
                    control={<Switch defaultChecked color="primary" />}
                    label="Enable Anti-aliasing"
                    sx={{ mt: 1, display: 'block' }}
                  />
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<Save />}
                    onClick={handleSaveSettings}
                    sx={{ mt: 4 }}
                  >
                    Save Display Settings
                  </Button>
                </>
              )}

              {activeTab === 'notifications' && (
                <>
                  <Typography variant="h5" fontWeight="600" gutterBottom>
                    Notification Settings
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Manage your notification preferences
                  </Typography>
                  <Divider sx={{ my: 3 }} />
                  
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={notificationsEnabled} 
                        onChange={(e) => setNotificationsEnabled(e.target.checked)} 
                        color="primary" 
                      />
                    }
                    label="Enable Notifications"
                  />
                  
                  <Typography variant="subtitle1" sx={{ mt: 4, mb: 2 }}>
                    Notification Types
                  </Typography>
                  
                  <FormControlLabel
                    control={<Switch defaultChecked color="primary" />}
                    label="New Course Content"
                    sx={{ display: 'block', ml: 2, mb: 1 }}
                  />
                  
                  <FormControlLabel
                    control={<Switch defaultChecked color="primary" />}
                    label="Quiz Reminders"
                    sx={{ display: 'block', ml: 2, mb: 1 }}
                  />
                  
                  <FormControlLabel
                    control={<Switch defaultChecked color="primary" />}
                    label="Achievement Unlocked"
                    sx={{ display: 'block', ml: 2, mb: 1 }}
                  />
                  
                  <FormControlLabel
                    control={<Switch color="primary" />}
                    label="System Updates"
                    sx={{ display: 'block', ml: 2, mb: 1 }}
                  />
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<Save />}
                    onClick={handleSaveSettings}
                    sx={{ mt: 4 }}
                  >
                    Save Notification Settings
                  </Button>
                </>
              )}

              {activeTab === 'language' && (
                <>
                  <Typography variant="h5" fontWeight="600" gutterBottom>
                    Language Settings
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Choose your preferred language
                  </Typography>
                  <Divider sx={{ my: 3 }} />
                  
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <InputLabel id="language-select-label">Interface Language</InputLabel>
                    <Select
                      labelId="language-select-label"
                      value={language}
                      label="Interface Language"
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <MenuItem value="english">English</MenuItem>
                      <MenuItem value="spanish">Spanish</MenuItem>
                      <MenuItem value="french">French</MenuItem>
                      <MenuItem value="german">German</MenuItem>
                      <MenuItem value="chinese">Chinese</MenuItem>
                      <MenuItem value="japanese">Japanese</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControlLabel
                    control={<Switch color="primary" />}
                    label="Enable Automatic Translation for Model Descriptions"
                    sx={{ display: 'block', mb: 2 }}
                  />
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<Save />}
                    onClick={handleSaveSettings}
                    sx={{ mt: 4 }}
                  >
                    Save Language Settings
                  </Button>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SettingsPage; 