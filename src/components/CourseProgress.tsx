import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box
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
  const [progress, setProgress] = useState<Progress>({
    completedModels: [],
    quizScores: [],
    totalTimeSpent: 0
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Learning Progress
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Completed Models</Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {progress.completedModels.length}
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
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Average Quiz Score</Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {averageScore}%
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
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timer color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Time Spent</Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {Math.round(progress.totalTimeSpent / 60)}
              </Typography>
              <Typography color="text.secondary">minutes</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseProgress; 