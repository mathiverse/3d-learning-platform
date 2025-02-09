import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DisciplineBackgroundProps {
  discipline: string;
}

const DisciplineBackground: React.FC<DisciplineBackgroundProps> = ({ discipline }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Discipline-specific configurations
    const config = {
      mechanical: {
        geometries: [
          new THREE.TorusGeometry(1, 0.3, 16, 100), // Gear-like shape
          new THREE.CylinderGeometry(0.5, 0.5, 2, 32), // Shaft
          new THREE.TorusKnotGeometry(0.5, 0.2, 64, 8) // Complex mechanical part
        ],
        color: '#2196f3',
        rotationSpeed: 0.01,
        particleCount: 15
      },
      civil: {
        geometries: [
          new THREE.BoxGeometry(1, 2, 1), // Building
          new THREE.ConeGeometry(1, 2, 4), // Roof/pyramid
          new THREE.BoxGeometry(2, 0.2, 2) // Foundation/platform
        ],
        color: '#4caf50',
        rotationSpeed: 0.005,
        particleCount: 10
      },
      electrical: {
        geometries: [
          new THREE.IcosahedronGeometry(0.5, 0), // Electron-like
          new THREE.TorusGeometry(0.7, 0.2, 16, 100), // Circuit path
          new THREE.TetrahedronGeometry(0.5) // Energy symbol
        ],
        color: '#f44336',
        rotationSpeed: 0.015,
        particleCount: 20
      }
    };

    const disciplineConfig = config[discipline as keyof typeof config] || config.mechanical;
    const meshes: THREE.Mesh[] = [];

    // Create multiple instances of each geometry with more interesting materials
    disciplineConfig.geometries.forEach((geometry) => {
      for (let i = 0; i < disciplineConfig.particleCount; i++) {
        const material = new THREE.MeshPhongMaterial({
          color: disciplineConfig.color,
          wireframe: true,
          transparent: true,
          opacity: 0.6,
          shininess: 100
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        // Spread objects in a more interesting pattern
        const radius = 10 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 2;
        
        mesh.position.set(
          radius * Math.sin(theta) * Math.cos(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(theta)
        );

        mesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );

        mesh.scale.setScalar(Math.random() * 0.5 + 0.5);
        
        meshes.push(mesh);
        scene.add(mesh);
      }
    });

    // Add ambient and directional light for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    camera.position.z = 20;

    // More dynamic animation
    const animate = () => {
      requestAnimationFrame(animate);

      meshes.forEach((mesh, i) => {
        // Create more complex rotations
        mesh.rotation.x += disciplineConfig.rotationSpeed * (1 + Math.sin(i * 0.1));
        mesh.rotation.y += disciplineConfig.rotationSpeed * 1.5 * (1 + Math.cos(i * 0.1));
        mesh.rotation.z += disciplineConfig.rotationSpeed * 0.5;

        // Add subtle position animation
        mesh.position.y += Math.sin(Date.now() * 0.001 + i) * 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      meshes.forEach(mesh => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, [discipline]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        opacity: 0.8,
        background: `linear-gradient(to bottom right, ${discipline === 'mechanical' ? '#e3f2fd' : 
          discipline === 'civil' ? '#e8f5e9' : 
          '#ffebee'} 0%, transparent 100%)`
      }}
    />
  );
};

export default DisciplineBackground; 