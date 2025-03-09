import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  useTheme,
  LinearProgress
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  School,
  MenuBook,
  Assignment,
  Quiz
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ModelSection {
  id: string;
  title: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
  subsections?: ModelSubsection[];
}

interface ModelSubsection {
  id: string;
  title: string;
  progress: number;
}

// Sample data for the sidebar
const mechanicalSections: ModelSection[] = [
  {
    id: 'intro',
    title: 'Introduction to Mechanical Engineering',
    description: 'Basic concepts and principles',
    progress: 100,
    icon: <School />,
    subsections: [
      { id: 'intro-1', title: 'History of Mechanical Engineering', progress: 100 },
      { id: 'intro-2', title: 'Fundamental Principles', progress: 100 },
      { id: 'intro-3', title: 'Modern Applications', progress: 100 }
    ]
  },
  {
    id: 'gear-system',
    title: 'Gear Systems',
    description: 'Types and applications of gears',
    progress: 75,
    icon: <MenuBook />,
    subsections: [
      { id: 'gear-1', title: 'Spur Gears', progress: 100 },
      { id: 'gear-2', title: 'Helical Gears', progress: 100 },
      { id: 'gear-3', title: 'Bevel Gears', progress: 50 },
      { id: 'gear-4', title: 'Worm Gears', progress: 0 }
    ]
  },
  {
    id: 'lever-mechanism',
    title: 'Lever Mechanisms',
    description: 'Principles of mechanical advantage',
    progress: 30,
    icon: <Assignment />,
    subsections: [
      { id: 'lever-1', title: 'First Class Levers', progress: 100 },
      { id: 'lever-2', title: 'Second Class Levers', progress: 50 },
      { id: 'lever-3', title: 'Third Class Levers', progress: 0 },
      { id: 'lever-4', title: 'Compound Levers', progress: 0 }
    ]
  },
  {
    id: 'assessment',
    title: 'Assessment',
    description: 'Test your knowledge',
    progress: 0,
    icon: <Quiz />
  }
];

// Sample data for other disciplines
const civilSections: ModelSection[] = [
  // Similar structure to mechanical sections
];

const electricalSections: ModelSection[] = [
  // Similar structure to mechanical sections
];

interface LearningModelSidebarProps {
  onClose: () => void;
}

const LearningModelSidebar: React.FC<LearningModelSidebarProps> = ({ onClose }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = React.useState<string[]>([]);

  // Get sections based on discipline
  const getSections = (discipline: string): ModelSection[] => {
    switch (discipline) {
      case 'mechanical':
        return mechanicalSections;
      case 'civil':
        return civilSections;
      case 'electrical':
        return electricalSections;
      default:
        return mechanicalSections;
    }
  };

  const handleSectionClick = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId) 
        : [...prev, sectionId]
    );
  };

  const handleModelClick = (discipline: string, modelId: string) => {
    navigate(`/model/${discipline}/${modelId}`);
    if (onClose) onClose();
  };

  return (
    <Box
      sx={{
        width: 280,
        height: '100%',
        overflow: 'auto',
        backgroundColor: isDarkMode ? 'background.paper' : '#fff',
        borderRight: `1px solid ${theme.palette.divider}`,
        p: 2
      }}
    >
      <Typography variant="h6" gutterBottom>
        Learning Models
      </Typography>
      
      <List component="nav" aria-label="learning models">
        {getSections('mechanical').map(section => (
          <React.Fragment key={section.id}>
            <ListItem 
              button 
              onClick={() => section.subsections ? handleSectionClick(section.id) : handleModelClick('mechanical', section.id)}
            >
              <ListItemText 
                primary={section.title} 
                secondary={section.description}
              />
              {section.subsections && (
                expandedSections.includes(section.id) ? <ExpandLess /> : <ExpandMore />
              )}
            </ListItem>
            
            <Box sx={{ pl: 2, pr: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={section.progress} 
                sx={{ height: 5, borderRadius: 5, mb: 1 }}
              />
            </Box>
            
            {section.subsections && (
              <Collapse in={expandedSections.includes(section.id)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {section.subsections.map(subsection => (
                    <ListItem 
                      key={subsection.id} 
                      button 
                      sx={{ pl: 4 }}
                      onClick={() => handleModelClick('mechanical', section.id)}
                    >
                      <ListItemText primary={subsection.title} />
                      <Box sx={{ width: '30%' }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={subsection.progress} 
                          sx={{ height: 4, borderRadius: 4 }}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default LearningModelSidebar; 