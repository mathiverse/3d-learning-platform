import React, { useState } from 'react';
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
  Avatar,
  Tab,
  Tabs,
  TextField
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
  Lightbulb,
  InfoOutlined,
  AutoAwesome,
  Engineering,
  NoteAlt,
  Link,
  BarChart
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ModelInfo {
  id: string;
  title: string;
  description: string;
  keyFeatures: string[];
  applications: string[];
  principles: ModelPrinciple[];
  components: ModelComponent[];
  funFacts: string[];
  relatedModels: RelatedModel[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface ModelComponent {
  id: string;
  name: string;
  description: string;
  highlightId?: string;
}

interface ModelPrinciple {
  title: string;
  description: string;
  equation?: string;
}

interface RelatedModel {
  id: string;
  name: string;
  discipline: string;
  thumbnail?: string;
}

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

// Model info data for educational content
const modelInfoData: Record<string, Record<string, ModelInfo>> = {
  mechanical: {
    'v8-engine': {
      id: 'v8-engine',
      title: 'V8 Engine',
      description: 'A V8 engine is an eight-cylinder piston engine in which the cylinders share a common crankshaft and are arranged in a V configuration. This design offers a good balance of power, compactness, and smoothness.',
      difficulty: 'intermediate',
      keyFeatures: [
        'Eight cylinders arranged in V-configuration',
        'Higher power-to-weight ratio than inline engines',
        'Typical displacement of 3.5 to 6.2 liters',
        'Common in high-performance vehicles and trucks',
        'Dual overhead camshafts for efficient valve control'
      ],
      applications: [
        'Sports cars and high-performance vehicles',
        'Luxury automobiles',
        'Light trucks and SUVs',
        'Some marine applications',
        'Certain aircraft engines (modified versions)'
      ],
      principles: [
        {
          title: 'Internal Combustion',
          description: 'Converts fuel energy into mechanical energy through controlled explosions within the cylinders.',
          equation: 'P = (T × 2π × N) / 60'
        },
        {
          title: 'Four-Stroke Cycle',
          description: 'The engine operates on a four-stroke cycle: intake, compression, power, and exhaust.'
        },
        {
          title: 'Thermodynamic Efficiency',
          description: 'The theoretical efficiency of an Otto cycle engine depends on the compression ratio.',
          equation: 'η = 1 - (1/r^(γ-1))'
        }
      ],
      components: [
        {
          id: 'engine-block',
          name: 'Engine Block',
          description: 'The main structure that houses the cylinders and supports the crankshaft.',
          highlightId: 'block'
        },
        {
          id: 'pistons',
          name: 'Pistons',
          description: 'Cylindrical components that move up and down within the cylinders, transferring force from combustion to the crankshaft.',
          highlightId: 'pistons'
        },
        {
          id: 'crankshaft',
          name: 'Crankshaft',
          description: 'Converts the reciprocating motion of the pistons into rotational motion.',
          highlightId: 'crankshaft'
        },
        {
          id: 'camshafts',
          name: 'Camshafts',
          description: 'Control the opening and closing of the intake and exhaust valves.',
          highlightId: 'camshafts'
        }
      ],
      funFacts: [
        'The first V8 engine was developed by Léon Levavasseur in 1902.',
        'The Ford Flathead V8, introduced in 1932, was the first affordable V8 engine.',
        'V8 engines typically produce a distinctive burbling sound due to their firing order.',
        'Modern V8s can use cylinder deactivation to improve fuel efficiency.',
        'The most powerful production V8 engines can produce over 700 horsepower.'
      ],
      relatedModels: [
        {
          id: 'four-stroke',
          name: 'Four-Stroke Engine Cycle',
          discipline: 'mechanical',
          thumbnail: '/images/four-stroke-thumb.jpg'
        },
        {
          id: 'transmission',
          name: 'Automatic Transmission',
          discipline: 'mechanical',
          thumbnail: '/images/transmission-thumb.jpg'
        }
      ]
    }
  },
  civil: {
    'truss-bridge': {
      id: 'truss-bridge',
      title: 'Truss Bridge',
      description: 'A truss bridge is a structure that uses connected elements forming triangular units to distribute load forces efficiently. These bridges can span longer distances than simple beam bridges and use materials economically.',
      difficulty: 'intermediate',
      keyFeatures: [
        'Triangular structural units for optimal force distribution',
        'Efficient use of materials with high strength-to-weight ratio',
        'Various configurations: Pratt, Warren, Howe, and K-truss designs',
        'Can span medium to long distances (40-500m)',
        'Primarily resist forces through tension and compression'
      ],
      applications: [
        'Railway bridges',
        'Highway and road overpasses',
        'Pedestrian crossings',
        'Industrial facilities',
        'Temporary military bridges'
      ],
      principles: [
        {
          title: 'Static Equilibrium',
          description: 'All forces acting on the structure must balance for stability.',
          equation: 'ΣF = 0, ΣM = 0'
        },
        {
          title: 'Method of Joints',
          description: 'Analytical technique to determine forces in truss members by analyzing force equilibrium at joints.'
        },
        {
          title: 'Structural Efficiency',
          description: 'Triangular forms create inherently stable structures that efficiently distribute loads.'
        }
      ],
      components: [
        {
          id: 'chord-members',
          name: 'Chord Members',
          description: 'The top and bottom horizontal members that form the main structure of the truss.',
          highlightId: 'chords'
        },
        {
          id: 'vertical-members',
          name: 'Vertical Members',
          description: 'Upright elements connecting top and bottom chords, often under compression.',
          highlightId: 'verticals'
        },
        {
          id: 'diagonal-members',
          name: 'Diagonal Members',
          description: 'Slanted elements that provide triangulation and transfer loads between chords.',
          highlightId: 'diagonals'
        },
        {
          id: 'connections',
          name: 'Connections',
          description: 'Joints where members meet, typically bolted, riveted, or welded together.',
          highlightId: 'joints'
        }
      ],
      funFacts: [
        'The first iron truss bridge was built in 1755 by Ulrich Grubenmann in Switzerland.',
        'The Ikitsuki Bridge in Japan is the world\'s longest continuous truss bridge span at 400 meters.',
        'During the 19th century, over 10,000 truss bridges were built in the United States.',
        'The Quebec Bridge collapse in 1907 led to significant advances in structural engineering.',
        'Many historic truss bridges are still in service after more than 100 years.'
      ],
      relatedModels: [
        {
          id: 'arch-bridge',
          name: 'Arch Bridge',
          discipline: 'civil',
          thumbnail: '/images/arch-bridge-thumb.jpg'
        },
        {
          id: 'suspension-bridge',
          name: 'Suspension Bridge',
          discipline: 'civil',
          thumbnail: '/images/suspension-bridge-thumb.jpg'
        }
      ]
    }
  },
  electrical: {
    'transformer': {
      id: 'transformer',
      title: 'Power Transformer',
      description: 'A power transformer is a static electrical device that transfers electrical energy between circuits through electromagnetic induction. It is fundamental to electrical power distribution and enables voltage level changes for efficient transmission.',
      difficulty: 'intermediate',
      keyFeatures: [
        'No moving parts (static device)',
        'Uses electromagnetic induction to transfer energy',
        'Changes voltage levels while maintaining power (VA)',
        'Consists of primary and secondary windings around a core',
        'Operates on alternating current (AC) only'
      ],
      applications: [
        'Power generation plants for step-up transmission',
        'Electrical substations for voltage regulation',
        'Distribution networks for residential/commercial supply',
        'Industrial facilities for equipment power supply',
        'Electronic devices for voltage conversion'
      ],
      principles: [
        {
          title: 'Electromagnetic Induction',
          description: 'A changing magnetic field induces an electromotive force (voltage) in a conductor.',
          equation: 'V₁/V₂ = N₁/N₂'
        },
        {
          title: 'Mutual Inductance',
          description: 'Current in one coil produces a magnetic field that induces voltage in another coil.'
        },
        {
          title: 'Conservation of Energy',
          description: 'Power input equals power output plus losses.',
          equation: 'P₁ = P₂ + Losses'
        }
      ],
      components: [
        {
          id: 'core',
          name: 'Magnetic Core',
          description: 'Provides a path for magnetic flux, usually made of laminated silicon steel sheets.',
          highlightId: 'core'
        },
        {
          id: 'primary-winding',
          name: 'Primary Winding',
          description: 'The input coil that receives electrical energy and creates a magnetic field.',
          highlightId: 'primary'
        },
        {
          id: 'secondary-winding',
          name: 'Secondary Winding',
          description: 'The output coil where voltage is induced by the changing magnetic field.',
          highlightId: 'secondary'
        },
        {
          id: 'insulation',
          name: 'Insulation System',
          description: 'Materials that prevent electrical contact between windings and core.',
          highlightId: 'insulation'
        }
      ],
      funFacts: [
        'The first practical transformer was invented by William Stanley in 1885.',
        'Modern power transformers can be over 98% efficient.',
        'The largest power transformers can weigh over 400 tons.',
        'Some transformers are immersed in oil for cooling and insulation.',
        'Transformers make humming sounds due to magnetostriction in the core.'
      ],
      relatedModels: [
        {
          id: 'electric-motor',
          name: 'Electric Motor',
          discipline: 'electrical',
          thumbnail: '/images/motor-thumb.jpg'
        },
        {
          id: 'circuit-board',
          name: 'Circuit Board',
          discipline: 'electrical',
          thumbnail: '/images/pcb-thumb.jpg'
        }
      ]
    }
  }
};

interface LearningModelSidebarProps {
  onClose: () => void;
  discipline?: string;
  modelId?: string;
  onHighlightComponent?: (componentId: string | null) => void;
}

const LearningModelSidebar: React.FC<LearningModelSidebarProps> = ({ 
  onClose, 
  discipline = 'mechanical',
  modelId = 'v8-engine',
  onHighlightComponent 
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [userNotes, setUserNotes] = useState<string>('');
  const [highlightedComponent, setHighlightedComponent] = useState<string | null>(null);
  const [explorationMode, setExplorationMode] = useState<boolean>(false);

  // Get model info based on discipline and modelId
  const getModelInfo = (): ModelInfo | undefined => {
    if (modelInfoData[discipline] && modelInfoData[discipline][modelId]) {
      return modelInfoData[discipline][modelId];
    }
    
    // Fallback to first available model
    const firstModel = Object.keys(modelInfoData[discipline] || {})[0];
    return modelInfoData[discipline]?.[firstModel];
  };
  
  const modelInfo = getModelInfo();

  // Get sections based on discipline (for backward compatibility)
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

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleComponentClick = (componentId: string) => {
    const newHighlightedId = highlightedComponent === componentId ? null : componentId;
    setHighlightedComponent(newHighlightedId);
    if (onHighlightComponent) {
      const highlightId = newHighlightedId === null 
        ? null 
        : modelInfo?.components.find(c => c.id === newHighlightedId)?.highlightId || null;
      onHighlightComponent(highlightId);
    }
  };

  const handleExplorationToggle = () => {
    setExplorationMode(!explorationMode);
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserNotes(event.target.value);
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

  // Fallback if no model info is available
  if (!modelInfo) {
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
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Model Information Unavailable</Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Educational content for this model is under development.
          </Typography>
          <Button variant="outlined" onClick={onClose} sx={{ mt: 3 }}>
            Close
          </Button>
        </Box>
      </Box>
    );
  }
  
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
      {/* Header with title and close button */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: isDarkMode 
            ? 'background.paper' 
            : theme.palette.primary.light,
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Typography variant="h6" fontWeight="600" sx={{ 
            color: isDarkMode ? 'text.primary' : '#fff'
          }}>
            {modelInfo.title}
          </Typography>
          <IconButton size="small" onClick={onClose} sx={{ 
            color: isDarkMode ? 'text.primary' : '#fff'
          }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
        
        <Chip 
          label={modelInfo.difficulty.charAt(0).toUpperCase() + modelInfo.difficulty.slice(1)} 
          size="small"
          sx={{
            mt: 1,
            bgcolor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.8)',
            color: getDifficultyColor(modelInfo.difficulty),
            borderColor: getDifficultyColor(modelInfo.difficulty),
            border: '1px solid',
            fontWeight: 500
          }}
        />
      </Paper>

      {/* Tabs */}
      <Tabs 
        value={currentTab} 
        onChange={handleTabChange} 
        variant="fullWidth"
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          '& .MuiTab-root': {
            minHeight: 48
          }
        }}
      >
        <Tab 
          label="About" 
          icon={<InfoOutlined fontSize="small" />} 
          iconPosition="start"
        />
        <Tab 
          label="Components" 
          icon={<Engineering fontSize="small" />} 
          iconPosition="start"
        />
        <Tab 
          label="Notes" 
          icon={<NoteAlt fontSize="small" />} 
          iconPosition="start"
        />
      </Tabs>

      {/* Content Area */}
      <Box sx={{ 
        overflow: 'auto', 
        flexGrow: 1,
        p: 0,
        maxHeight: 'calc(100vh - 170px)'
      }}>
        {/* About Tab */}
        {currentTab === 0 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="body1" paragraph>
              {modelInfo.description}
            </Typography>
            
            {/* Key Features */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: isDarkMode ? 'background.default' : '#f5f5f5',
                borderRadius: 2
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                color: theme.palette.primary.main
              }}>
                <InfoOutlined fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  Key Features
                </Typography>
              </Box>
              <List dense disablePadding>
                {modelInfo.keyFeatures.map((feature, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={
                        <Typography variant="body2">• {feature}</Typography>
                      } 
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
            
            {/* Applications */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: isDarkMode ? 'background.default' : '#f5f5f5',
                borderRadius: 2
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                color: theme.palette.success.main
              }}>
                <BarChart fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  Applications
                </Typography>
              </Box>
              <List dense disablePadding>
                {modelInfo.applications.map((application, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={
                        <Typography variant="body2">• {application}</Typography>
                      } 
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
            
            {/* Engineering Principles */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: isDarkMode ? 'background.default' : '#f5f5f5',
                borderRadius: 2
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                color: theme.palette.warning.main
              }}>
                <School fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  Engineering Principles
                </Typography>
              </Box>
              {modelInfo.principles.map((principle, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    {principle.title}
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ mt: 0.5 }}>
                    {principle.description}
                  </Typography>
                  {principle.equation && (
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 1, 
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'monospace',
                          fontWeight: 500 
                        }}
                      >
                        {principle.equation}
                      </Typography>
                    </Paper>
                  )}
                </Box>
              ))}
            </Paper>
            
            {/* Fun Facts */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: isDarkMode ? 'background.default' : '#f5f5f5',
                borderRadius: 2
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                color: theme.palette.info.main
              }}>
                <Lightbulb fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  Fun Facts
                </Typography>
              </Box>
              <List dense disablePadding>
                {modelInfo.funFacts.map((fact, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={
                        <Typography variant="body2">• {fact}</Typography>
                      } 
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
            
            {/* Related Models */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: isDarkMode ? 'background.default' : '#f5f5f5',
                borderRadius: 2
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                color: theme.palette.primary.main
              }}>
                <Link fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  Related Models
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1, 
                mt: 1 
              }}>
                {modelInfo.relatedModels.map((relatedModel, index) => (
                  <Chip
                    key={index}
                    label={relatedModel.name}
                    onClick={() => navigate(`/model/${relatedModel.discipline}/${relatedModel.id}`)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: theme.palette.primary.light,
                        color: '#fff'
                      }
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Box>
        )}
        
        {/* Components Tab */}
        {currentTab === 1 && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2 
            }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Model Components
              </Typography>
              <Tooltip title={explorationMode ? "Exit exploration mode" : "Explore the model"}>
                <Button
                  size="small"
                  startIcon={<AutoAwesome fontSize="small" />}
                  onClick={handleExplorationToggle}
                  variant={explorationMode ? "contained" : "outlined"}
                  color={explorationMode ? "secondary" : "primary"}
                >
                  {explorationMode ? "Exit Exploration" : "Start Exploration"}
                </Button>
              </Tooltip>
            </Box>
            
            {explorationMode && (
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Click on any component below to highlight it in the 3D model. Click again to remove the highlight.
              </Typography>
            )}
            
            <List sx={{ pt: 0 }}>
              {modelInfo.components.map((component) => (
                <Paper
                  key={component.id}
                  elevation={0}
                  sx={{
                    mb: 2,
                    overflow: 'hidden',
                    borderRadius: 2,
                    border: highlightedComponent === component.id ? 
                      `2px solid ${theme.palette.primary.main}` : 
                      `1px solid ${theme.palette.divider}`,
                    cursor: explorationMode ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    '&:hover': explorationMode ? {
                      borderColor: theme.palette.primary.main,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    } : {}
                  }}
                  onClick={explorationMode ? () => handleComponentClick(component.id) : undefined}
                >
                  <ListItem sx={{ py: 1.5 }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={500}>
                          {component.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {component.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Box>
        )}
        
        {/* Notes Tab */}
        {currentTab === 2 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Your Notes
            </Typography>
            <TextField
              multiline
              fullWidth
              minRows={8}
              maxRows={15}
              placeholder="Take notes about this model here..."
              value={userNotes}
              onChange={handleNoteChange}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: isDarkMode ? 'background.default' : '#f5f5f5',
                }
              }}
            />
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              mt: 2, 
              gap: 1 
            }}>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => setUserNotes('')}
              >
                Clear
              </Button>
              <Button 
                variant="contained" 
                size="small"
                onClick={() => {
                  // In a real app, we would save the notes to a database
                  alert('Notes saved!');
                }}
              >
                Save Notes
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      
      {/* Footer action buttons */}
      {currentTab === 0 && (
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          gap: 1,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}>
          <Button 
            variant="contained" 
            fullWidth
            startIcon={<AutoAwesome />}
            onClick={handleExplorationToggle}
          >
            Start Interactive Exploration
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default LearningModelSidebar; 