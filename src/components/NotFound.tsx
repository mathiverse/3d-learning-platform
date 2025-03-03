import React from 'react';
import { Box, Typography, Button, Container, Paper, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { SentimentDissatisfied, Home } from '@mui/icons-material';

const NotFound: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)',
      py: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isDarkMode 
        ? 'linear-gradient(145deg, #121212 0%, #1e1e1e 100%)' 
        : 'linear-gradient(145deg, #f5f5f5 0%, #ffffff 100%)'
    }}>
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 6 },
            textAlign: 'center',
            borderRadius: 4,
            background: isDarkMode 
              ? 'linear-gradient(145deg, rgba(30,30,30,0.7) 0%, rgba(40,40,40,0.7) 100%)' 
              : 'linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(245,245,245,0.7) 100%)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
          }}
        >
          <SentimentDissatisfied sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              mb: 3
            }}
          >
            404 - Page Not Found
          </Typography>
          
          <Typography variant="h6" color="text.secondary" paragraph>
            The page you are looking for doesn't exist or has been moved.
          </Typography>
          
          <Button 
            component={Link} 
            to="/" 
            variant="contained" 
            color="primary" 
            size="large"
            startIcon={<Home />}
            sx={{ mt: 3, px: 4, py: 1.5 }}
          >
            Return to Dashboard
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFound; 