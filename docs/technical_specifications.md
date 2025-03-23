# EduDive Technical Specifications

This document provides detailed technical specifications for the EduDive platform, intended for developers and technical stakeholders.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Component Design](#component-design)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [3D Rendering Implementation](#3d-rendering-implementation)
- [Performance Optimizations](#performance-optimizations)
- [Security Considerations](#security-considerations)
- [API References](#api-references)
- [Development Standards](#development-standards)

## Architecture Overview

### Application Architecture

EduDive follows a component-based architecture using React and TypeScript. The application is structured as follows:

```
Frontend (React/TypeScript)
└── Components
    ├── Layout Components (Navigation, Dashboard)
    ├── Feature Components (ModelViewer, CourseProgress)
    └── UI Components (Buttons, Cards, Tooltips)
```

### Technical Stack Details

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend Framework | React | 18.2.0 | UI rendering and component logic |
| Programming Language | TypeScript | 5.2.2 | Type-safe JavaScript |
| Build Tool | Vite | 5.0.8 | Development server and bundling |
| UI Library | Material UI | 5.15.7 | Consistent UI components |
| 3D Rendering | Three.js | 0.161.0 | 3D model rendering |
| Routing | React Router DOM | 6.22.0 | Application navigation |
| Code Quality | ESLint | 8.55.0 | Code linting and standards |

## Component Design

### Key Components and Responsibilities

#### App.tsx
- Application entry point
- Theme configuration
- Routing setup
- Global state initialization

#### ModelViewer.tsx
- 3D scene initialization
- Camera setup and controls
- Model loading and rendering
- User interaction handling
- Wireframe toggle implementation
- Screenshot functionality
- Full-screen mode

#### Navigation.tsx
- Application navigation
- Discipline selection
- Theme toggle
- User menu

#### Dashboard.tsx
- Discipline card rendering
- Navigation to model viewer
- UI layout and styling

#### CourseProgress.tsx
- Progress visualization
- Completion statistics
- User activity tracking

### Component Interaction

```
App
└── Navigation
└── Routes
    ├── Dashboard
    │   └── DisciplineCards
    ├── ModelViewer
    │   ├── LearningModelSidebar
    │   ├── ToolbarControls
    │   └── Three.js Renderer
    ├── CourseProgress
    └── SettingsPage
```

## Data Flow

### User Interaction Flow

1. User selects a discipline on the Dashboard
2. Router navigates to the ModelViewer with discipline and model parameters
3. ModelViewer loads the 3D model based on URL parameters
4. User interacts with the model using UI controls or direct manipulation
5. Model state changes are reflected in the UI

### Data Loading Process

1. Application initialization loads discipline data
2. When a model is selected, the GLTFLoader loads the 3D model
3. Model metadata is displayed in the sidebar
4. User interactions update the camera and model states

## State Management

The application uses React's built-in state management with the useState hook for component-level state and props for passing data between components.

### Global State
- Theme preference (dark/light mode)
- User information

### Component-level State Examples
- ModelViewer
  - Camera position and rotation
  - Wireframe mode toggle
  - Sidebar visibility
  - Full-screen mode
  - Screenshot data

- Dashboard
  - Selected discipline

- CourseProgress
  - Completed models
  - Progress statistics

## 3D Rendering Implementation

### Three.js Integration

The ModelViewer component creates and manages a Three.js scene:

```typescript
// Scene creation
const scene = new THREE.Scene();
scene.background = new THREE.Color(isDarkMode ? 0x121212 : 0xf5f5f5);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
camera.position.z = 5;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(ambientLight, directionalLight);

// Controls
const controls = new OrbitControls(camera, rendererRef.current.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
```

### Model Loading

Models are loaded using the GLTFLoader from Three.js:

```typescript
const loader = new GLTFLoader();
loader.load(
  modelUrl,
  (gltf) => {
    // Clear any existing models
    scene.children
      .filter((child) => child.type === 'Group')
      .forEach((child) => scene.remove(child));
    
    // Add the new model
    scene.add(gltf.scene);
    
    // Center and scale the model
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    gltf.scene.position.x = -center.x;
    gltf.scene.position.y = -center.y;
    gltf.scene.position.z = -center.z;
    
    // Set wireframe mode
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.wireframe = isWireframe;
      }
    });
    
    setIsLoading(false);
  },
  (xhr) => {
    // Loading progress
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  (error) => {
    // Error handling
    console.error('Error loading model:', error);
    setIsLoading(false);
  }
);
```

### Render Loop

The animation loop is managed using requestAnimationFrame:

```typescript
const animate = () => {
  if (!mountRef.current) return;
  
  requestAnimationFrame(animate);
  
  if (controls) {
    controls.update();
  }
  
  if (rendererRef.current && scene && camera) {
    rendererRef.current.render(scene, camera);
  }
};
```

## Performance Optimizations

### Rendering Optimizations

- **Camera Frustum Culling**: Objects outside the camera view are not rendered
- **Level of Detail**: Models use appropriate polygon counts
- **Frame Rate Management**: 60fps target with fallback for lower-end devices
- **Texture Compression**: Optimized textures for reduced memory usage

### React Component Optimizations

- **React.memo**: Used for components that rarely change
- **useCallback**: Optimized event handlers
- **Lazy Loading**: Components not needed on initial render are loaded on demand

### Code Splitting

The application uses React's lazy loading and code splitting to reduce the initial bundle size:

```typescript
const ModelViewer = React.lazy(() => import('./components/ModelViewer'));
const CourseProgress = React.lazy(() => import('./components/CourseProgress'));
const SettingsPage = React.lazy(() => import('./components/SettingsPage'));
```

## Security Considerations

### Content Security Policy

The application should be deployed with appropriate Content Security Policy headers:

```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self'; 
  style-src 'self' 'unsafe-inline'; 
  font-src 'self' https://fonts.gstatic.com; 
  img-src 'self' data: blob:; 
  connect-src 'self';
```

### Cross-Origin Resource Sharing

CORS headers should be configured for API endpoints:

```
Access-Control-Allow-Origin: https://edudive.example.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Local Storage Protection

Sensitive data should not be stored in local storage. The application currently uses local storage only for theme preferences.

## API References

### Future API Endpoints

The application is prepared for future API integration with the following planned endpoints:

```
GET /api/models
GET /api/models/:discipline
GET /api/models/:discipline/:modelId
GET /api/user/progress
POST /api/user/progress
```

## Development Standards

### TypeScript Standards

- Use explicit type annotations
- Avoid `any` type
- Use interfaces for object shapes
- Use proper naming conventions

Example:
```typescript
interface ModelProps {
  id: string;
  name: string;
  url: string;
  description?: string;
}

function loadModel(props: ModelProps): void {
  // Implementation
}
```

### Code Structure Standards

- Use functional components with hooks
- Keep components focused on single responsibilities
- Separate business logic from UI components
- Use consistent file naming (PascalCase for components)

### CSS and Styling Standards

- Use Material UI's theming system
- Implement responsive design using breakpoints
- Follow consistent spacing and typography
- Use semantic color variables

### Testing Standards

Future test implementation should follow:

- Unit tests for utility functions
- Component tests for UI components
- Integration tests for complex features
- End-to-end tests for critical user journeys 