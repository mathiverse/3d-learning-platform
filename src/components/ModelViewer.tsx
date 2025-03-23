import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  IconButton, 
  useTheme, 
  CircularProgress, 
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
  ViewInAr,
  Refresh,
  Cameraswitch,
  LightMode
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
      url: '/models/mechanical/four stroke/scene.gltf',
      title: 'Introduction to Mechanical Engineering',
      description: 'Explore the fundamental components of mechanical systems.'
    },
    'v8-engine': {
      url: '/models/mechanical/v8_engine/scene.gltf',
      title: 'V8 Engine',
      description: 'Explore the inner workings of a V8 engine, including pistons, crankshaft, and valve train.'
    },
    'four-stroke': {
      url: '/models/mechanical/four stroke/scene.gltf',
      title: 'Four-Stroke Engine Cycle',
      description: 'Learn about the four phases of internal combustion: intake, compression, power, and exhaust.'
    },
    'combine-harvester': {
      url: '/models/mechanical/combine_harvester/scene.gltf',
      title: 'Combine Harvester',
      description: 'Examine the complex mechanisms that enable modern combine harvesters to efficiently harvest crops.'
    }
  },
  civil: {
    intro: { 
      url: '/models/civil/truss-bridge/scene.gltf',
      title: 'Introduction to Civil Engineering',
      description: 'Explore structural elements and building systems.'
    },
    'truss-bridge': {
      url: '/models/civil/truss-bridge/scene.gltf',
      title: 'Truss Bridge Structure',
      description: 'Understand the forces and structural elements that make truss bridges strong and efficient.'
    },
    'high-rise-frame': {
      url: '/models/civil/high-rise-frame/scene.gltf',
      title: 'High-Rise Building Frame',
      description: 'Explore structural systems used in skyscrapers, including columns, beams, and bracing.'
    },
    'foundation-types': {
      url: '/models/civil/foundation-types/scene.gltf',
      title: 'Foundation Types',
      description: 'Compare different foundation types including spread footings, piles, and mat foundations.'
    }
  },
  electrical: {
    intro: { 
      url: '/models/electrical/circuit_board/scene.gltf',
      title: 'Introduction to Electrical Engineering',
      description: 'Explore electrical components and circuit designs.'
    },
    'transformer': {
      url: '/models/electrical/transformer/scene.gltf',
      title: 'Power Transformer',
      description: 'Visualize how transformers change voltage levels through electromagnetic induction.'
    },
    'electric-motor': {
      url: '/models/electrical/electric_motor/scene.gltf',
      title: 'Electric Motor',
      description: 'Understand the principles behind electric motors and how they convert electrical energy to mechanical motion.'
    },
    'circuit-board': {
      url: '/models/electrical/circuit_board/scene.gltf',
      title: 'Circuit Board Layout',
      description: 'Examine the structure and components of a typical printed circuit board (PCB).'
    }
  }
};

/**
 * Component for rendering and interacting with 3D models
 * @returns React component for 3D model viewing
 */
const ModelViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const { discipline = 'mechanical', modelId = 'intro' } = useParams<{ discipline: string; modelId: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [infoCardVisible, setInfoCardVisible] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [screenshotDialogOpen, setScreenshotDialogOpen] = useState(false);
  const [screenshotURL, setScreenshotURL] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentCamera, setCurrentCamera] = useState('default');
  const [lightIntensity, setLightIntensity] = useState(0.7);

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
        
        // Open dialog to display screenshot
        setScreenshotDialogOpen(true);
        
        // Restore autorotation state
        if (controlsRef.current) {
          controlsRef.current.autoRotate = autoRotateWasEnabled;
        }
      }
    } catch (error) {
      console.error('Error taking screenshot', error);
    }
  };

  // Fullscreen toggle with Browser API
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && fullscreenContainerRef.current) {
      // Enter fullscreen
      if (fullscreenContainerRef.current.requestFullscreen) {
        fullscreenContainerRef.current.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.error(`Error attempting to enable fullscreen: ${err.message}`));
      } else if ((fullscreenContainerRef.current as any).webkitRequestFullscreen) { // Safari
        (fullscreenContainerRef.current as any).webkitRequestFullscreen();
        setIsFullscreen(true);
      } else if ((fullscreenContainerRef.current as any).msRequestFullscreen) { // IE11
        (fullscreenContainerRef.current as any).msRequestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => console.error(`Error attempting to exit fullscreen: ${err.message}`));
      } else if ((document as any).webkitExitFullscreen) { // Safari
        (document as any).webkitExitFullscreen();
        setIsFullscreen(false);
      } else if ((document as any).msExitFullscreen) { // IE11
        (document as any).msExitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Listen for fullscreen change events to update state accordingly
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Safari
    document.addEventListener('mozfullscreenchange', handleFullscreenChange); // Firefox
    document.addEventListener('MSFullscreenChange', handleFullscreenChange); // IE11

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Toggle wireframe mode
  const toggleWireframe = () => {
    // Store the new wireframe state value to use in this function
    const newWireframeState = !isWireframe;
    setIsWireframe(newWireframeState);
    
    if (sceneRef.current) {
      sceneRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          // Handle case where material might be an array
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              // Use type assertion to access wireframe property
              (mat as THREE.MeshBasicMaterial | THREE.MeshStandardMaterial | THREE.MeshPhongMaterial).wireframe = newWireframeState;
            });
          } else {
            // Use type assertion to access wireframe property
            (child.material as THREE.MeshBasicMaterial | THREE.MeshStandardMaterial | THREE.MeshPhongMaterial).wireframe = newWireframeState;
          }
        }
      });
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Set up the 3D scene
  useEffect(() => {
    if (!mountRef.current) return;
    setIsLoading(true);
    setLoadingProgress(0);
    
    // Create the scene with improved background color for dark mode
    const scene = new THREE.Scene();
    
    // Use a subtle gradient blue-purple for dark mode, light gray for light mode
    if (isDarkMode) {
      // Create gradient background for dark mode
      const canvas = document.createElement('canvas');
      canvas.width = 2;
      canvas.height = 2;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Create subtle gradient from dark blue to dark purple
        const gradient = context.createLinearGradient(0, 0, 0, 2);
        gradient.addColorStop(0, '#1a1a2e'); // Dark blue
        gradient.addColorStop(1, '#202040'); // Dark purple tint
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 2, 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        scene.background = texture;
      } else {
        // Fallback if context not available
        scene.background = new THREE.Color('#1a1a2e');
      }
    } else {
      // Light mode background
      scene.background = new THREE.Color(0xf5f5f5);
    }
    
    sceneRef.current = scene;
    
    // Create the camera - position it further away and at an angle for better viewing
    const aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(65, aspect, 0.1, 1000);
    camera.position.set(5, 3, 5); // Adjusted for better viewing angle
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    
    // Create the renderer with better options
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add orbit controls with better settings
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;
    controls.autoRotate = true; // Enable auto-rotation for better user experience
    controls.autoRotateSpeed = 0.5;
    controls.minDistance = 3; // Prevent zooming too close
    controls.maxDistance = 20; // Prevent zooming too far
    controlsRef.current = controls;
    
    // Improved lighting
    // Add ambient light with more intensity
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Increased from 0.5
    scene.add(ambientLight);
    
    // Add directional light with better positioning and shadows
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2); // Slightly brighter
    dirLight.position.set(5, 10, 7); // Adjusted position
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048; // Higher resolution shadows
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    scene.add(dirLight);
    
    // Add a secondary light from the opposite side to fill shadows
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);
    
    // Find the model configuration
    const modelConfig = 
      modelConfigs[discipline as keyof typeof modelConfigs]?.[modelId] || 
      modelConfigs.mechanical.intro;
    
    // Load the model with better error handling and progress feedback
    const loader = new GLTFLoader();
    
    loader.load(
      modelConfig.url,
      (gltf) => {
        // Process the model after loading
        scene.add(gltf.scene);
        
        // Enable shadows on the entire model
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Ensure materials are properly handling lighting
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                  mat.needsUpdate = true;
                  if (isWireframe) {
                    (mat as THREE.MeshBasicMaterial | THREE.MeshStandardMaterial | THREE.MeshPhongMaterial).wireframe = true;
                  }
                });
              } else {
                child.material.needsUpdate = true;
                if (isWireframe) {
                  (child.material as THREE.MeshBasicMaterial | THREE.MeshStandardMaterial | THREE.MeshPhongMaterial).wireframe = true;
                }
              }
            }
          }
        });
        
        // Center and scale the model more precisely
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Calculate scale to normalize model size - make it slightly larger
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.5 / maxDim; // Increased from 2 for better visibility
        gltf.scene.scale.set(scale, scale, scale);
        
        // Center the model
        gltf.scene.position.x = -center.x * scale;
        gltf.scene.position.y = -center.y * scale;
        gltf.scene.position.z = -center.z * scale;
        
        setIsLoading(false);
      },
      (xhr) => {
        // Loading progress with more accurate feedback
        const progress = xhr.loaded / xhr.total * 100;
        setLoadingProgress(Math.min(progress, 99)); // Cap at 99% until fully loaded
      },
      (error) => {
        console.error('Error loading model:', error);
        setIsLoading(false);
      }
    );
    
    // Animation loop
    const animate = () => {
      if (!mountRef.current) return;
      
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && scene && camera) {
        rendererRef.current.render(scene, camera);
      }
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && rendererRef.current) {
        try {
          mountRef.current.removeChild(rendererRef.current.domElement);
        } catch (error) {
          console.error('Error removing renderer:', error);
        }
      }
      
      if (scene) {
        scene.clear();
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [discipline, modelId, isDarkMode, isWireframe]);

  // Get the current model configuration
  const currentModel = 
    modelConfigs[discipline as keyof typeof modelConfigs]?.[modelId] || 
    modelConfigs.mechanical.intro;

  // Allow external access to camera and light functions
  // @ts-ignore - These functions are added dynamically
  const switchCamera = (position: string) => window.switchCamera && window.switchCamera(position);
  // @ts-ignore - These functions are added dynamically
  const adjustLightIntensity = (intensity: number) => window.adjustLightIntensity && window.adjustLightIntensity(intensity);

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        position: 'relative',
        display: 'flex',
        bgcolor: 'background.default'
      }}>
      
      {/* Sidebar - hide in fullscreen mode */}
      {!isFullscreen && (
        <Box
          sx={{
            height: '100%',
            width: isSidebarOpen ? (isMobile ? 260 : 300) : 0,
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            zIndex: 10,
            boxShadow: isSidebarOpen ? '4px 0px 10px rgba(0, 0, 0, 0.1)' : 'none',
            bgcolor: theme.palette.background.paper
          }}
        >
          {isSidebarOpen && (
            <LearningModelSidebar
              onClose={toggleSidebar}
              discipline={discipline}
              modelId={modelId}
            />
          )}
        </Box>
      )}
      
      {/* Main content area */}
      <Box
        ref={fullscreenContainerRef}
        sx={{
          flexGrow: 1,
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Discipline-specific background */}
        {discipline && !isFullscreen && (
          <DisciplineBackground 
            discipline={(discipline as 'mechanical' | 'civil' | 'electrical')} 
            opacity={0.2}
          />
        )}

        {/* 3D Viewer Container */}
        <Box
          ref={mountRef}
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            zIndex: 2
          }}
        />

        {/* Sidebar Toggle Button - hide in fullscreen mode */}
        {!isFullscreen && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
              zIndex: 5
            }}
          >
            <IconButton
              onClick={toggleSidebar}
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              size="large"
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: '0 50% 50% 0',
                boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          </Box>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: 10,
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: 3
            }}
          >
            <CircularProgress 
              variant="determinate" 
              value={loadingProgress} 
              size={60} 
              thickness={4}
              sx={{ mb: 2 }} 
            />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Loading model ({Math.round(loadingProgress)}%)
            </Typography>
          </Box>
        )}

        {/* Model Information Card - hide in fullscreen mode */}
        {!isFullscreen && (
          <Fade in={infoCardVisible && !isLoading}>
            <Paper
              elevation={3}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: { xs: 'calc(100% - 32px)', sm: 350 },
                maxWidth: '100%',
                p: 2,
                zIndex: 5,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(5px)',
                ...(!isDarkMode ? {} : {
                  bgcolor: 'rgba(26, 26, 46, 0.85)',
                })
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" component="h2">{currentModel.title}</Typography>
                <IconButton size="small" onClick={() => setInfoCardVisible(false)}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {currentModel.description}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Chip 
                  size="small" 
                  label={discipline.charAt(0).toUpperCase() + discipline.slice(1)} 
                  color="primary" 
                />
              </Box>
            </Paper>
          </Fade>
        )}

        {/* Model Controls - Always visible, even in fullscreen mode */}
        <Fade in={!isLoading}>
          <Paper
            elevation={6}
            sx={{
              position: 'absolute',
              bottom: isMobile ? 20 : 30,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? 0.5 : 1,
              p: isMobile ? 1 : 1.5,
              borderRadius: 10,
              bgcolor: isDarkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              opacity: 1,
              zIndex: 10000, // Ultra high z-index to ensure visibility in fullscreen
              transition: 'all 0.3s ease',
              '&:hover': {
                opacity: 1,
                transform: 'translateX(-50%) scale(1.05)'
              }
            }}
          >
            <CustomTooltip title="Reset View">
              <IconButton 
                onClick={handleReset}
                size={isMobile ? "small" : "medium"}
                color="primary"
                sx={{ 
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(25,118,210,0.1)', 
                  mr: 0.5 
                }}
              >
                <Refresh />
              </IconButton>
            </CustomTooltip>

            <CustomTooltip title="Zoom Out">
              <IconButton 
                onClick={handleZoomOut} 
                size={isMobile ? "small" : "medium"}
                color="primary"
                sx={{ bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(25,118,210,0.1)' }}
              >
                <ZoomOut />
              </IconButton>
            </CustomTooltip>

            <CustomTooltip title="Zoom In">
              <IconButton 
                onClick={handleZoomIn} 
                size={isMobile ? "small" : "medium"}
                color="primary"
                sx={{ bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(25,118,210,0.1)' }}
              >
                <ZoomIn />
              </IconButton>
            </CustomTooltip>

            <Box sx={{ height: 24, mx: 0.5, width: 1, bgcolor: 'divider' }} />

            <CustomTooltip title={isWireframe ? "Solid Mode" : "Wireframe Mode"}>
              <IconButton 
                onClick={toggleWireframe} 
                size={isMobile ? "small" : "medium"}
                color={isWireframe ? "secondary" : "primary"}
                sx={{ 
                  position: 'relative',
                  bgcolor: isWireframe ? 
                    (isDarkMode ? 'rgba(245,0,87,0.25)' : 'rgba(245,0,87,0.15)') : 
                    (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(25,118,210,0.1)'),
                  '&::after': isWireframe ? {
                    content: '""',
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'secondary.main',
                    animation: 'pulse 1.5s infinite'
                  } : {}
                }}
              >
                <GridOn />
              </IconButton>
            </CustomTooltip>

            <CustomTooltip title="Take Screenshot">
              <IconButton 
                onClick={handleScreenshot} 
                size={isMobile ? "small" : "medium"}
                color="primary"
                sx={{ bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(25,118,210,0.1)' }}
              >
                <PhotoCamera />
              </IconButton>
            </CustomTooltip>

            <Box sx={{ height: 24, mx: 0.5, width: 1, bgcolor: 'divider' }} />

            <CustomTooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              <IconButton 
                onClick={toggleFullscreen} 
                size={isMobile ? "small" : "medium"}
                color={isFullscreen ? "secondary" : "primary"}
                sx={{ 
                  bgcolor: isFullscreen ? 
                    (isDarkMode ? 'rgba(245,0,87,0.25)' : 'rgba(245,0,87,0.15)') : 
                    (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(25,118,210,0.1)'),
                  '&:hover': {
                    bgcolor: isFullscreen ? 
                      (isDarkMode ? 'rgba(245,0,87,0.35)' : 'rgba(245,0,87,0.25)') : 
                      (isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(25,118,210,0.2)')
                  }
                }}
              >
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </CustomTooltip>
          </Paper>
        </Fade>

        {/* Add pulse animation for active toggles */}
        <Box
          sx={{
            '@keyframes pulse': {
              '0%': {
                boxShadow: '0 0 0 0 rgba(245, 0, 87, 0.7)'
              },
              '70%': {
                boxShadow: '0 0 0 6px rgba(245, 0, 87, 0)'
              },
              '100%': {
                boxShadow: '0 0 0 0 rgba(245, 0, 87, 0)'
              }
            }
          }}
        />

        {/* Screenshot Dialog */}
        <Dialog 
          open={screenshotDialogOpen} 
          onClose={() => setScreenshotDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Screenshot
            <IconButton
              onClick={() => setScreenshotDialogOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {screenshotURL && (
              <Box sx={{ textAlign: 'center' }}>
                <img 
                  src={screenshotURL} 
                  alt="Model Screenshot" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '70vh',
                    objectFit: 'contain',
                    borderRadius: 4,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }} 
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setScreenshotDialogOpen(false)}>Close</Button>
            <Button 
              variant="contained" 
              component="a"
              href={screenshotURL || '#'}
              download={`${discipline}-${modelId}-screenshot.png`}
              disabled={!screenshotURL}
            >
              Download
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ModelViewer; 