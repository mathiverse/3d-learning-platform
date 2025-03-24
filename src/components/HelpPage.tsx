import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Grid,
  useTheme
} from '@mui/material';
import { 
  ExpandMore, 
  Help, 
  Info, 
  TouchApp, 
  ZoomIn, 
  RestartAlt, 
  GridOn, 
  Fullscreen,
  PhotoCamera,
  ChevronRight,
  Computer
} from '@mui/icons-material';

/**
 * HelpPage component that provides guidance on how to use the EduDive platform
 * 
 * @returns {JSX.Element} The rendered HelpPage component
 */
const HelpPage: React.FC = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | false>('panel1');

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 5, textAlign: 'center' }}>
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
          Help Center
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          Learn how to navigate and get the most out of the EduDive platform
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Help sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
              <Typography variant="h5" component="h2" fontWeight={600}>
                Getting Started
              </Typography>
            </Box>
            <Typography paragraph>
              Welcome to EduDive! This platform provides interactive 3D models to help you understand 
              engineering concepts across multiple disciplines.
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              endIcon={<ChevronRight />}
              sx={{ mt: 1 }}
              href="/explore"
            >
              Start Exploring
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Box sx={{ mb: 2 }}>
              <TouchApp sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
              <Typography variant="h5" component="h2" fontWeight={600}>
                Interactive Controls
              </Typography>
            </Box>
            <Typography paragraph>
              All models are fully interactive. You can rotate, zoom, and explore each 3D model from any angle. 
              Additional controls allow you to toggle wireframe mode, take screenshots, and reset the view.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Computer sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
              <Typography variant="h5" component="h2" fontWeight={600}>
                System Requirements
              </Typography>
            </Box>
            <Typography paragraph>
              EduDive works best on modern browsers (Chrome, Firefox, Safari, or Edge). 
              For optimal performance, we recommend a dedicated graphics card and a stable internet connection.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Note: Mobile devices are supported but may have limited functionality.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h4" component="h2" fontWeight={600} sx={{ mt: 2, mb: 3 }}>
            Frequently Asked Questions
          </Typography>

          <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" fontWeight={500}>
                How do I navigate the 3D models?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                You can interact with the 3D models using the following controls:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><TouchApp color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Rotate: Click and drag (or touch and drag on mobile)" 
                    secondary="This lets you view the model from different angles"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ZoomIn color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Zoom: Scroll wheel (or pinch on mobile)" 
                    secondary="Zoom in to see details or zoom out for a broader view"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><RestartAlt color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Reset view: Click the reset button" 
                    secondary="This returns the model to its default position and zoom level"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" fontWeight={500}>
                What special viewing options are available?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                EduDive offers several special viewing options to enhance your learning experience:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><GridOn color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Wireframe mode" 
                    secondary="Toggles wireframe view to see the model's structure"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Fullscreen color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Fullscreen mode" 
                    secondary="Expands the model to fill your entire screen"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhotoCamera color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Screenshots" 
                    secondary="Capture and download images of the model for study or assignments"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" fontWeight={500}>
                How can I learn about specific parts of a model?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                Each model includes a sidebar with detailed information. The sidebar contains:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><Info color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Component descriptions" 
                    secondary="Explanations of each important part of the model"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Info color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Functioning principles" 
                    secondary="How the system works and the engineering concepts involved"
                  />
                </ListItem>
              </List>
              <Typography>
                You can toggle the sidebar by clicking the arrow button on the left side of the screen.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" fontWeight={500}>
                Does EduDive work on mobile devices?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                Yes, EduDive is designed to be responsive and works on mobile devices. However, for the best experience, 
                we recommend using a desktop or laptop computer with a larger screen and more processing power.
              </Typography>
              <Typography>
                On mobile devices, you can:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Rotate models with touch gestures" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Pinch to zoom in and out" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Access all the same information as on desktop" 
                  />
                </ListItem>
              </List>
              <Typography variant="body2" color="text.secondary">
                Note: On devices with lower processing power, some models might load more slowly or have reduced visual quality.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 4 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Still need help?
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              href="mailto:support@edudive.example.com"
              sx={{ mt: 2 }}
            >
              Contact Support
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HelpPage; 