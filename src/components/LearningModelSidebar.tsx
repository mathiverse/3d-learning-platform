import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import {
  ChevronLeft,
  ExpandLess,
  ExpandMore,
  ViewInAr,
  Quiz,
  VideoLibrary,
  Assignment
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

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
  const navigate = useNavigate();
  const { discipline = 'mechanical' } = useParams<{ discipline: string }>();
  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);

  const handleSectionClick = (sectionTitle: string) => {
    setExpandedSection(expandedSection === sectionTitle ? null : sectionTitle);
  };

  const handleItemClick = (itemId: string) => {
    navigate(`/model/${discipline}/${itemId}`);
    onClose();
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

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: 320,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 320,
          boxSizing: 'border-box',
          mt: '64px', // Height of AppBar
          backgroundColor: theme.palette.background.default,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: 'space-between' }}>
        <Typography variant="h6" color="primary">
          Learning Content
        </Typography>
        <IconButton onClick={onClose}>
          <ChevronLeft />
        </IconButton>
      </Box>

      <List component="nav">
        {disciplineContent[discipline]?.map((section) => (
          <React.Fragment key={section.title}>
            <ListItemButton onClick={() => handleSectionClick(section.title)}>
              <ListItemText 
                primary={section.title} 
                sx={{ color: theme.palette.text.primary }}
              />
              {expandedSection === section.title ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={expandedSection === section.title} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {section.items.map((item) => (
                  <ListItemButton
                    key={item.id}
                    sx={{ pl: 4 }}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <ListItemIcon>
                      {getIconForType(item.type)}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.title}
                      secondary={item.duration}
                      sx={{ color: theme.palette.text.secondary }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default LearningModelSidebar; 