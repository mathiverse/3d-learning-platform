import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useParams } from 'react-router-dom';

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
    const renderer = new THREE.WebGLRenderer();

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
    <div className="model-viewer">
      <div ref={mountRef} />
      <div className="model-info">
        <h2>Discipline: {discipline}</h2>
        <p>Model ID: {modelId}</p>
      </div>
    </div>
  );
};

export default ModelViewer; 