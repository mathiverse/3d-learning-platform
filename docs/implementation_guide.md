# EduDive Implementation Guide

This guide provides specific technical instructions for implementing the changes outlined in the action plan. It includes code snippets, architectural approaches, and best practices to follow.

## Table of Contents
- [Navigation Component Refactoring](#navigation-component-refactoring)
- [3D Viewer Enhancements](#3d-viewer-enhancements)
- [Dashboard Improvements](#dashboard-improvements)
- [Progress to Resources Conversion](#progress-to-resources-conversion)
- [Settings Simplification](#settings-simplification)
- [Performance Optimizations](#performance-optimizations)
- [Netlify Deployment Guide](#netlify-deployment-guide)

## Navigation Component Refactoring

### Remove User Profile Elements

```tsx
// BEFORE
const Navigation: React.FC = () => {
  // User-related state
  const [username, setUsername] = useState('Student');
  // ...

  return (
    <AppBar position="fixed">
      {/* ... */}
      <IconButton onClick={handleProfileMenuOpen}>
        <Avatar>{username.charAt(0)}</Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
        <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
      </Menu>
    </AppBar>
  );
};

// AFTER
const Navigation: React.FC = () => {
  return (
    <AppBar position="fixed">
      {/* ... */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title="Help & Resources">
          <IconButton color="inherit" onClick={() => navigate('/resources')}>
            <HelpOutline />
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle Dark Mode">
          <IconButton color="inherit" onClick={onThemeToggle}>
            {isDarkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>
      </Box>
    </AppBar>
  );
};
```

### Add Content-Focused Navigation

```tsx
const navItems = [
  { title: 'Explore Models', path: '/', icon: <Explore /> },
  { title: 'Learning Paths', path: '/learning-paths', icon: <Timeline /> },
  { title: 'Resources', path: '/resources', icon: <MenuBook /> },
  { title: 'About', path: '/about', icon: <Info /> },
];

// Navigation items mapping
<List>
  {navItems.map((item) => (
    <ListItem 
      key={item.title} 
      disablePadding 
      sx={{ display: 'block' }}
    >
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
        }}
        onClick={() => navigate(item.path)}
        selected={location.pathname === item.path}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            justifyContent: 'center',
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText 
          primary={item.title} 
          sx={{ opacity: open ? 1 : 0 }} 
        />
      </ListItemButton>
    </ListItem>
  ))}
</List>
```

## 3D Viewer Enhancements

### Properly Implement Three.js Controls

```tsx
// Proper imports for Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// In your component
useEffect(() => {
  if (!mountRef.current) return;
  
  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(isDarkMode ? 0x121212 : 0xf5f5f5);
  
  // Setup camera
  const camera = new THREE.PerspectiveCamera(
    75, 
    mountRef.current.clientWidth / mountRef.current.clientHeight, 
    0.1, 
    1000
  );
  camera.position.z = 5;
  
  // Create renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  mountRef.current.appendChild(renderer.domElement);
  rendererRef.current = renderer;
  
  // Setup controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 2;
  controls.maxDistance = 20;
  
  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(ambientLight, directionalLight);
  
  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  
  animate();
  
  // Handle window resize
  const handleResize = () => {
    if (!mountRef.current) return;
    
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };
  
  window.addEventListener('resize', handleResize);
  
  // Cleanup
  return () => {
    window.removeEventListener('resize', handleResize);
    if (mountRef.current && rendererRef.current) {
      mountRef.current.removeChild(rendererRef.current.domElement);
    }
    scene.dispose();
  };
}, [isDarkMode]);
```

### Add Educational Tooltips

```tsx
// Component to add interactive explanations to 3D models
const ModelAnnotation: React.FC<{
  position: THREE.Vector3,
  label: string,
  description: string
}> = ({ position, label, description }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Box
      sx={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 5,
      }}
    >
      <IconButton
        size="small"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        <Info fontSize="small" />
      </IconButton>
      
      <Popover
        open={isOpen}
        onClose={() => setIsOpen(false)}
        anchorReference="anchorPosition"
        anchorPosition={{ top: position.y, left: position.x + 30 }}
      >
        <Box sx={{ p: 2, maxWidth: 300 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {label}
          </Typography>
          <Typography variant="body2">
            {description}
          </Typography>
        </Box>
      </Popover>
    </Box>
  );
};
```

## Dashboard Improvements

### Expandable Categories and Search

```tsx
// Add state for search and filtering
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

// Filter function for models
const filteredModels = useMemo(() => {
  return allModels.filter(model => {
    const matchesSearch = 
      !searchQuery || 
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = !selectedCategory || model.discipline === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
}, [allModels, searchQuery, selectedCategory]);

// Search bar component
<Paper
  component="form"
  sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 3 }}
>
  <InputBase
    sx={{ ml: 1, flex: 1 }}
    placeholder="Search models..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  <IconButton type="button" sx={{ p: '10px' }}>
    <Search />
  </IconButton>
</Paper>

// Category chips
<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
  {categories.map(category => (
    <Chip
      key={category.id}
      label={category.name}
      onClick={() => setSelectedCategory(
        selectedCategory === category.id ? null : category.id
      )}
      color={selectedCategory === category.id ? 'primary' : 'default'}
    />
  ))}
</Box>
```

### Learning Paths Implementation

```tsx
interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: {
    modelId: string;
    title: string;
    description: string;
  }[];
}

const learningPaths: LearningPath[] = [
  {
    id: 'mechanical-basics',
    title: 'Mechanical Engineering Fundamentals',
    description: 'Learn the core concepts of mechanical engineering through interactive 3D models',
    difficulty: 'beginner',
    steps: [
      {
        modelId: 'mechanical/intro',
        title: 'Introduction to Mechanical Components',
        description: 'Overview of basic mechanical parts and their functions'
      },
      {
        modelId: 'mechanical/gear-system',
        title: 'Understanding Gear Systems',
        description: 'Explore how different gears interact and transfer power'
      },
      // More steps...
    ]
  },
  // More learning paths...
];

// Learning path card component
const LearningPathCard: React.FC<{ path: LearningPath }> = ({ path }) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="h5" component="h2">
        {path.title}
      </Typography>
      <Chip 
        label={path.difficulty} 
        size="small" 
        color={
          path.difficulty === 'beginner' ? 'success' :
          path.difficulty === 'intermediate' ? 'primary' :
          'error'
        }
        sx={{ mt: 1, mb: 2 }}
      />
      <Typography variant="body2" color="text.secondary">
        {path.description}
      </Typography>
    </CardContent>
    <Box sx={{ px: 2, pb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {path.steps.length} steps in this path
      </Typography>
      <Button 
        variant="contained" 
        endIcon={<KeyboardArrowRight />}
        onClick={() => navigate(`/learning-path/${path.id}`)}
      >
        Start Learning
      </Button>
    </Box>
  </Card>
);
```

## Progress to Resources Conversion

### Transform CourseProgress to Resources Component

```tsx
// Resources categories
const resourceCategories = [
  { id: 'tutorials', name: 'Tutorials', icon: <School /> },
  { id: 'references', name: 'Reference Materials', icon: <MenuBook /> },
  { id: 'downloads', name: 'Downloadable Resources', icon: <CloudDownload /> },
  { id: 'external', name: 'External Links', icon: <Link /> },
];

// Resource type interface
interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'tutorial' | 'reference' | 'download' | 'external';
  url: string;
  discipline?: string;
  format?: string;
}

// Learning Resources page component
const LearningResources: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('tutorials');
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Learning Resources
      </Typography>
      
      {/* Category tabs */}
      <Tabs
        value={activeCategory}
        onChange={(_, newValue) => setActiveCategory(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        {resourceCategories.map(category => (
          <Tab 
            key={category.id}
            label={category.name}
            value={category.id}
            icon={category.icon}
            iconPosition="start"
          />
        ))}
      </Tabs>
      
      {/* Resources list by category */}
      <Grid container spacing={3}>
        {resources
          .filter(r => r.type === activeCategory.replace('s', ''))
          .map(resource => (
            <Grid item xs={12} md={6} key={resource.id}>
              <ResourceCard resource={resource} />
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

// Resource card component
const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">{resource.title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {resource.description}
      </Typography>
      
      {resource.discipline && (
        <Chip 
          label={resource.discipline} 
          size="small" 
          sx={{ mt: 2, mr: 1 }}
        />
      )}
      
      {resource.format && (
        <Chip 
          label={resource.format} 
          size="small"
          color="primary"
          variant="outlined"
          sx={{ mt: 2 }}
        />
      )}
    </CardContent>
    <CardActions>
      <Button 
        size="small" 
        endIcon={
          resource.type === 'download' ? <CloudDownload /> : <OpenInNew />
        }
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {resource.type === 'download' ? 'Download' : 'View Resource'}
      </Button>
    </CardActions>
  </Card>
);
```

## Settings Simplification

### Focus on App Preferences

```tsx
// Settings state with only app preferences
interface AppSettings {
  darkMode: boolean;
  highQualityRendering: boolean;
  showAnnotations: boolean;
  modelComplexity: 'low' | 'medium' | 'high';
  enableTutorialHints: boolean;
}

const SettingsPage: React.FC = () => {
  // Initialize settings from localStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedSettings = localStorage.getItem('appSettings');
    return savedSettings 
      ? JSON.parse(savedSettings) 
      : {
          darkMode: false,
          highQualityRendering: true,
          showAnnotations: true,
          modelComplexity: 'medium',
          enableTutorialHints: true,
        };
  });
  
  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);
  
  // Handle setting changes
  const handleSettingChange = (setting: keyof AppSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Application Settings
        </Typography>
        
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Display Settings
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText 
                primary="Dark Mode" 
                secondary="Enable dark theme for the application" 
              />
              <Switch
                edge="end"
                checked={settings.darkMode}
                onChange={e => handleSettingChange('darkMode', e.target.checked)}
              />
            </ListItem>
            
            <ListItem>
              <ListItemText 
                primary="Show Annotations" 
                secondary="Display helpful annotations on 3D models" 
              />
              <Switch
                edge="end"
                checked={settings.showAnnotations}
                onChange={e => handleSettingChange('showAnnotations', e.target.checked)}
              />
            </ListItem>
          </List>
        </Paper>
        
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Performance Settings
          </Typography>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Model Quality</InputLabel>
            <Select
              value={settings.modelComplexity}
              label="Model Quality"
              onChange={e => handleSettingChange('modelComplexity', e.target.value)}
            >
              <MenuItem value="low">Low (Best Performance)</MenuItem>
              <MenuItem value="medium">Medium (Balanced)</MenuItem>
              <MenuItem value="high">High (Best Quality)</MenuItem>
            </Select>
            <FormHelperText>
              Select lower quality for better performance on less powerful devices
            </FormHelperText>
          </FormControl>
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.highQualityRendering}
                onChange={e => handleSettingChange('highQualityRendering', e.target.checked)}
              />
            }
            label="High Quality Rendering"
            sx={{ mt: 2 }}
          />
        </Paper>
      </Box>
    </Container>
  );
};
```

## Performance Optimizations

### Implement Progressive Loading and Level of Detail

```tsx
// Add loading states
const [loadingProgress, setLoadingProgress] = useState(0);
const [modelQuality, setModelQuality] = useState<'low' | 'medium' | 'high'>(() => {
  // Get from settings or determine based on device capability
  const settings = localStorage.getItem('appSettings');
  if (settings) {
    return JSON.parse(settings).modelComplexity || 'medium';
  }
  
  // Detect device capability
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  return isMobile ? 'low' : 'medium';
});

// Model loading with quality selection and progress tracking
const loadModel = useCallback((modelUrl: string) => {
  const loader = new GLTFLoader();
  
  // Determine which model variant to load based on quality
  const qualitySuffix = modelQuality === 'low' ? '_low' : 
                       modelQuality === 'medium' ? '_med' : '';
  
  const urlParts = modelUrl.split('.');
  const qualityUrl = urlParts[0] + qualitySuffix + '.' + urlParts[1];
  
  loader.load(
    qualityUrl,
    (gltf) => {
      // Model loaded successfully
      scene.add(gltf.scene);
      
      // Center and scale model
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      // Calculate appropriate scale
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 5 / maxDim;
      gltf.scene.scale.set(scale, scale, scale);
      
      gltf.scene.position.x = -center.x * scale;
      gltf.scene.position.y = -center.y * scale;
      gltf.scene.position.z = -center.z * scale;
      
      setIsLoading(false);
    },
    (xhr) => {
      // Loading progress
      setLoadingProgress((xhr.loaded / xhr.total) * 100);
    },
    (error) => {
      console.error('Error loading model', error);
      setIsLoading(false);
      
      // If loading high-quality model fails, try lower quality
      if (modelQuality === 'high') {
        setModelQuality('medium');
        loadModel(modelUrl);
      } else if (modelQuality === 'medium') {
        setModelQuality('low');
        loadModel(modelUrl);
      }
    }
  );
}, [scene, modelQuality]);

// Loading indicator component
{isLoading && (
  <Box 
    sx={{ 
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)',
      textAlign: 'center'
    }}
  >
    <CircularProgress 
      variant="determinate" 
      value={loadingProgress} 
      size={60}
    />
    <Typography variant="body2" sx={{ mt: 2 }}>
      Loading model ({Math.round(loadingProgress)}%)
    </Typography>
  </Box>
)}
```

### Implement Asset Caching

```tsx
// Simple caching mechanism for loaded models
const modelCache = new Map<string, THREE.Group>();

const loadModelWithCache = useCallback((modelUrl: string) => {
  // Check if model is in cache
  if (modelCache.has(modelUrl)) {
    const cachedModel = modelCache.get(modelUrl)!.clone();
    scene.add(cachedModel);
    setIsLoading(false);
    return;
  }
  
  // If not in cache, load it
  const loader = new GLTFLoader();
  loader.load(
    modelUrl,
    (gltf) => {
      // Store in cache
      modelCache.set(modelUrl, gltf.scene.clone());
      
      // Add to scene
      scene.add(gltf.scene);
      setIsLoading(false);
    },
    (xhr) => {
      setLoadingProgress((xhr.loaded / xhr.total) * 100);
    },
    (error) => {
      console.error('Error loading model', error);
      setIsLoading(false);
    }
  );
}, [scene]);

// Clear cache when it gets too large
useEffect(() => {
  if (modelCache.size > 10) {
    // Keep only the 5 most recent models
    const keysToRemove = Array.from(modelCache.keys()).slice(0, modelCache.size - 5);
    keysToRemove.forEach(key => modelCache.delete(key));
  }
}, [modelCache.size]);
```

## Responsive Design Implementation

### Mobile-Specific Controls

```tsx
// Detect if device is mobile
const isMobile = useMediaQuery('(max-width:600px)');

// Mobile-specific controls
{isMobile && (
  <Box 
    sx={{ 
      position: 'absolute', 
      bottom: 20, 
      left: '50%', 
      transform: 'translateX(-50%)',
      display: 'flex',
      justifyContent: 'center',
      gap: 2,
      zIndex: 10
    }}
  >
    <Paper sx={{ p: 1, borderRadius: 4, opacity: 0.7 }}>
      <IconButton onClick={() => camera.position.z += 0.5}>
        <ZoomOut />
      </IconButton>
      <IconButton onClick={() => camera.position.z -= 0.5}>
        <ZoomIn />
      </IconButton>
      <IconButton onClick={resetCameraPosition}>
        <RestartAlt />
      </IconButton>
    </Paper>
  </Box>
)}

// Touch controls messaging for mobile
{isMobile && isFirstVisit && (
  <Alert 
    severity="info" 
    sx={{ position: 'absolute', top: 10, left: 10, right: 10, zIndex: 10 }}
    onClose={() => setIsFirstVisit(false)}
  >
    <AlertTitle>Touch Controls</AlertTitle>
    Use one finger to rotate, two fingers to pan, and pinch to zoom
  </Alert>
)}
```

## Netlify Deployment Guide

### Current Deployment Configuration

EduDive is configured to deploy on Netlify with the following settings in the `netlify.toml` file:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Common Deployment Issues and Solutions

#### 1. Build Failures Due to ESLint Warnings

**Issue**: Netlify treats warnings as errors in CI environment, causing build failures when ESLint warnings exist.

**Solution**:
Add a `.env` file to your project with the following setting:

```
VITE_DISABLE_ESLINT_PLUGIN=true
```

Alternatively, update `package.json` to modify the build script:

```json
"scripts": {
  "build": "CI=false tsc && vite build"
}
```

#### 2. Module Resolution Issues

**Issue**: TypeScript paths or module imports that work locally may fail on Netlify.

**Solution**:
Ensure all imports use correct casing and relative paths. Update `tsconfig.json` to include:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### 3. Node Version Compatibility

**Issue**: Different Node.js versions can cause unexpected build failures.

**Solution**:
EduDive is already configured to use Node 18 in the `netlify.toml` file. If changes are needed:

```toml
[build.environment]
  NODE_VERSION = "18"
```

#### 4. Large File Handling

**Issue**: Files over 10MB can cause deployment failures on Netlify.

**Solution**:
- Compress 3D model files using tools like Draco compression
- Host very large assets externally and reference them
- Add to `.gitignore` and manage with Git LFS if needed

#### 5. Post-Processing and Cache Issues

**Issue**: SPA routing can cause 404 errors for deep links.

**Solution**:
The project already has the necessary redirects in `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Deployment Best Practices

1. **Local Testing Before Deployment**:
   ```bash
   npm run build
   npx serve -s dist
   ```

2. **Environment Variables Management**:
   - Set environment variables in Netlify UI for sensitive data
   - Use `.env.production` for non-sensitive production values
   - Reference variables with `import.meta.env.VITE_VARIABLE_NAME` in code

3. **Debugging Deployments**:
   - Check Netlify build logs for specific errors
   - Enable Netlify CLI for local testing of production builds:
     ```bash
     npm install -g netlify-cli
     netlify dev
     ```

4. **Performance Optimizations**:
   - Enable Brotli compression in `netlify.toml`:
     ```toml
     [build.processing]
       skip_processing = false
     [build.processing.css]
       bundle = true
       minify = true
     [build.processing.js]
       bundle = true
       minify = true
     [build.processing.html]
       pretty_urls = true
     [build.processing.images]
       compress = true
     ```

5. **Deploy Previews**:
   - Utilize Netlify deploy previews for PRs
   - Test changes in isolation before merging

### Deployment Workflow

1. Develop and test locally
2. Commit and push changes to GitHub
3. Netlify automatically builds from the connected repository
4. Check build logs for any errors
5. Verify the deployed application functions correctly
6. If needed, roll back to previous deploy in Netlify UI

By following these guidelines, EduDive can maintain a stable and reliable deployment pipeline on Netlify, ensuring the application is always available to users.

This implementation guide provides code examples for the main areas that need to be addressed according to the action plan. Developers should adapt these examples to fit the existing codebase structure while maintaining the goal of refocusing EduDive as a general learning platform without backend dependencies. 