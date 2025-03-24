import React from 'react';
import { Container, Typography, Paper, Box, Grid, Divider, useTheme } from '@mui/material';
import { Info, School, ViewInAr } from '@mui/icons-material';

/**
 * AboutPage component that displays information about the EduDive platform
 * 
 * @returns {JSX.Element} The rendered AboutPage component
 */
const AboutPage: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            mb: 2,
            fontWeight: 700,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, #64b5f6 30%, #2196f3 90%)'
              : 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          About EduDive
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          An interactive 3D learning platform for engineering students
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4, height: '100%', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ViewInAr sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
              <Typography variant="h4" component="h2" fontWeight={600}>
                Our Mission
              </Typography>
            </Box>
            <Typography paragraph>
              EduDive is dedicated to transforming engineering education through immersive 3D visualization. 
              We believe that complex engineering concepts are better understood when students can interact 
              with detailed 3D models that demonstrate how systems work in practice.
            </Typography>
            <Typography paragraph>
              Our platform bridges the gap between theoretical knowledge and practical understanding,
              allowing students to explore engineering systems from every angle and gain insights that
              traditional 2D illustrations cannot provide.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4, height: '100%', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <School sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
              <Typography variant="h4" component="h2" fontWeight={600}>
                Educational Approach
              </Typography>
            </Box>
            <Typography paragraph>
              We focus on creating detailed, interactive 3D models across various engineering disciplines. 
              Each model is carefully designed to highlight important components and mechanics, while our 
              integrated learning materials provide context and explanations.
            </Typography>
            <Typography paragraph>
              Students can manipulate models, view cross-sections, observe moving parts, and understand 
              engineering systems holistically - abilities that are crucial for developing engineering intuition.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h4" component="h2" fontWeight={600} sx={{ mb: 3 }}>
            Featured Disciplines
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={1} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h5" component="h3" fontWeight={600} sx={{ mb: 2, color: '#2196f3' }}>
              Mechanical Engineering
            </Typography>
            <Typography paragraph>
              Explore engines, hydraulic systems, manufacturing machinery, and mechanical devices through 
              detailed 3D models that demonstrate motion, power transmission, and mechanical principles.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={1} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h5" component="h3" fontWeight={600} sx={{ mb: 2, color: '#4caf50' }}>
              Civil Engineering
            </Typography>
            <Typography paragraph>
              Visualize structural systems, bridges, foundations, and construction techniques through
              interactive models that illustrate load distribution, material properties, and design principles.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={1} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h5" component="h3" fontWeight={600} sx={{ mb: 2, color: '#f44336' }}>
              Electrical Engineering
            </Typography>
            <Typography paragraph>
              Understand circuits, power systems, electronic components, and electrical machinery through
              3D visualizations that demonstrate current flow, magnetic fields, and electrical principles.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              mt: 4, 
              borderRadius: 3, 
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.08)' : 'rgba(25, 118, 210, 0.05)', 
              border: '1px solid',
              borderColor: theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.2)' : 'rgba(25, 118, 210, 0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Info sx={{ fontSize: 28, color: theme.palette.primary.main, mr: 2 }} />
              <Typography variant="h5" component="h2" fontWeight={600}>
                About the Platform
              </Typography>
            </Box>
            <Typography paragraph>
              EduDive is built using modern web technologies including React, Three.js for 3D rendering, 
              and Material-UI for the user interface. All 3D models are optimized for web performance 
              while maintaining high visual fidelity.
            </Typography>
            <Typography>
              This platform is designed as an educational tool to supplement traditional engineering 
              education, providing visual and interactive learning experiences that help students 
              build deeper understanding of engineering systems and principles.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AboutPage; 