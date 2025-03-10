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
    // Adjust camera position for mobile - move it further back
    const cameraDistance = isMobile ? 8 : 5;
    camera.position.set(cameraDistance, cameraDistance, cameraDistance);
    cameraRef.current = camera;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Renderer with explicit pixel ratio control for mobile
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile, // Disable antialiasing on mobile for better performance
      alpha: true, 
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    
    // Limit pixel ratio on mobile devices to improve performance
    const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio;
    renderer.setPixelRatio(pixelRatio);
    
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMappingExposure = 1.0;
    
    // Clear any previous renderer
    if (mountRef.current.childNodes.length > 0) {
      mountRef.current.innerHTML = '';
    }
    
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
    
    // Adjust for mobile - add touch gesture sensitivity
    if (isMobile) {
      controls.rotateSpeed = 0.7; // Slower rotation for more precision on mobile
      controls.enableDamping = true; // Enhanced damping for mobile
      controls.dampingFactor = 0.1; // Increased damping factor
    }
    
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
    <Box
      sx={{
        width: '100%',
        height: '100vh', // Full viewport height
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        flexDirection: 'column',
      }}
    >
      {/* Top toolbar */}
      <Box
        sx={{
          width: '100%',
          p: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          zIndex: 10,
        }}
      >
        {/* ... toolbar content ... */}
      </Box>
      
      {/* Main content area */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          position: 'relative',
          width: '100%',
          height: 'calc(100% - 64px)', // Subtract the toolbar height
          overflow: 'hidden',
        }}
      >
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
        
        {/* 3D model container */}
        <Box
          ref={mountRef}
          sx={{
            flexGrow: 1,
            width: '100%',
            height: '100%',
            position: 'relative',
            backgroundColor: theme.palette.background.default,
            // Add explicit touch actions for mobile
            touchAction: 'none', // Prevent browser handling of touch events (like scrolling)
            '& canvas': {
              display: 'block',
              outline: 'none',
              width: '100% !important', // Force canvas to respect container width
              height: '100% !important', // Force canvas to respect container height
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default ModelViewer; 