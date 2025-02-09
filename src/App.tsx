import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ModelViewer from './components/ModelViewer';
import CourseProgress from './components/CourseProgress';
import AnimatedBackground from './components/AnimatedBackground';
import { lightTheme, darkTheme } from './theme/theme';
import './styles/main.css';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <AnimatedBackground />
      <Router>
        <div className="app-container">
          <Navigation username="Student" onThemeToggle={toggleTheme} isDarkMode={isDarkMode} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/model/:discipline/:modelId" element={<ModelViewer />} />
            <Route path="/progress" element={<CourseProgress />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
