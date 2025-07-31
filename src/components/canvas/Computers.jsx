import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import CanvasLoader from "../Loader";
import ThreeErrorBoundary from "../ThreeErrorBoundary";
import { useThreeD } from "../../contexts/ThreeDContext";
import { useSafeGLTF } from "../../utils/useSafeGLTF";

const DeveloperModel = ({ isMobile }) => {
  const { scene, error, isProcessing } = useSafeGLTF("https://modelviewer.dev/shared-assets/models/RobotExpressive.glb");
  const [hasTimeout, setHasTimeout] = useState(false);

  // Log any loading errors
  useEffect(() => {
    if (error) {
      console.error("GLTF Model loading error:", error);
    }
  }, [error]);

  // Set timeout for model loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!scene && !error && !isProcessing) {
        console.warn("Model loading timeout, showing fallback");
        setHasTimeout(true);
      }
    }, 15000); // 15 second timeout (increased for processing time)

    return () => clearTimeout(timer);
  }, [scene, error, isProcessing]);

  // Show nothing if there's an error, timeout, or still processing
  if (!scene || error || hasTimeout || isProcessing) {
    if (error) {
      console.error("Failed to load 3D model:", error);
    }
    return null;
  }

  return (
    <>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <ambientLight intensity={0.3} />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <primitive
        object={scene}
        scale={isMobile ? 0.25 : 0.3}
        position={isMobile ? [0, -1.4, 0] : [0, -1.5, 0]} // Moved slightly up
        rotation={[0, Math.PI, 0]} // 180° Y-axis
      />

      <OrbitControls
        enableZoom={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [webglError, setWebglError] = useState(false);
  const { threeDEnabled, reportError } = useThreeD();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);
    const handleMediaQueryChange = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  // Handle WebGL context loss
  const handleWebGLContextLost = (event) => {
    console.warn("WebGL context lost, preventing default and attempting recovery");
    event.preventDefault();
    setWebglError(true);
    reportError();
    
    // Attempt to recover after a delay
    setTimeout(() => {
      setWebglError(false);
    }, 2000);
  };

  const handleWebGLContextRestored = () => {
    console.log("WebGL context restored");
    setWebglError(false);
  };

  const handleCanvasError = (error) => {
    console.error("Canvas error:", error);
    reportError();
    setWebglError(true);
  };

  // If 3D is disabled globally or WebGL has issues, show a fallback
  if (!threeDEnabled || webglError) {
    return (
      <div 
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#888',
          fontSize: '14px',
          textAlign: 'center'
        }}
      >
        {!threeDEnabled ? '3D rendering disabled for stability' : '3D model temporarily unavailable'}
        <br />
        <small>{webglError && 'Refreshing in a moment...'}</small>
      </div>
    );
  }

  return (
    <ThreeErrorBoundary fallback="3D model failed to load">
      <Canvas
        frameloop="demand"
        shadows
        dpr={isMobile ? [1, 1.0] : [1, 1.5]}
        camera={{
          position: isMobile ? [0, 1.2, 5.5] : [0, 1.6, 6.5],
          fov: 35,
        }}
        gl={{ 
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false
        }}
        onError={handleCanvasError}
        onCreated={(state) => {
          // Add WebGL context event listeners
          const canvas = state.gl.domElement;
          canvas.addEventListener('webglcontextlost', handleWebGLContextLost);
          canvas.addEventListener('webglcontextrestored', handleWebGLContextRestored);
          
          // Store for cleanup
          state.gl.domElement._eventListeners = {
            contextlost: handleWebGLContextLost,
            contextrestored: handleWebGLContextRestored
          };
        }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
          <DeveloperModel isMobile={isMobile} />
        </Suspense>
        <Preload all />
      </Canvas>
    </ThreeErrorBoundary>
  );
};

export default ComputersCanvas;
