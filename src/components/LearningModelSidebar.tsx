import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  useTheme,
  LinearProgress,
  IconButton,
  Divider,
  Paper,
  Button,
  Tooltip,
  Badge,
  Chip,
  Avatar
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  School,
  MenuBook,
  Assignment,
  Quiz,
  Close,
  Check,
  PlayArrow,
  PeopleAlt,
  EmojiEvents,
  Lightbulb
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ModelSection {
  id: string;
  title: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
  subsections?: ModelSubsection[];
  learningTime?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface ModelSubsection {
  id: string;
  title: string;
  progress: number;
  completed?: boolean;
  type?: 'video' | 'reading' | 'quiz' | 'interactive';
}

// Updated sample data with enhanced educational information
const mechanicalSections: ModelSection[] = [
  {
    id: 'intro',
    title: 'Introduction to Mechanical Engineering',
    description: 'Basic concepts and principles',
    progress: 100,
    icon: <School />,
    learningTime: '15 mins',
    difficulty: 'beginner',
    subsections: [
      { id: 'intro-1', title: 'History of Mechanical Engineering', progress: 100, completed: true, type: 'reading' },
      { id: 'intro-2', title: 'Fundamental Principles', progress: 100, completed: true, type: 'reading' },
      { id: 'intro-3', title: 'Modern Applications', progress: 100, completed: true, type: 'video' }
    ]
  },
  {
    id: 'v8-engine',
    title: 'V8 Engine',
    description: 'Explore the inner workings of a V8 engine',
    progress: 75,
    icon: <MenuBook />,
    learningTime: '30 mins',
    difficulty: 'intermediate',
    subsections: [
      { id: 'v8-1', title: 'Engine Block', progress: 100, completed: true, type: 'interactive' },
      { id: 'v8-2', title: 'Piston Assembly', progress: 100, completed: true, type: 'video' },
      { id: 'v8-3', title: 'Valve Train', progress: 50, completed: false, type: 'interactive' },
      { id: 'v8-4', title: 'Crankshaft System', progress: 0, completed: false, type: 'quiz' }
    ]
  },
  {
    id: 'four-stroke',
    title: 'Four-Stroke Engine Cycle',
    description: 'Learn about the four phases of internal combustion',
    progress: 80,
    icon: <Assignment />,
    learningTime: '25 mins',
    difficulty: 'beginner',
    subsections: [
      { id: 'four-1', title: 'Intake Stroke', progress: 100, completed: true, type: 'video' },
      { id: 'four-2', title: 'Compression Stroke', progress: 100, completed: true, type: 'interactive' },
      { id: 'four-3', title: 'Power Stroke', progress: 75, completed: false, type: 'interactive' },
      { id: 'four-4', title: 'Exhaust Stroke', progress: 50, completed: false, type: 'quiz' }
    ]
  },
  {
    id: 'combine-harvester',
    title: 'Combine Harvester',
    description: 'Examine complex agricultural machinery',
    progress: 30,
    icon: <Assignment />,
    learningTime: '40 mins',
    difficulty: 'advanced',
    subsections: [
      { id: 'harvester-1', title: 'Cutting Mechanism', progress: 100, completed: true, type: 'video' },
      { id: 'harvester-2', title: 'Threshing System', progress: 50, completed: false, type: 'interactive' },
      { id: 'harvester-3', title: 'Separation System', progress: 0, completed: false, type: 'reading' },
      { id: 'harvester-4', title: 'Grain Handling', progress: 0, completed: false, type: 'quiz' }
    ]
  }
];

// Sample data for other disciplines
const civilSections: ModelSection[] = [
  {
    id: 'intro',
    title: 'Introduction to Civil Engineering',
    description: 'Foundational concepts in civil engineering',
    progress: 100,
    icon: <School />,
    subsections: [
      { id: 'civil-intro-1', title: 'Civil Engineering Fundamentals', progress: 100 },
      { id: 'civil-intro-2', title: 'Structural Analysis Basics', progress: 100 }
    ]
  },
  {
    id: 'truss-bridge',
    title: 'Truss Bridge Structure',
    description: 'Understanding bridge structural elements',
    progress: 65,
    icon: <MenuBook />,
    subsections: [
      { id: 'truss-1', title: 'Truss Types', progress: 100 },
      { id: 'truss-2', title: 'Load Distribution', progress: 75 },
      { id: 'truss-3', title: 'Joint Design', progress: 25 }
    ]
  },
  {
    id: 'high-rise-frame',
    title: 'High-Rise Building Frame',
    description: 'Skyscraper structural systems',
    progress: 40,
    icon: <Assignment />,
    subsections: [
      { id: 'highrise-1', title: 'Column Systems', progress: 100 },
      { id: 'highrise-2', title: 'Beam Connections', progress: 50 },
      { id: 'highrise-3', title: 'Lateral Bracing', progress: 0 }
    ]
  },
  {
    id: 'foundation-types',
    title: 'Foundation Types',
    description: 'Different foundation systems',
    progress: 20,
    icon: <Assignment />,
    subsections: [
      { id: 'foundation-1', title: 'Spread Footings', progress: 75 },
      { id: 'foundation-2', title: 'Pile Foundations', progress: 0 },
      { id: 'foundation-3', title: 'Mat Foundations', progress: 0 }
    ]
  }
];

const electricalSections: ModelSection[] = [
  {
    id: 'intro',
    title: 'Introduction to Electrical Engineering',
    description: 'Basic electrical principles',
    progress: 100,
    icon: <School />,
    subsections: [
      { id: 'electrical-intro-1', title: 'Electrical Fundamentals', progress: 100 },
      { id: 'electrical-intro-2', title: 'Circuit Analysis', progress: 100 }
    ]
  },
  {
    id: 'transformer',
    title: 'Power Transformer',
    description: 'How transformers change voltage levels',
    progress: 80,
    icon: <MenuBook />,
    subsections: [
      { id: 'transformer-1', title: 'Core Construction', progress: 100 },
      { id: 'transformer-2', title: 'Windings', progress: 100 },
      { id: 'transformer-3', title: 'Electromagnetic Induction', progress: 50 }
    ]
  },
  {
    id: 'electric-motor',
    title: 'Electric Motor',
    description: 'Principles of electromechanical energy conversion',
    progress: 60,
    icon: <Assignment />,
    subsections: [
      { id: 'motor-1', title: 'Stator Design', progress: 100 },
      { id: 'motor-2', title: 'Rotor Components', progress: 75 },
      { id: 'motor-3', title: 'Electromagnetic Torque', progress: 0 }
    ]
  },
  {
    id: 'circuit-board',
    title: 'Circuit Board Layout',
    description: 'PCB design and components',
    progress: 40,
    icon: <Assignment />,
    subsections: [
      { id: 'pcb-1', title: 'Component Placement', progress: 100 },
      { id: 'pcb-2', title: 'Trace Routing', progress: 50 },
      { id: 'pcb-3', title: 'Multi-layer Design', progress: 0 }
    ]
  }
];

interface LearningModelSidebarProps {
  onClose: () => void;
  discipline?: string;
  modelId?: string;
}

const LearningModelSidebar: React.FC<LearningModelSidebarProps> = ({ 
  onClose, 
  discipline = 'mechanical',
  modelId = 'intro' 
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = React.useState<string[]>([modelId]);

  // Get sections based on discipline
  const getSections = (disciplineName: string): ModelSection[] => {
    switch (disciplineName) {
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

  const handleModelClick = (disciplineName: string, sectionId: string) => {
    navigate(`/model/${disciplineName}/${sectionId}`);
    if (onClose) onClose();
  };

  const getDifficultyColor = (difficulty: string | undefined) => {
    if (!difficulty) return theme.palette.primary.main;
    
    switch (difficulty) {
      case 'beginner':
        return theme.palette.success.main;
      case 'intermediate':
        return theme.palette.warning.main;
      case 'advanced':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const getContentTypeIcon = (type: string | undefined) => {
    if (!type) return null;
    
    switch (type) {
      case 'video':
        return <PlayArrow fontSize="small" />;
      case 'reading':
        return <MenuBook fontSize="small" />;
      case 'quiz':
        return <Quiz fontSize="small" />;
      case 'interactive':
        return <Lightbulb fontSize="small" />;
      default:
        return null;
    }
  };

  const sections = getSections(discipline);
  const currentSection = sections.find(section => section.id === modelId);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: isDarkMode ? 'background.paper' : '#fff',
        borderRight: `1px solid ${theme.palette.divider}`
      }}
    >
      {/* Header with discipline and stats */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: isDarkMode ? 'background.paper' : theme.palette.primary.light 
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 1 
        }}>
          <Typography variant="h6" fontWeight="600" sx={{ 
            color: isDarkMode ? 'text.primary' : '#fff'
          }}>
            {discipline.charAt(0).toUpperCase() + discipline.slice(1)} Learning
          </Typography>
          <IconButton size="small" onClick={onClose} sx={{ 
            color: isDarkMode ? 'text.primary' : '#fff'
          }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>

        {/* Learning stats */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 2,
          p: 1,
          borderRadius: 1,
          bgcolor: isDarkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'
        }}>
          <Tooltip title="Completed modules">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Badge 
                badgeContent={<Check sx={{ fontSize: 8 }} />} 
                color="success" 
                sx={{ 
                  '& .MuiBadge-badge': { 
                    height: 14, 
                    width: 14, 
                    minWidth: 14 
                  } 
                }}
              >
                <Avatar sx={{ 
                  bgcolor: isDarkMode ? 'primary.dark' : 'primary.dark',
                  width: 28,
                  height: 28
                }}>
                  <School sx={{ fontSize: 16 }} />
                </Avatar>
              </Badge>
              <Typography variant="caption" sx={{ mt: 0.5, color: isDarkMode ? 'text.primary' : '#fff' }}>
                2/4
              </Typography>
            </Box>
          </Tooltip>
          
          <Tooltip title="Learning time">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ 
                bgcolor: isDarkMode ? 'primary.dark' : 'primary.dark',
                width: 28,
                height: 28
              }}>
                <Assignment sx={{ fontSize: 16 }} />
              </Avatar>
              <Typography variant="caption" sx={{ mt: 0.5, color: isDarkMode ? 'text.primary' : '#fff' }}>
                110min
              </Typography>
            </Box>
          </Tooltip>
          
          <Tooltip title="Students enrolled">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ 
                bgcolor: isDarkMode ? 'primary.dark' : 'primary.dark',
                width: 28,
                height: 28
              }}>
                <PeopleAlt sx={{ fontSize: 16 }} />
              </Avatar>
              <Typography variant="caption" sx={{ mt: 0.5, color: isDarkMode ? 'text.primary' : '#fff' }}>
                1.2k
              </Typography>
            </Box>
          </Tooltip>
          
          <Tooltip title="Achievements">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Badge 
                badgeContent="1" 
                color="error"
                sx={{ 
                  '& .MuiBadge-badge': { 
                    height: 14, 
                    minWidth: 14 
                  } 
                }}
              >
                <Avatar sx={{ 
                  bgcolor: isDarkMode ? 'primary.dark' : 'primary.dark',
                  width: 28,
                  height: 28 
                }}>
                  <EmojiEvents sx={{ fontSize: 16 }} />
                </Avatar>
              </Badge>
              <Typography variant="caption" sx={{ mt: 0.5, color: isDarkMode ? 'text.primary' : '#fff' }}>
                3
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      </Paper>

      {/* Current model info */}
      {currentSection && (
        <Box sx={{ 
          p: 2, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(25,118,210,0.04)'
        }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {currentSection.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, mb: 2 }}>
            {currentSection.difficulty && (
              <Chip 
                label={currentSection.difficulty.charAt(0).toUpperCase() + currentSection.difficulty.slice(1)} 
                size="small"
                sx={{
                  bgcolor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.8)',
                  color: getDifficultyColor(currentSection.difficulty),
                  borderColor: getDifficultyColor(currentSection.difficulty),
                  border: '1px solid'
                }}
              />
            )}
            
            {currentSection.learningTime && (
              <Chip 
                label={currentSection.learningTime} 
                size="small"
                icon={<Assignment fontSize="small" />}
                variant="outlined"
              />
            )}
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            {currentSection.description}
          </Typography>
          
          <LinearProgress 
            variant="determinate" 
            value={currentSection.progress} 
            sx={{ 
              mt: 2,
              height: 8, 
              borderRadius: 5,
              bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
            }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">Progress</Typography>
            <Typography variant="caption" color="text.secondary">{currentSection.progress}%</Typography>
          </Box>
        </Box>
      )}
      
      {/* Learning modules list */}
      <Box sx={{ 
        overflow: 'auto', 
        flexGrow: 1, 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        maxHeight: 'calc(100vh - 270px)'
      }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, ml: 1 }}>
          LEARNING MODULES
        </Typography>
        
        <List component="nav" aria-label="learning models" dense sx={{ p: 0 }}>
          {sections.map(section => (
            <Paper
              key={section.id}
              elevation={0}
              sx={{
                mb: 1.5,
                overflow: 'hidden',
                borderRadius: 2,
                border: section.id === modelId ? 
                  `1px solid ${theme.palette.primary.main}` : 
                  `1px solid ${theme.palette.divider}`
              }}
            >
              <ListItem 
                button 
                onClick={() => section.subsections ? handleSectionClick(section.id) : handleModelClick(discipline, section.id)}
                selected={section.id === modelId}
                sx={{
                  borderLeft: section.id === modelId ? 
                    `4px solid ${theme.palette.primary.main}` : 
                    'none',
                  bgcolor: section.id === modelId ? 
                    (isDarkMode ? 'rgba(25,118,210,0.15)' : 'rgba(25,118,210,0.08)') : 
                    'transparent',
                  py: 1.5,
                  '&:hover': {
                    bgcolor: isDarkMode ? 'rgba(25,118,210,0.1)' : 'rgba(25,118,210,0.05)'
                  }
                }}
              >
                <Box sx={{ 
                  mr: 2, 
                  color: getDifficultyColor(section.difficulty),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  bgcolor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.8)',
                }}>
                  {section.icon}
                </Box>
                <ListItemText 
                  primary={
                    <Typography 
                      variant="body1" 
                      fontWeight={section.id === modelId ? 600 : 400}
                    >
                      {section.title}
                    </Typography>
                  } 
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={section.progress} 
                        sx={{ 
                          width: 80,
                          height: 4, 
                          borderRadius: 5, 
                          mr: 1,
                          bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {section.progress}%
                      </Typography>
                    </Box>
                  }
                />
                {section.subsections && (
                  expandedSections.includes(section.id) ? <ExpandLess /> : <ExpandMore />
                )}
              </ListItem>
              
              {section.subsections && (
                <Collapse in={expandedSections.includes(section.id)} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {section.subsections.map(subsection => (
                      <ListItem 
                        key={subsection.id} 
                        button 
                        sx={{ 
                          pl: 4,
                          py: 1,
                          bgcolor: isDarkMode ? 
                            'rgba(0,0,0,0.2)' : 
                            'rgba(0,0,0,0.02)'
                        }}
                        onClick={() => handleModelClick(discipline, section.id)}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: subsection.completed ? theme.palette.success.main : 'text.primary',
                          mr: 1.5
                        }}>
                          {subsection.completed ? 
                            <Check fontSize="small" /> : 
                            getContentTypeIcon(subsection.type)}
                        </Box>
                        <ListItemText 
                          primary={
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                textDecoration: subsection.completed ? 'line-through' : 'none',
                                color: subsection.completed ? 'text.secondary' : 'text.primary'
                              }}
                            >
                              {subsection.title}
                            </Typography>
                          } 
                        />
                        <Box sx={{ width: 40 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={subsection.progress} 
                            sx={{ 
                              height: 4, 
                              borderRadius: 4,
                              bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                            }}
                          />
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </Paper>
          ))}
        </List>
      </Box>
      
      {/* Footer action buttons */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        gap: 1,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}>
        <Button 
          variant="contained" 
          fullWidth
          startIcon={<PlayArrow />}
          onClick={() => {
            // In a real implementation, this would start the current module's interactive lesson
            alert('Starting interactive lesson mode');
          }}
        >
          Start Interactive Lesson
        </Button>
      </Box>
    </Box>
  );
};

export default LearningModelSidebar; 