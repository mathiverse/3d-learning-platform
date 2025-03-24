import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Tabs, 
  Tab, 
  Chip,
  useTheme,
  CardActionArea,
  CardActions,
  Paper,
  Breadcrumbs
} from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Info, 
  Engineering, 
  AccountTree, 
  ElectricBolt,
  ArrowForward,
  Home
} from '@mui/icons-material';

/**
 * Interface for model data
 */
interface ModelData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  discipline: 'mechanical' | 'civil' | 'electrical';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * ExplorePage component that displays available 3D models by discipline
 * 
 * @returns {JSX.Element} The rendered ExplorePage component
 */
const ExplorePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { discipline } = useParams<{ discipline?: string }>();
  const [currentTab, setCurrentTab] = useState<string>(discipline || 'all');
  
  // Update tab when discipline route parameter changes
  useEffect(() => {
    if (discipline) {
      setCurrentTab(discipline);
    } else {
      setCurrentTab('all');
    }
  }, [discipline]);
  
  // Difficulty level color mapping
  const difficultyColors = {
    beginner: '#4caf50',
    intermediate: '#ff9800',
    advanced: '#f44336'
  };
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
    if (newValue === 'all') {
      navigate('/explore');
    } else {
      navigate(`/explore/${newValue}`);
    }
  };
  
  // Page title based on discipline
  const getPageTitle = () => {
    switch (currentTab) {
      case 'mechanical':
        return 'Mechanical Engineering Models';
      case 'civil':
        return 'Civil Engineering Models';
      case 'electrical':
        return 'Electrical Engineering Models';
      default:
        return 'Explore 3D Models';
    }
  };

  // Page description based on discipline
  const getPageDescription = () => {
    switch (currentTab) {
      case 'mechanical':
        return 'Discover interactive 3D models of mechanical systems, engines, and mechanisms';
      case 'civil':
        return 'Explore structural elements, building components, and civil engineering concepts';
      case 'electrical':
        return 'Learn about electrical systems, components, and circuit designs';
      default:
        return 'Discover interactive 3D models across mechanical, civil, and electrical engineering';
    }
  };
  
  // Sample model data
  const models: ModelData[] = [
    // Mechanical models
    {
      id: 'v8-engine',
      title: 'V8 Engine',
      description: 'Explore the inner workings of a V8 engine, including pistons, crankshaft, and valve train.',
      thumbnail: '/images/thumbnails/v8-engine.jpg',
      discipline: 'mechanical',
      difficulty: 'intermediate'
    },
    {
      id: 'four-stroke',
      title: 'Four-Stroke Engine Cycle',
      description: 'Learn about the four phases of internal combustion: intake, compression, power, and exhaust.',
      thumbnail: '/images/thumbnails/four-stroke.jpg',
      discipline: 'mechanical',
      difficulty: 'beginner'
    },
    {
      id: 'combine-harvester',
      title: 'Combine Harvester',
      description: 'Examine the complex mechanisms that enable modern combine harvesters to efficiently harvest crops.',
      thumbnail: '/images/thumbnails/combine-harvester.jpg',
      discipline: 'mechanical',
      difficulty: 'advanced'
    },
    
    // Civil models
    {
      id: 'truss-bridge',
      title: 'Truss Bridge Structure',
      description: 'Understand the forces and structural elements that make truss bridges strong and efficient.',
      thumbnail: '/images/thumbnails/truss-bridge.jpg',
      discipline: 'civil',
      difficulty: 'intermediate'
    },
    {
      id: 'high-rise-frame',
      title: 'High-Rise Building Frame',
      description: 'Explore structural systems used in skyscrapers, including columns, beams, and bracing.',
      thumbnail: '/images/thumbnails/high-rise.jpg',
      discipline: 'civil',
      difficulty: 'advanced'
    },
    {
      id: 'foundation-types',
      title: 'Foundation Types',
      description: 'Compare different foundation types including spread footings, piles, and mat foundations.',
      thumbnail: '/images/thumbnails/foundations.jpg',
      discipline: 'civil',
      difficulty: 'beginner'
    },
    
    // Electrical models
    {
      id: 'transformer',
      title: 'Power Transformer',
      description: 'Visualize how transformers change voltage levels through electromagnetic induction.',
      thumbnail: '/images/thumbnails/transformer.jpg',
      discipline: 'electrical',
      difficulty: 'intermediate'
    },
    {
      id: 'electric-motor',
      title: 'Electric Motor',
      description: 'Understand the principles behind electric motors and how they convert electrical energy to mechanical motion.',
      thumbnail: '/images/thumbnails/electric-motor.jpg',
      discipline: 'electrical',
      difficulty: 'intermediate'
    },
    {
      id: 'circuit-board',
      title: 'Circuit Board Layout',
      description: 'Examine the structure and components of a typical printed circuit board (PCB).',
      thumbnail: '/images/thumbnails/circuit-board.jpg',
      discipline: 'electrical',
      difficulty: 'beginner'
    }
  ];
  
  // Filter models based on selected tab
  const filteredModels = currentTab === 'all' 
    ? models 
    : models.filter(model => model.discipline === currentTab);
  
  // Discipline icon mapping
  const getDisciplineIcon = (discipline: string) => {
    switch (discipline) {
      case 'mechanical':
        return <Engineering />;
      case 'civil':
        return <AccountTree />;
      case 'electrical':
        return <ElectricBolt />;
      default:
        return <Info />;
    }
  };

  return (
    <Container 
      maxWidth="xl"
      className="page-container"
      sx={{ pb: 6 }}
    >
      {/* Breadcrumbs navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Button
          component={Link}
          to="/"
          startIcon={<Home />}
          size="small"
          color="inherit"
          sx={{ textTransform: 'none' }}
        >
          Home
        </Button>
        <Typography color="text.primary">
          {currentTab === 'all' ? 'Explore' : currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
        </Typography>
      </Breadcrumbs>
      
      {/* Page Title */}
      <Box 
        component={Paper} 
        elevation={1}
        sx={{ 
          mb: 5, 
          p: 4, 
          textAlign: 'center',
          borderRadius: 3,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(120deg, rgba(30,30,30,0.7) 0%, rgba(40,40,40,0.7) 100%)'
            : 'linear-gradient(120deg, rgba(255,255,255,0.7) 0%, rgba(245,245,245,0.7) 100%)',
        }}
      >
        {discipline && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box 
              sx={{ 
                p: 1.5, 
                borderRadius: '50%', 
                bgcolor: theme.palette.primary.main,
                color: 'white',
                display: 'flex'
              }}
            >
              {getDisciplineIcon(discipline)}
            </Box>
          </Box>
        )}
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
          {getPageTitle()}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          {getPageDescription()}
        </Typography>
      </Box>
      
      {/* Discipline tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          textColor="primary"
          indicatorColor="primary"
          sx={{ 
            '& .MuiTab-root': { 
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '1rem',
              minWidth: 100,
            }
          }}
        >
          <Tab value="all" label="All Disciplines" />
          <Tab 
            value="mechanical" 
            label="Mechanical" 
            icon={<Engineering />} 
            iconPosition="start"
          />
          <Tab 
            value="civil" 
            label="Civil" 
            icon={<AccountTree />} 
            iconPosition="start"
          />
          <Tab 
            value="electrical" 
            label="Electrical" 
            icon={<ElectricBolt />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>
      
      {/* Model cards grid */}
      <Box
        sx={{
          flexGrow: 1,
          padding: 3,
          overflow: 'auto',
          width: '100%'
        }}
      >
        <Grid container spacing={4}>
          {filteredModels.length > 0 ? (
            filteredModels.map((model) => (
              <Grid item xs={12} sm={6} md={4} key={model.id}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 3,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[10],
                    }
                  }}
                >
                  <CardActionArea component={Link} to={`/model/${model.discipline}/${model.id}`}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={model.thumbnail}
                        alt={model.title}
                        sx={{ backgroundSize: 'cover' }}
                        // Fallback to a discipline-specific gradient if image fails to load
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          // Use different colors based on discipline
                          const gradientColor = model.discipline === 'mechanical' 
                            ? 'rgb(25,118,210)' 
                            : model.discipline === 'civil' 
                              ? 'rgb(76,175,80)' 
                              : 'rgb(244,67,54)';
                            
                          target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 600 400"><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${gradientColor};stop-opacity:0.8" /><stop offset="100%" style="stop-color:${gradientColor};stop-opacity:0.4" /></linearGradient><rect fill="url(%23grad)" width="600" height="400" /><text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">${model.discipline.charAt(0).toUpperCase() + model.discipline.slice(1)}: ${model.title}</text></svg>`;
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          bgcolor: model.discipline === 'mechanical' ? '#2196f3' : 
                                  model.discipline === 'civil' ? '#4caf50' : '#f44336',
                          color: 'white',
                          borderRadius: 5,
                          px: 1.5,
                          py: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          typography: 'caption',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                      >
                        {getDisciplineIcon(model.discipline)}
                        <Box component="span" sx={{ ml: 0.5 }}>
                          {model.discipline.charAt(0).toUpperCase() + model.discipline.slice(1)}
                        </Box>
                      </Box>
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {model.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {model.description}
                      </Typography>
                      <Chip 
                        label={model.difficulty.charAt(0).toUpperCase() + model.difficulty.slice(1)} 
                        size="small"
                        sx={{ 
                          bgcolor: theme.palette.mode === 'dark' 
                            ? 'rgba(0,0,0,0.2)' 
                            : 'rgba(255,255,255,0.8)',
                          border: '1px solid',
                          borderColor: difficultyColors[model.difficulty],
                          color: difficultyColors[model.difficulty],
                          fontWeight: 500
                        }}
                      />
                    </CardContent>
                  </CardActionArea>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      component={Link}
                      to={`/model/${model.discipline}/${model.id}`}
                      variant="outlined"
                      color="primary"
                      endIcon={<ArrowForward />}
                      fullWidth
                    >
                      Explore Model
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', width: '100%', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No models found for this discipline.
              </Typography>
            </Box>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default ExplorePage; 