import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  Paper,
  useTheme,
  CardActionArea,
  Chip,
  alpha,
  Button,
  CardActions
} from '@mui/material';
import {
  Build,
  Architecture,
  ElectricBolt,
  ArrowForward,
  ViewInAr,
  School
} from '@mui/icons-material';

interface DisciplineCard {
  name: string;
  path: string;
  description: string;
  modelCount: number;
  icon: React.ReactNode;
  lightColors: {
    bgColor: string;
    gradientColor: string;
  };
  darkColors: {
    bgColor: string;
    gradientColor: string;
  };
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const disciplines: DisciplineCard[] = [
    {
      name: 'Mechanical Engineering',
      path: 'mechanical',
      description: 'Explore 3D models of machine parts, mechanisms, and mechanical systems',
      modelCount: 3,
      icon: <Build fontSize="large" />,
      lightColors: {
        bgColor: '#e3f2fd',
        gradientColor: '#bbdefb'
      },
      darkColors: {
        bgColor: '#0d47a1',
        gradientColor: '#1565c0'
      }
    },
    {
      name: 'Civil Engineering',
      path: 'civil',
      description: 'Study structural elements, building components, and construction details',
      modelCount: 3,
      icon: <Architecture fontSize="large" />,
      lightColors: {
        bgColor: '#e8f5e9',
        gradientColor: '#c8e6c9'
      },
      darkColors: {
        bgColor: '#1b5e20',
        gradientColor: '#2e7d32'
      }
    },
    {
      name: 'Electrical Engineering',
      path: 'electrical',
      description: 'Learn about electrical components, circuits, and power systems',
      modelCount: 3,
      icon: <ElectricBolt fontSize="large" />,
      lightColors: {
        bgColor: '#fff3e0',
        gradientColor: '#ffe0b2'
      },
      darkColors: {
        bgColor: '#e65100',
        gradientColor: '#f57c00'
      }
    }
  ];

  return (
    <Box
      className="page-container"
      sx={{
        minHeight: '100%',
        flexGrow: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        py: 6,
        background: isDarkMode 
          ? 'linear-gradient(145deg, #121212 0%, #1e1e1e 100%)' 
          : 'linear-gradient(145deg, #f5f5f5 0%, #ffffff 100%)'
      }}
    >
      <Container maxWidth="lg">
        <Box 
          component={Paper} 
          elevation={isDarkMode ? 2 : 1}
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 3,
            background: isDarkMode 
              ? 'linear-gradient(145deg, rgba(30,30,30,0.7) 0%, rgba(40,40,40,0.7) 100%)' 
              : 'linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(245,245,245,0.7) 100%)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
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
            Explore Engineering Disciplines
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2, maxWidth: '800px' }}>
            Select a discipline to explore interactive 3D models and enhance your engineering knowledge
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {disciplines.map((discipline) => {
            const colors = isDarkMode ? discipline.darkColors : discipline.lightColors;
            
            return (
              <Grid item xs={12} md={4} key={discipline.path}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: isDarkMode
                      ? '0 10px 30px -12px rgba(0,0,0,0.5)'
                      : '0 10px 30px -12px rgba(0,0,0,0.2)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: isDarkMode
                        ? '0 20px 40px -12px rgba(0,0,0,0.6)'
                        : '0 20px 40px -12px rgba(0,0,0,0.3)'
                    }
                  }}
                >
                  <CardActionArea 
                    onClick={() => navigate(`/explore/${discipline.path}`)}
                    sx={{ height: 'calc(100% - 64px)' }}
                  >
                    <Box 
                      sx={{ 
                        height: 120, 
                        background: `linear-gradient(135deg, ${colors.bgColor} 0%, ${colors.gradientColor} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Box 
                        sx={{ 
                          p: 2, 
                          borderRadius: '50%', 
                          backgroundColor: isDarkMode ? alpha('#fff', 0.15) : '#fff',
                          boxShadow: isDarkMode
                            ? '0 4px 20px rgba(255,255,255,0.1)'
                            : '0 4px 20px rgba(0,0,0,0.1)',
                          color: isDarkMode ? '#fff' : theme.palette.primary.main
                        }}
                      >
                        {discipline.icon}
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography variant="h5" component="h2" fontWeight="600" gutterBottom>
                        {discipline.name}
                      </Typography>
                      <Typography color="text.secondary" paragraph>
                        {discipline.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Chip 
                          label={`${discipline.modelCount} Models`} 
                          size="small" 
                          color="primary" 
                          variant={isDarkMode ? "filled" : "outlined"}
                        />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      color="primary" 
                      onClick={() => navigate(`/explore/${discipline.path}`)}
                      startIcon={<ViewInAr />}
                      size="small"
                    >
                      Explore Models
                    </Button>
                    <Button 
                      color="secondary"
                      onClick={() => navigate(`/model/${discipline.path}/intro`)}
                      startIcon={<School />}
                      size="small"
                    >
                      Start Learning
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 