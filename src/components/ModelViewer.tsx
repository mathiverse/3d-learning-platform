import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// Fix imports for OrbitControls and GLTFLoader
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  IconButton, 
  useTheme, 
  // CircularProgress, 
  Button,
  Tooltip,
  Fade,
  Chip,
  Divider,
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RestartAlt, 
  Close,
  Info,
  Fullscreen,
  GridOn,
  PhotoCamera,
  FullscreenExit,
  ViewInAr
} from '@mui/icons-material';
import DisciplineBackground from './DisciplineBackground';
import LearningModelSidebar from './LearningModelSidebar';
import CustomTooltip from './CustomTooltip';

// Define a proper type for model configurations
interface ModelConfig {
  url: string;
  title: string;
  description: string;
}

interface ModelConfigsByDiscipline {
  [discipline: string]: {
    [modelId: string]: ModelConfig;
  };
}

// Assuming modelConfigs is defined somewhere or should be defined here
const modelConfigs: ModelConfigsByDiscipline = {
  mechanical: {
    intro: { 
      url: '/models/mechanical/gear.glb',
      title: 'Introduction to Mechanical Engineering',
      description: 'Explore the fundamental components of mechanical systems.'
    },
    'gear-system': {
      url: '/models/mechanical/gear-system.glb',
      title: 'Gear Systems',
      description: 'Learn about different types of gears and their applications.'
    },
    'lever-mechanism': {
      url: '/models/mechanical/lever.glb',
      title: 'Lever Mechanisms',
      description: 'Understand the principles of levers and mechanical advantage.'
    }
  },
  civil: {
    intro: { 
      url: '/models/civil/beam.glb',
      title: 'Introduction to Civil Engineering',
      description: 'Explore structural elements and building systems.'
    },
    'beam-types': {
      url: '/models/civil/beam-types.glb',
      title: 'Types of Beams',
      description: 'Learn about different beam configurations and load distributions.'
    }
  },
  electrical: {
    intro: { 
      url: '/models/electrical/circuit.glb',
      title: 'Introduction to Electrical Engineering',
      description: 'Explore electrical components and circuit designs.'
    },
    'resistors': {
      url: '/models/electrical/resistors.glb',
      title: 'Resistor Types',
      description: 'Learn about different resistors and their applications in circuits.'
    }
  }
};

// Mock OrbitControls and GLTFLoader for now
class OrbitControls {
  constructor(camera: THREE.Camera, domElement: HTMLElement) {
    this.object = camera;
    this.domElement = domElement;
  }
  object: THREE.Camera;
  domElement: HTMLElement;
  autoRotate = false;
  autoRotateSpeed = 1.0;
  enableDamping = true;
  dampingFactor = 0.05;
  enablePan = true;
  enableZoom = true;
  update() {}
}

class GLTFLoader {
  load(url: string, onLoad: (gltf: any) => void) {
    // Mock implementation
    console.log(`Loading model from ${url}`);
    
    // Create a simple cube as a placeholder
    const scene = new THREE.Scene();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // Call onLoad with our mock GLTF object
    onLoad({ scene });
  }
}

/**
 * Component for rendering and interacting with 3D models
 * @returns React component for 3D model viewing
 */
const ModelViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const { discipline = 'mechanical', modelId = 'intro' } = useParams<{ discipline: string; modelId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [_isLoading, setIsLoading] = useState(true);
  const [infoCardVisible, setInfoCardVisible] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [screenshotDialogOpen, setScreenshotDialogOpen] = useState(false);
  const [screenshotURL, setScreenshotURL] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWireframe, setIsWireframe] = useState(true);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Fixed zoom handlers
  const handleZoomIn = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object as THREE.PerspectiveCamera;
      camera.position.multiplyScalar(0.9); // Move camera closer to target
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object as THREE.PerspectiveCamera;
      camera.position.multiplyScalar(1.1); // Move camera away from target
      controlsRef.current.update();
    }
  };

  const handleReset = () => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(5, 5, 5);
      cameraRef.current.lookAt(0, 0, 0);
      controlsRef.current.update();
    }
  };

  // Screenshot functionality
  const handleScreenshot = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    
    try {
      // Pause autorotation if enabled
      if (controlsRef.current) {
        const autoRotateWasEnabled = controlsRef.current.autoRotate;
        controlsRef.current.autoRotate = false;
        
        // Render one frame to make sure we get the latest view
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        
        // Capture screenshot
        const dataURL = rendererRef.current.domElement.toDataURL('image/png');
        setScreenshotURL(dataURL);
        setScreenshotDialogOpen(true);
        
        // Restore autorotation
        if (controlsRef.current) {
          controlsRef.current.autoRotate = autoRotateWasEnabled;
        }
      }
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      alert('Failed to capture screenshot. Please try again.');
    }
  };

  // Download screenshot
  const downloadScreenshot = () => {
    if (!screenshotURL) return;
    
    const a = document.createElement('a');
    a.href = screenshotURL;
    a.download = `${discipline}-${modelId}-screenshot.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setScreenshotDialogOpen(false);
  };

  const toggleFullscreen = () => {
    if (!mountRef.current) return;
    
    if (!document.fullscreenElement) {
      mountRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
        
        // Very important - force controls to be visible in fullscreen mode
        setControlsVisible(true);
        
        // Force a re-render after fullscreen change
        setTimeout(() => {
          if (rendererRef.current && sceneRef.current && cameraRef.current) {
            // Re-render scene
            rendererRef.current.render(sceneRef.current, cameraRef.current);
            
            // Force additional UI updates
            setControlsVisible(true);
          }
        }, 300); // Longer delay to ensure fullscreen transition completes
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        // Brief delay to ensure UI updates correctly
        setTimeout(() => setControlsVisible(true), 100);
      }).catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  };

  // Ensure the wireframe toggle works correctly
  const toggleWireframe = () => {
    if (!sceneRef.current) return;
    
    const newWireframeState = !isWireframe;
    
    sceneRef.current.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        // Make sure we're handling material as a THREE.Material
        if (Array.isArray(object.material)) {
          // Handle multi-material objects
          object.material.forEach(mat => {
            if (mat instanceof THREE.MeshBasicMaterial || 
                mat instanceof THREE.MeshStandardMaterial || 
                mat instanceof THREE.MeshPhongMaterial) {
              mat.wireframe = newWireframeState;
            }
          });
        } else if (object.material instanceof THREE.MeshBasicMaterial || 
                  object.material instanceof THREE.MeshStandardMaterial || 
                  object.material instanceof THREE.MeshPhongMaterial) {
          // Handle single material objects with specific material types that support wireframe
          object.material.wireframe = newWireframeState;
        }
      }
    });
    
    setIsWireframe(newWireframeState);
  };

  // THREE.js setup
  useEffect(() => {
    if (!mountRef.current) return;
    
    setIsLoading(true);
    const { clientWidth: width, clientHeight: height } = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDarkMode ? 0x121212 : 0xf5f5f5);
    sceneRef.current = scene;
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(5, 5, 5);
    cameraRef.current = camera;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMappingExposure = 1.0;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;
    controlsRef.current = controls;
    
    // Load model
    const modelUrl = modelConfigs[discipline]?.[modelId]?.url;
    
    if (modelUrl) {
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf: any) => {
          if (sceneRef.current) {
            const model = gltf.scene;
            
            // Center the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            
            // Apply wireframe if needed
            if (isWireframe) {
              model.traverse((object: THREE.Object3D) => {
                if (object instanceof THREE.Mesh) {
                  if (Array.isArray(object.material)) {
                    object.material.forEach(mat => {
                      if (mat instanceof THREE.MeshBasicMaterial || 
                          mat instanceof THREE.MeshStandardMaterial || 
                          mat instanceof THREE.MeshPhongMaterial) {
                        mat.wireframe = true;
                      }
                    });
                  } else if (object.material instanceof THREE.MeshBasicMaterial || 
                            object.material instanceof THREE.MeshStandardMaterial || 
                            object.material instanceof THREE.MeshPhongMaterial) {
                    object.material.wireframe = true;
                  }
                }
              });
            }
            
            sceneRef.current.add(model);
            setIsLoading(false);
          }
        }
      );
    } else {
      // If no model URL is provided, load fallback geometry
      const geometry = getFallbackGeometry(discipline);
      const material = new THREE.MeshStandardMaterial({ 
        color: isDarkMode ? 0x2196f3 : 0x3f51b5,
        roughness: 0.7,
        metalness: 0.2
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      setIsLoading(false);
    }
    
    // Animation/render loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controls) {
        controls.update();
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const { clientWidth, clientHeight } = mountRef.current;
      
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(clientWidth, clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
    };
  }, [discipline, modelId, isDarkMode, isWireframe]);

  // Show/hide controls on mouse move
  useEffect(() => {
    const handleMouseMove = () => {
      setControlsVisible(true);
      clearTimeout(Timer.current);
      
      Timer.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000); // Hide after 3 seconds of inactivity
    };
    
    const Timer = { current: setTimeout(() => {}, 0) };
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(Timer.current);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'f':
          toggleFullscreen();
          break;
        case 's':
          handleScreenshot();
          break;
        case 'r':
          handleReset();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen().then(() => {
              setIsFullscreen(false);
            }).catch(console.error);
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Add fullscreen change event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      
      // Force controls to be visible when fullscreen state changes
      if (document.fullscreenElement) {
        setControlsVisible(true);
      } else {
        // Small delay when exiting fullscreen to allow transition to complete
        setTimeout(() => setControlsVisible(true), 100);
      }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  function getFallbackGeometry(discipline: string) {
    switch (discipline) {
      case 'mechanical':
        // Gear-like geometry
        return new THREE.TorusGeometry(2, 0.5, 16, 50);
      case 'civil':
        // Beam-like geometry
        return new THREE.BoxGeometry(5, 0.5, 0.5);
      case 'electrical':
        // Circuit-like geometry
        return new THREE.SphereGeometry(2, 32, 32);
      default:
        return new THREE.SphereGeometry(2, 32, 32);
    }
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      position: 'relative', 
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.default,
    }}>
      <DisciplineBackground discipline={discipline} />
      
      {/* Absolutely positioned sidebar toggle button - ALWAYS visible */}
      <IconButton
        onClick={() => setSidebarOpen(!sidebarOpen)}
        sx={{
          position: 'absolute',
          top: '50%',
          left: sidebarOpen ? '260px' : '10px', // Position relative to viewport
          transform: 'translateY(-50%)',
          backgroundColor: isDarkMode ? 'rgba(66, 66, 66, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 1000, // Very high z-index to be above everything
          '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(97, 97, 97, 0.95)' : 'rgba(238, 238, 238, 0.95)',
          },
          transition: 'left 0.3s ease-in-out'
        }}
      >
        {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
      </IconButton>
      
      {/* Sidebar container - make width exactly 0 when closed to prevent space */}
      <Box 
        sx={{ 
          width: sidebarOpen ? (isMobile ? '100%' : '280px') : '0',
          height: '100%',
          transition: 'width 0.3s ease-in-out',
          position: isMobile && sidebarOpen ? 'absolute' : 'relative', // Absolute on mobile when open
          zIndex: isMobile && sidebarOpen ? 1000 : 20, // Higher z-index on mobile
          borderRight: sidebarOpen ? `1px solid ${theme.palette.divider}` : 'none',
          bgcolor: isDarkMode ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: sidebarOpen ? (isDarkMode ? '5px 0 15px rgba(0,0,0,0.2)' : '5px 0 15px rgba(0,0,0,0.1)') : 'none',
          overflow: 'hidden'
        }}
      >
        {sidebarOpen && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, height: '100%', zIndex: 10 }}>
            <LearningModelSidebar 
              onClose={() => setSidebarOpen(false)} 
            />
          </Box>
        )}
      </Box>
      
      {/* If sidebar open on mobile, add an overlay to close it on click */}
      {isMobile && sidebarOpen && (
        <Box
          onClick={() => setSidebarOpen(false)}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999, // Just below the sidebar
          }}
        />
      )}
      
      {/* 3D Viewer container */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Model container */}
        <Box 
          ref={mountRef} 
          sx={{ 
            width: '100%', 
            height: '100%' 
          }}
        />
        
        {/* Fullscreen mode fix - ensure controls remain visible */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5,
            pointerEvents: 'none', // This allows clicking through to the canvas
            '& > *': {
              pointerEvents: 'auto' // But UI elements are still clickable
            }
          }}
        >
          {/* Ensure floating controls are visible in fullscreen */}
          <Fade in={controlsVisible && !isFullscreen}>
            <Paper
              elevation={3}
              sx={{
                position: 'absolute',
                bottom: { xs: '1rem', sm: '2rem' }, // Smaller margin on mobile
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: { xs: 0.5, sm: 1 }, // Tighter spacing on mobile
                p: { xs: 0.5, sm: 1 }, // Smaller padding on mobile
                borderRadius: 4,
                backgroundColor: isDarkMode ? 'rgba(42, 42, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                zIndex: 100,
                maxWidth: '95vw', // Prevent overflow on small screens
                overflow: 'auto' // Allow scrolling if needed
              }}
            >
              {/* Control buttons with tooltips */}
              <Tooltip 
                title="Zoom In"
                placement="top"
                arrow
                leaveDelay={200}
                enterDelay={500}
                PopperProps={{
                  disablePortal: true,
                  sx: { 
                    zIndex: 10000
                  }
                }}
              >
                <IconButton onClick={handleZoomIn} size={isSmallScreen ? "small" : "medium"} 
                  sx={{ p: isSmallScreen ? 0.5 : 1 }}>
                  <ZoomIn fontSize={isSmallScreen ? "small" : "medium"} />
                </IconButton>
              </Tooltip>
              <Tooltip 
                title="Zoom Out"
                placement="top"
                arrow
                leaveDelay={200}
                enterDelay={500}
                PopperProps={{
                  disablePortal: true,
                  sx: { 
                    zIndex: 10000
                  }
                }}
              >
                <IconButton onClick={handleZoomOut} size={isSmallScreen ? "small" : "medium"} 
                  sx={{ p: isSmallScreen ? 0.5 : 1 }}>
                  <ZoomOut fontSize={isSmallScreen ? "small" : "medium"} />
                </IconButton>
              </Tooltip>
              <Tooltip 
                title="Reset View"
                placement="top"
                arrow
                leaveDelay={200}
                enterDelay={500}
                PopperProps={{
                  disablePortal: true,
                  sx: { 
                    zIndex: 10000
                  }
                }}
              >
                <IconButton onClick={handleReset} size={isSmallScreen ? "small" : "medium"} 
                  sx={{ p: isSmallScreen ? 0.5 : 1 }}>
                  <RestartAlt fontSize={isSmallScreen ? "small" : "medium"} />
                </IconButton>
              </Tooltip>
              
              {/* Add wireframe toggle button */}
              <CustomTooltip title={isWireframe ? "Solid View" : "Wireframe View"}>
                <IconButton onClick={toggleWireframe} size={isSmallScreen ? "small" : "medium"} 
                  sx={{ p: isSmallScreen ? 0.5 : 1 }}>
                  {isWireframe ? <ViewInAr fontSize={isSmallScreen ? "small" : "medium"} /> : <GridOn fontSize={isSmallScreen ? "small" : "medium"} />}
                </IconButton>
              </CustomTooltip>
              
              {/* Ensure screenshot button is visible */}
              <Tooltip 
                title="Take Screenshot"
                placement="top"
                arrow
                leaveDelay={200}
                enterDelay={500}
                PopperProps={{
                  disablePortal: true,
                  sx: { 
                    zIndex: 10000
                  }
                }}
              >
                <IconButton onClick={handleScreenshot} size={isSmallScreen ? "small" : "medium"} 
                  sx={{ p: isSmallScreen ? 0.5 : 1 }}>
                  <PhotoCamera fontSize={isSmallScreen ? "small" : "medium"} />
                </IconButton>
              </Tooltip>
              
              <Tooltip 
                title="Fullscreen"
                placement="top"
                arrow
                leaveDelay={200}
                enterDelay={500}
                PopperProps={{
                  disablePortal: true,
                  sx: { 
                    zIndex: 10000
                  }
                }}
              >
                <IconButton onClick={toggleFullscreen} size={isSmallScreen ? "small" : "medium"} 
                  sx={{ p: isSmallScreen ? 0.5 : 1 }}>
                  {isFullscreen ? <FullscreenExit fontSize={isSmallScreen ? "small" : "medium"} /> : <Fullscreen fontSize={isSmallScreen ? "small" : "medium"} />}
                </IconButton>
              </Tooltip>
            </Paper>
          </Fade>
          
          {/* Model info card with improved styling for fullscreen */}
          {infoCardVisible && (
            <Paper
              elevation={4}
              sx={{
                position: 'absolute',
                top: '1rem',
                left: sidebarOpen ? (isMobile ? '1rem' : 'calc(280px + 1rem)') : '1rem',
                transition: 'left 0.3s ease-in-out',
                maxWidth: { xs: 'calc(100% - 2rem)', sm: '350px' }, // Full width on mobile with margins
                width: { xs: 'calc(100% - 2rem)', sm: 'auto' }, // Full width on mobile
                zIndex: 90,
                borderRadius: 2,
                overflow: 'hidden',
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                boxShadow: isDarkMode 
                  ? '0 8px 32px rgba(0,0,0,0.4)' 
                  : '0 8px 32px rgba(0,0,0,0.1)'
              }}
            >
              <Box sx={{ 
                p: 2,
                background: isDarkMode 
                  ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.4) 0%, rgba(21, 101, 192, 0.3) 100%)' 
                  : 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(21, 101, 192, 0.05) 100%)',
                borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography 
                    variant="h5" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: theme.palette.primary.main,
                    }}
                  >
                    {modelConfigs[discipline as keyof typeof modelConfigs]?.[modelId]?.title || 
                     `${discipline.charAt(0).toUpperCase() + discipline.slice(1)} Model`}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => setInfoCardVisible(false)}
                    sx={{ 
                      mt: -1, 
                      mr: -1,
                      p: 1,
                      borderRadius: '50%',
                      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.8)',
                      '&:hover': {
                        backgroundColor: isDarkMode 
                          ? 'rgba(0, 0, 0, 0.4)' 
                          : 'rgba(0, 0, 0, 0.1)'
                      } 
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {modelConfigs[discipline as keyof typeof modelConfigs]?.[modelId]?.description || 
                   'Explore this interactive 3D model to learn more about its components and functionality.'}
                </Typography>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                  <Chip 
                    label="Interactive" 
                    size="small" 
                    color="primary" 
                    variant={isDarkMode ? "filled" : "outlined"}
                  />
                  <Chip 
                    label="3D Model" 
                    size="small" 
                    color="secondary" 
                    variant={isDarkMode ? "filled" : "outlined"}
                  />
                  <Chip 
                    label="Educational" 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<PhotoCamera />}
                    size="small"
                    onClick={handleScreenshot}
                    sx={{ flex: 1 }}
                  >
                    Screenshot
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                    size="small"
                    onClick={toggleFullscreen}
                    sx={{ flex: 1 }}
                  >
                    {isFullscreen ? 'Exit' : 'Fullscreen'}
                  </Button>
                </Box>
              </Box>
            </Paper>
          )}
          
          {/* Add a button to show the info card when it's hidden */}
          {!infoCardVisible && (
            <Box sx={{
              position: 'absolute',
              top: '1rem',
              left: sidebarOpen ? 'calc(280px + 1rem)' : '1rem',
              display: 'flex',
              gap: 1,
              transition: 'left 0.3s ease-in-out',
              zIndex: 90
            }}>
              <IconButton
                onClick={() => setInfoCardVisible(true)}
                sx={{
                  backgroundColor: isDarkMode ? 'rgba(42, 42, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(60, 60, 60, 0.95)' : 'rgba(240, 240, 240, 0.95)'
                  }
                }}
              >
                <Info />
              </IconButton>

              <IconButton
                onClick={handleScreenshot}
                sx={{
                  backgroundColor: isDarkMode ? 'rgba(42, 42, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(60, 60, 60, 0.95)' : 'rgba(240, 240, 240, 0.95)'
                  }
                }}
              >
                <PhotoCamera />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>

      {/* Screenshot Dialog with improved styling */}
      <Dialog 
        open={screenshotDialogOpen} 
        onClose={() => setScreenshotDialogOpen(false)}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: isDarkMode 
            ? 'rgba(30, 30, 30, 0.8)' 
            : 'rgba(245, 245, 245, 0.8)',
          p: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PhotoCamera sx={{ mr: 1.5, color: theme.palette.primary.main }} />
            <Typography variant="h6">Model Screenshot</Typography>
          </Box>
          <IconButton
            onClick={() => setScreenshotDialogOpen(false)}
            sx={{ 
              borderRadius: '50%',
              bgcolor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
              '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'
              }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, bgcolor: '#000' }}>
          {screenshotURL && (
            <Box
              component="img"
              src={screenshotURL}
              alt="Model Screenshot"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '70vh',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ 
          p: 2, 
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: isDarkMode 
            ? 'rgba(30, 30, 30, 0.8)' 
            : 'rgba(245, 245, 245, 0.8)',
        }}>
          <Button 
            onClick={() => setScreenshotDialogOpen(false)} 
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={downloadScreenshot} 
            variant="contained" 
            color="primary"
            startIcon={<PhotoCamera />}
          >
            Download Image
          </Button>
        </DialogActions>
      </Dialog>

      {/* Also, modify the fullscreen event handler to ensure controls visibility */}
      <Box
        sx={{
          position: 'fixed', // Keep fixed position
          bottom: '2rem',
          left: '50%', // Center horizontally 
          transform: 'translateX(-50%)', // Center transform
          zIndex: 9999, // Very high z-index
          display: isFullscreen ? 'flex' : 'none', // Only show in fullscreen mode
          gap: 1,
          p: 1,
          borderRadius: 4,
          backgroundColor: isDarkMode ? 'rgba(42, 42, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)', // More opaque
          backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)' // Stronger shadow for visibility
        }}
      >
        {/* Use CustomTooltip for all buttons */}
        <CustomTooltip title="Exit Fullscreen">
          <IconButton onClick={toggleFullscreen} size={isSmallScreen ? "small" : "medium"}>
            <FullscreenExit />
          </IconButton>
        </CustomTooltip>
        
        {/* Other buttons with CustomTooltip */}
        <CustomTooltip title="Zoom In">
          <IconButton onClick={handleZoomIn} size={isSmallScreen ? "small" : "medium"}>
            <ZoomIn />
          </IconButton>
        </CustomTooltip>
        
        <CustomTooltip title="Zoom Out">
          <IconButton onClick={handleZoomOut} size={isSmallScreen ? "small" : "medium"}>
            <ZoomOut />
          </IconButton>
        </CustomTooltip>
        
        <CustomTooltip title="Reset View">
          <IconButton onClick={handleReset} size={isSmallScreen ? "small" : "medium"}>
            <RestartAlt />
          </IconButton>
        </CustomTooltip>
        
        <CustomTooltip title={isWireframe ? "Solid View" : "Wireframe View"}>
          <IconButton onClick={toggleWireframe} size={isSmallScreen ? "small" : "medium"}>
            {isWireframe ? <ViewInAr fontSize={isSmallScreen ? "small" : "medium"} /> : <GridOn fontSize={isSmallScreen ? "small" : "medium"} />}
          </IconButton>
        </CustomTooltip>
        
        <CustomTooltip title="Take Screenshot">
          <IconButton onClick={handleScreenshot} size={isSmallScreen ? "small" : "medium"}>
            <PhotoCamera />
          </IconButton>
        </CustomTooltip>
      </Box>
    </Box>
  );
};

export default ModelViewer; 