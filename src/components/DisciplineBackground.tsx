import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SxProps, Theme, Box, useTheme } from '@mui/material';

// Discipline-specific configurations
const disciplineConfigs = {
  mechanical: {
    color: '#f44336', // Red
    particleCount: 8, // Reduced from 15
    particleSize: 0.1,
    lineColor: '#ff7961', // Lighter red for lines
    rotationSpeed: 0.0005
  },
  civil: {
    color: '#2196f3', // Blue
    particleCount: 6, // Reduced from 10
    particleSize: 0.12,
    lineColor: '#90caf9', // Lighter blue for lines
    rotationSpeed: 0.0003
  },
  electrical: {
    color: '#ffc107', // Amber
    particleCount: 8, // Reduced from 20
    particleSize: 0.08,
    lineColor: '#ffe082', // Lighter amber for lines
    rotationSpeed: 0.0007
  }
};

interface DisciplineBackgroundProps {
  discipline: 'mechanical' | 'civil' | 'electrical';
  opacity?: number;
  sx?: SxProps<Theme>;
}

const DisciplineBackground: React.FC<DisciplineBackgroundProps> = ({ discipline, opacity = 0.2, sx }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      70,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Get discipline config
    const config = disciplineConfigs[discipline];
    
    // Create particles
    const particles = new THREE.Group();
    scene.add(particles);
    
    const particleGeometry = new THREE.SphereGeometry(config.particleSize, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ 
      color: new THREE.Color(config.color),
      transparent: true,
      opacity: 0.4 // Reduced from 0.6
    });
    
    // Create lines between particles
    const linesMaterial = new THREE.LineBasicMaterial({ 
      color: new THREE.Color(config.lineColor),
      transparent: true,
      opacity: 0.4 // Reduced from 0.6
    });
    
    const particlePositions: THREE.Vector3[] = [];
    
    // Create the particles
    for (let i = 0; i < config.particleCount; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      // Position particles in a sphere formation
      const radius = 4 + Math.random() * 3; // Increased distance (was 3 + Math.random() * 2)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
      particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
      particle.position.z = radius * Math.cos(phi);
      
      particlePositions.push(particle.position);
      particles.add(particle);
    }
    
    // Create connections between nearby particles
    const linesGeometry = new THREE.BufferGeometry();
    const linePositions: number[] = [];
    
    // Connect particles that are close to each other
    for (let i = 0; i < particlePositions.length; i++) {
      for (let j = i + 1; j < particlePositions.length; j++) {
        const p1 = particlePositions[i];
        const p2 = particlePositions[j];
        
        // Only connect particles within a certain distance
        const distance = p1.distanceTo(p2);
        if (distance < 4) {
          linePositions.push(p1.x, p1.y, p1.z);
          linePositions.push(p2.x, p2.y, p2.z);
        }
      }
    }
    
    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
    particles.add(lines);
    
    // Animation function
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      frameIdRef.current = requestAnimationFrame(animate);
      
      // Rotate the particles
      particles.rotation.x += config.rotationSpeed;
      particles.rotation.y += config.rotationSpeed * 1.5;
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    
    // Start the animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
    };
  }, [discipline, isDarkMode]);
  
  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: opacity,
        pointerEvents: 'none',
        ...sx
      }}
    />
  );
};

export default DisciplineBackground; 