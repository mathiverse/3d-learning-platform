import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, useMediaQuery, CssBaseline, Box } from '@mui/material';
import { deepPurple, amber } from '@mui/material/colors';

// Components
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import ModelViewer from './components/ModelViewer';
import ExplorePage from './components/ExplorePage';
import AboutPage from './components/AboutPage';
import HelpPage from './components/HelpPage';
import NotFound from './components/NotFound';

const App: React.FC = () => {
  // State for dark mode toggle
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState<boolean>(prefersDarkMode);
  
  // Create theme based on dark mode preference
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: deepPurple[500],
          },
          secondary: {
            main: amber[500],
          },
          background: {
            default: darkMode ? '#121212' : '#f5f5f7',
            paper: darkMode ? '#1e1e1e' : '#ffffff',
          },
        },
        typography: {
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(','),
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                  width: '0.4em',
                },
                '&::-webkit-scrollbar-track': {
                  background: darkMode ? '#1e1e1e' : '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: darkMode ? '#888' : '#bbb',
                  borderRadius: 6,
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: '12px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: darkMode 
                    ? '0 8px 20px rgba(0, 0, 0, 0.4)' 
                    : '0 8px 20px rgba(0, 0, 0, 0.1)',
                },
              },
            },
          },
        },
      }),
    [darkMode]
  );

  // Toggle dark mode handler
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          {/* Nav Bar */}
          <NavBar darkMode={darkMode} handleToggleDarkMode={handleToggleDarkMode} />
          
          {/* Main Content */}
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'auto',
              position: 'relative'
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/model/:discipline/:modelId" element={<ModelViewer />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/explore/:discipline" element={<ExplorePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
