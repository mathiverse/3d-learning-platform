import React from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Typography,
  Box,
  useTheme,
  Divider,
  Badge,
  Tooltip,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  ViewInAr,
  Quiz,
  VideoLibrary,
  Assignment,
  CheckCircle,
  InfoOutlined,
  LockOutlined
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import CustomTooltip from './CustomTooltip';

interface ModelSection {
  title: string;
  items: {
    id: string;
    title: string;
    type: 'model' | 'video' | 'quiz' | 'assignment';
    duration?: string;
  }[];
}

const disciplineContent: Record<string, ModelSection[]> = {
  mechanical: [
    {
      title: "Basic Mechanisms",
      items: [
        { id: "gear-system", title: "Gear Systems", type: "model", duration: "20 min" },
        { id: "lever-mechanism", title: "Lever Mechanisms", type: "model", duration: "15 min" },
        { id: "pulley-system", title: "Pulley Systems", type: "model", duration: "25 min" },
        { id: "mechanisms-quiz", title: "Mechanisms Quiz", type: "quiz" }
      ]
    },
    {
      title: "Machine Components",
      items: [
        { id: "bearings", title: "Types of Bearings", type: "model", duration: "30 min" },
        { id: "shafts", title: "Shaft Design", type: "model", duration: "25 min" },
        { id: "couplings", title: "Mechanical Couplings", type: "model", duration: "20 min" },
        { id: "components-assignment", title: "Design Assignment", type: "assignment" }
      ]
    }
  ],
  civil: [
    {
      title: "Structural Elements",
      items: [
        { id: "beam-types", title: "Types of Beams", type: "model", duration: "25 min" },
        { id: "column-design", title: "Column Design", type: "model", duration: "30 min" },
        { id: "truss-analysis", title: "Truss Analysis", type: "model", duration: "35 min" },
        { id: "structures-quiz", title: "Structures Quiz", type: "quiz" }
      ]
    },
    {
      title: "Construction Systems",
      items: [
        { id: "foundation-types", title: "Foundation Types", type: "model", duration: "25 min" },
        { id: "wall-systems", title: "Wall Systems", type: "model", duration: "20 min" },
        { id: "roof-structures", title: "Roof Structures", type: "model", duration: "30 min" },
        { id: "construction-assignment", title: "Design Project", type: "assignment" }
      ]
    }
  ],
  electrical: [
    {
      title: "Circuit Components",
      items: [
        { id: "resistors", title: "Resistor Types", type: "model", duration: "15 min" },
        { id: "capacitors", title: "Capacitor Types", type: "model", duration: "20 min" },
        { id: "inductors", title: "Inductor Types", type: "model", duration: "20 min" },
        { id: "components-quiz", title: "Components Quiz", type: "quiz" }
      ]
    },
    {
      title: "Power Systems",
      items: [
        { id: "transformers", title: "Transformers", type: "model", duration: "30 min" },
        { id: "generators", title: "Generators", type: "model", duration: "35 min" },
        { id: "distribution", title: "Power Distribution", type: "model", duration: "25 min" },
        { id: "power-assignment", title: "System Design", type: "assignment" }
      ]
    }
  ]
};

interface LearningModelSidebarProps {
  open: boolean;
  onClose: () => void;
}

