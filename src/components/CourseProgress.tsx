import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Avatar,
  useTheme,
  Paper
} from '@mui/material';
import {
  CheckCircle,
  School,
  Timer
} from '@mui/icons-material';

interface Progress {
  completedModels: string[];
  quizScores: number[];
  totalTimeSpent: number;
}

const CourseProgress: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [progress, setProgress] = useState<Progress>({
    completedModels: ['gear-system', 'lever-mechanism', 'beam-types'],
    quizScores: [85, 92, 78, 88],
    totalTimeSpent: 325 // minutes
  });

  useEffect(() => {
    const savedProgress = localStorage.getItem('courseProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const averageScore = progress.quizScores.length
    ? Math.round(progress.quizScores.reduce((a, b) => a + b, 0) / progress.quizScores.length)
    : 0;

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)',
      background: isDarkMode 
        ? 'linear-gradient(145deg, #121212 0%, #1e1e1e 100%)' 
        : 'linear-gradient(145deg, #f5f5f5 0%, #ffffff 100%)',
      py: 6
    }}>
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 6,
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
            Your Learning Progress
          </Typography>
          <Typography color="text.secondary" variant="h6" gutterBottom sx={{ mb: 2 }}>
            Track your achievements and knowledge growth
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 2,
              boxShadow: isDarkMode ? '0 8px 24px rgba(0,0,0,0.2)' : '0 8px 24px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: isDarkMode ? '0 12px 28px rgba(0,0,0,0.3)' : '0 12px 28px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                    <CheckCircle />
                  </Avatar>
                  <Typography variant="h6">Completed Models</Typography>
                </Box>
                <Typography variant="h3" color="primary">
                  {progress.completedModels.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  of 24 total models
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(progress.completedModels.length / 24) * 100}
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 2,
              boxShadow: isDarkMode ? '0 8px 24px rgba(0,0,0,0.2)' : '0 8px 24px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: isDarkMode ? '0 12px 28px rgba(0,0,0,0.3)' : '0 12px 28px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                    <School />
                  </Avatar>
                  <Typography variant="h6">Average Score</Typography>
                </Box>
                <Typography variant="h3" color="primary">
                  {averageScore}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  based on {progress.quizScores.length} quizzes
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={averageScore} 
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 2,
              boxShadow: isDarkMode ? '0 8px 24px rgba(0,0,0,0.2)' : '0 8px 24px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: isDarkMode ? '0 12px 28px rgba(0,0,0,0.3)' : '0 12px 28px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                    <Timer />
                  </Avatar>
                  <Typography variant="h6">Time Spent</Typography>
                </Box>
                <Typography variant="h3" color="primary">
                  {Math.round(progress.totalTimeSpent / 60)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hours of learning content
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Keep going! You're making great progress.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, mb: 3 }}>
          <Typography variant="h5" fontWeight="600">
            Recently Completed Models
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {progress.completedModels.map((model, index) => (
            <Grid item xs={12} sm={6} md={4} key={model}>
              <Card variant="outlined" sx={{ 
                borderRadius: 2,
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}>
                <CardContent>
                  <Typography variant="h6">
                    {model.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed {index === 0 ? 'Recently' : 'Earlier'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseProgress; 