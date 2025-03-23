# EduDive - Interactive 3D Learning Platform

![EduDive Logo](/public/icons/favicon.svg)

## Table of Contents

- [Executive Summary](#executive-summary)
- [Project Overview](#project-overview)
- [Features](#features)
- [Technical Architecture](#technical-architecture)
- [User Guide](#user-guide)
- [Development Guide](#development-guide)
- [Roadmap](#roadmap)
- [Appendix](#appendix)

## Executive Summary

EduDive is an educational web application designed to revolutionize engineering education through interactive 3D visualizations. The platform provides students and educators with manipulable 3D models across multiple engineering disciplines including mechanical, civil, and electrical engineering. By visualizing complex engineering concepts in an interactive 3D environment, EduDive aims to enhance comprehension and retention of technical subject matter.

The application is built using modern web technologies including React with TypeScript, Three.js for 3D rendering, and Material UI for the user interface. It includes features such as interactive 3D model viewing, discipline-based model organization, progress tracking, and theme customization.

## Project Overview

### Purpose and Vision

EduDive addresses the challenge of visualizing abstract engineering concepts by providing a platform where students can interact with 3D models of engineering components and systems. The platform serves as a supplementary learning tool to traditional engineering education, enabling students to explore concepts at their own pace.

### Target Audience

- Engineering students across various disciplines
- Engineering educators and instructors
- Educational institutions offering engineering programs
- Self-learners interested in engineering concepts

### Value Proposition

- Enhanced understanding through visual and interactive learning
- Improved knowledge retention through hands-on manipulation of 3D models
- Cross-discipline exposure to different engineering concepts
- Self-paced learning with progress tracking
- Accessible education through web-based delivery

## Features

### Core Features

#### Interactive 3D Model Viewer

- **Description**: Central feature allowing users to view and manipulate 3D engineering models
- **Capabilities**:
  - Zoom, rotate, and pan controls
  - Wireframe viewing mode
  - Full-screen mode
  - Screenshot capture
  - Reset view option
  - Automatic camera controls

#### Discipline-Based Model Organization

- **Description**: Organization of 3D models into engineering disciplines
- **Current Disciplines**:
  - Mechanical Engineering
  - Civil Engineering
  - Electrical Engineering
- **Model Structure**:
  - Each discipline contains multiple models
  - Models include metadata (title, description, learning objectives)

#### User Interface Components

- **Dashboard**: Entry point displaying available engineering disciplines
- **Navigation**: Main navigation with discipline selection and user controls
- **Theme Toggle**: Dark/light mode theme customization
- **Responsive Design**: Optimized for both desktop and mobile devices

#### Learning Tools

- **Learning Model Sidebar**: Contextual information about the currently viewed model
- **Course Progress Tracking**: Tracking of completed models and learning progress
- **Discipline-Specific Backgrounds**: Visual cues indicating the current discipline

### Additional Features

- **User Settings**: Personalized application settings
- **Animated Backgrounds**: Visual enhancements for the user interface
- **Custom UI Components**: Specially designed buttons, tooltips, and controls
- **Error Recovery**: Not Found page and error handling

## Technical Architecture

### Technology Stack

#### Frontend Framework
- **React 18**: Component-based UI library
- **TypeScript**: Static typing for improved code quality
- **React Router**: Client-side routing

#### Build and Development
- **Vite**: Modern build tool and development server
- **ESLint**: Code quality enforcement

#### UI Components
- **Material UI**: React component library following Material Design
- **Custom Components**: Application-specific UI components

#### 3D Rendering
- **Three.js**: JavaScript 3D library
- **OrbitControls**: Camera control system
- **GLTFLoader**: 3D model loading

### Code Structure

```
edudive/
├── public/             # Static assets and 3D models
│   └── icons/          # Application icons
│   └── models/         # 3D model files (.glb)
├── src/
│   ├── components/     # React components
│   │   ├── ModelViewer.tsx        # 3D model rendering component
│   │   ├── Dashboard.tsx          # Main dashboard page
│   │   ├── Navigation.tsx         # Navigation component
│   │   ├── LearningModelSidebar.tsx # Model information sidebar
│   │   ├── SettingsPage.tsx       # User settings
│   │   └── ...                    # Other UI components
│   ├── hooks/          # Custom React hooks
│   ├── models/         # Data models and schemas
│   ├── styles/         # CSS and styling
│   ├── theme/          # MUI theme configuration
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
└── dist/               # Built files (created during build)
```

### Data Models

The application uses the following data structures:

#### StudentProgress
```typescript
{
  id: string;
  userId: string;
  discipline: string;
  completedModels: string[];
  quizScores: number[];
  lastAccessed: Date;
  totalTimeSpent: number;
}
```

#### Model3D
```typescript
{
  id: string;
  name: string;
  discipline: string;
  difficulty: number;
  modelUrl: string;
  description: string;
  learningObjectives: string[];
}
```

### Key Components

#### ModelViewer
The core component responsible for rendering and manipulating 3D models:
- Handles 3D scene creation and management
- Implements camera controls
- Provides UI for model interaction
- Manages model loading and rendering

#### Dashboard
The entry point for users:
- Displays available engineering disciplines
- Provides access to different model categories
- Shows visual representations of disciplines

#### Navigation
Controls the application navigation:
- Discipline selection
- User settings
- Theme toggle
- Application branding

## User Guide

### Getting Started

1. **Access the Application**: Open the application in a web browser
2. **Dashboard Navigation**: From the dashboard, select an engineering discipline
3. **Model Selection**: Choose a specific model within the discipline
4. **Interacting with Models**: Use the following controls:
   - Left-click and drag to rotate
   - Right-click and drag to pan
   - Scroll wheel to zoom
   - Toolbar controls for additional features

### Model Viewer Controls

- **Zoom In/Out**: Magnify or reduce the model view
- **Reset View**: Return to the default camera position
- **Wireframe Toggle**: Switch between solid and wireframe view
- **Screenshot**: Capture the current view
- **Fullscreen**: Expand to fullscreen mode
- **Information Panel**: Toggle sidebar with model information

### Course Progress

- Access the Progress page to view completed models
- Track progress across different disciplines
- View time spent on different models

### Settings

- **Theme Preferences**: Toggle between light and dark mode
- **User Profile**: Update user information
- **Notification Settings**: Manage application notifications

## Development Guide

### Prerequisites

- Node.js 18+
- npm or yarn

### Setting Up the Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd edudive

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
# Build the application
npm run build
```

### Project Structure Conventions

- Component files are named with PascalCase (.tsx)
- Utility functions are grouped by purpose in hooks directory
- Styling follows Material UI theming patterns
- Models define data structures and API interfaces

### Adding New Models

1. Add the 3D model file (.glb) to the appropriate discipline folder in `/public/models/`
2. Update the model configuration in `ModelViewer.tsx` to include the new model
3. Add appropriate metadata (title, description, learning objectives)

## Roadmap

### Short-term Goals

- Expand the model library for each discipline
- Implement user authentication and profiles
- Add interactive quizzes and assessments
- Improve mobile experience

### Medium-term Goals

- Add more engineering disciplines (chemical, aerospace, etc.)
- Implement collaborative features
- Create an instructor dashboard
- Develop API for third-party model integration

### Long-term Vision

- Establish a community for model sharing
- Integrate with learning management systems
- Develop VR/AR capabilities
- Support custom model uploads

## Appendix

### Technology Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Three.js Documentation](https://threejs.org/docs/)
- [Material UI Documentation](https://mui.com/getting-started/usage/)

### Glossary

- **GLB/GLTF**: 3D model file formats
- **Three.js**: JavaScript 3D library
- **OrbitControls**: Camera control system for Three.js
- **Wireframe**: Rendering mode showing only the edges of the 3D model
- **Responsive Design**: Design approach for supporting multiple device sizes 