const LearningModelSidebar: React.FC<LearningModelSidebarProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const { discipline = 'mechanical', modelId = 'intro' } = useParams<{ discipline: string; modelId: string }>();
  const [expandedSections, setExpandedSections] = React.useState<string[]>([]);

  // Simulate completed models
  const completedModels = ['gear-system', 'lever-mechanism', 'intro'];

  React.useEffect(() => {
    // Auto-expand section containing current model
    let sectionToExpand: string | null = null;
    
    disciplineContent[discipline]?.forEach(section => {
      if (section.items.some(item => item.id === modelId)) {
        sectionToExpand = section.title;
      }
    });
    
    if (sectionToExpand && !expandedSections.includes(sectionToExpand)) {
      setExpandedSections(prev => [...prev, sectionToExpand!]);
    }
  }, [discipline, modelId, expandedSections]);

  const handleSectionClick = (sectionTitle: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionTitle) 
        ? prev.filter(title => title !== sectionTitle) 
        : [...prev, sectionTitle]
    );
  };

  const handleItemClick = (itemId: string) => {
    navigate(`/model/${discipline}/${itemId}`);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'model':
        return <ViewInAr color="primary" />;
      case 'video':
        return <VideoLibrary color="secondary" />;
      case 'quiz':
        return <Quiz color="error" />;
      case 'assignment':
        return <Assignment color="warning" />;
      default:
        return <ViewInAr />;
    }
  };

  const getProgressForDiscipline = () => {
    const allItems: string[] = [];
    disciplineContent[discipline]?.forEach(section => {
      section.items.forEach(item => {
        allItems.push(item.id);
      });
    });
    
    const completedCount = allItems.filter(id => completedModels.includes(id)).length;
    const progressPercentage = Math.round((completedCount / allItems.length) * 100);
    
    return {
      completed: completedCount,
      total: allItems.length,
      percentage: progressPercentage
    };
  };

  const progress = getProgressForDiscipline();
  const disciplineTitle = discipline.charAt(0).toUpperCase() + discipline.slice(1);

  return (
    <Box sx={{ 
      height: '100%',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      p: 0
    }}>
      <Box sx={{ 
        p: 3, 
        background: isDarkMode 
          ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)` 
          : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
        color: '#fff',
        mb: 2
      }}>
        <Typography variant="h5" fontWeight="600" gutterBottom>
          {disciplineTitle} Models
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
          Learning Path
        </Typography>
        
        <Typography variant="body2" fontWeight="500" sx={{ mt: 3, mb: 1, display: 'flex', justifyContent: 'space-between' }}>
          <span>Course Progress</span>
          <span>{progress.percentage}%</span>
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={progress.percentage} 
          sx={{ 
            mb: 1.5, 
            height: 8, 
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.2)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#fff',
            }
          }} 
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle sx={{ fontSize: 16, mr: 0.5 }} />
            <span>{progress.completed} Completed</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.7)' }}>
            <InfoOutlined sx={{ fontSize: 16, mr: 0.5 }} />
            <span>{progress.total} Total</span>
          </Box>
        </Box>
      </Box>

      <List component="nav" sx={{ px: 2, flexGrow: 1 }}>
        {disciplineContent[discipline]?.map((section) => {
          const isExpanded = expandedSections.includes(section.title);
          
          return (
            <React.Fragment key={section.title}>
              <ListItemButton 
                onClick={() => handleSectionClick(section.title)}
                sx={{ 
                  mb: 0.5, 
                  borderRadius: 2,
                  bgcolor: isExpanded 
                    ? (isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)') 
                    : 'transparent'
                }}
              >
                <ListItemText 
                  primary={section.title} 
                  primaryTypographyProps={{ 
                    fontWeight: 600, 
                    variant: 'subtitle1' 
                  }}
                />
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {section.items.map((item) => {
                    const isActive = item.id === modelId;
                    const completed = completedModels.includes(item.id);
                    
                    return (
                      <ListItemButton
                        key={item.id}
                        sx={{ 
                          pl: 4, 
                          borderRadius: 2,
                          mb: 0.5,
                          backgroundColor: isActive 
                            ? (isDarkMode ? 'rgba(25, 118, 210, 0.2)' : 'rgba(25, 118, 210, 0.08)')
                            : 'transparent',
                          '&:hover': {
                            backgroundColor: isActive 
                              ? (isDarkMode ? 'rgba(25, 118, 210, 0.3)' : 'rgba(25, 118, 210, 0.12)')
                              : (isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)')
                          }
                        }}
                        onClick={() => handleItemClick(item.id)}
                      >
                        <ListItemIcon>
                          <Badge 
                            color="success" 
                            variant="dot" 
                            invisible={!completed || isActive}
                            sx={{ '& .MuiBadge-badge': { top: 4, right: 4 } }}
                          >
                            {getIconForType(item.type)}
                          </Badge>
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.title}
                          secondary={item.duration}
                          primaryTypographyProps={{ 
                            color: isActive ? 'primary' : 'inherit',
                            fontWeight: isActive ? 600 : 400,
                          }}
                          secondaryTypographyProps={{
                            sx: { 
                              display: 'flex', 
                              alignItems: 'center',
                              fontSize: 12
                            }
                          }}
                        />
                        {completed && <CheckCircle color="success" fontSize="small" />}
                        {item.id === 'components-assignment' && <LockOutlined fontSize="small" color="action" />}
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

export default LearningModelSidebar; 