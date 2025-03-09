import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ModelViewer from './components/ModelViewer';
import CourseProgress from './components/CourseProgress';
import SettingsPage from './components/SettingsPage';
import NotFound from './components/NotFound';
import './styles/main.css';

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || false
  );
  
  const [username] = useState('Student');

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f7fa',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      }
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box className="app-container">
          <Navigation 
            username={username} 
            onThemeToggle={toggleTheme} 
            isDarkMode={darkMode} 
          />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/model/:discipline/:modelId" element={<ModelViewer />} />
            <Route path="/progress" element={<CourseProgress />} />
            <Route path="/settings" element={<SettingsPage isDarkMode={darkMode} onThemeToggle={toggleTheme} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
