import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Box
} from '@mui/material';
import {
  Build,
  Architecture,
  ElectricBolt
} from '@mui/icons-material';

interface DisciplineCard {
  name: string;
  path: string;
  description: string;
  modelCount: number;
  icon: React.ReactNode;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const disciplines: DisciplineCard[] = [
    {
      name: 'Mechanical Engineering',
      path: 'mechanical',
      description: 'Explore 3D models of machine parts, mechanisms, and mechanical systems',
      modelCount: 10,
      icon: <Build fontSize="large" />
    },
    {
      name: 'Civil Engineering',
      path: 'civil',
      description: 'Study structural elements, building components, and construction details',
      modelCount: 8,
      icon: <Architecture fontSize="large" />
    },
    {
      name: 'Electrical Engineering',
      path: 'electrical',
      description: 'Learn about electrical components, circuits, and power systems',
      modelCount: 6,
      icon: <ElectricBolt fontSize="large" />
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Select Your Engineering Discipline
      </Typography>
      <Grid container spacing={3}>
        {disciplines.map((discipline) => (
          <Grid item xs={12} md={4} key={discipline.path}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
              onClick={() => navigate(`/model/${discipline.path}/intro`)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {discipline.icon}
                </Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {discipline.name}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {discipline.description}
                </Typography>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  {discipline.modelCount} Models Available
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard; 