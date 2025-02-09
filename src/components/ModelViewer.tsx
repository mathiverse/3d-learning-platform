import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, IconButton, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import DisciplineBackground from './DisciplineBackground';
import LearningModelSidebar from './LearningModelSidebar';

interface ModelViewerProps {
  modelUrl?: string;
}

/**
 * Component for rendering and interacting with 3D models
 * @param props - Component properties
 * @returns React component for 3D model viewing
 */
const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { discipline, modelId } = useParams<{ discipline: string; modelId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.z = 5;
    controls.update();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [modelUrl]);

  return (
    <>
      <DisciplineBackground discipline={discipline || 'mechanical'} />
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            top: 64, // AppBar height
            height: 'calc(100vh - 64px)',
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
            transition: 'width 0.3s ease',
            width: sidebarOpen ? '320px' : '48px',
            zIndex: 1200,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {sidebarOpen ? (
            <>
              <Box sx={{ flexGrow: 1 }}>
                <LearningModelSidebar 
                  open={sidebarOpen} 
                  onClose={() => setSidebarOpen(false)} 
                />
              </Box>
              <IconButton
                onClick={() => setSidebarOpen(false)}
                sx={{
                  position: 'absolute',
                  right: -20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: '50%',
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ChevronLeft />
              </IconButton>
            </>
          ) : (
            <IconButton
              onClick={() => setSidebarOpen(true)}
              sx={{
                width: '100%',
                height: '48px',
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ChevronRight />
            </IconButton>
          )}
        </Box>
        <Box 
          component="main"
          sx={{ 
            flexGrow: 1, 
            ml: sidebarOpen ? '320px' : '48px',
            transition: 'margin-left 0.3s ease',
          }}
        >
          <div className="model-viewer">
            <Paper 
              elevation={3}
              sx={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                padding: '1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a237e', mb: 2 }}>
                {discipline?.charAt(0).toUpperCase() + discipline?.slice(1)} Engineering
              </Typography>
              <Typography variant="h6" sx={{ color: '#455a64' }}>
                Model: {modelId}
              </Typography>
            </Paper>
            <div ref={mountRef} />
          </div>
        </Box>
      </Box>
    </>
  );
};

export default ModelViewer; 