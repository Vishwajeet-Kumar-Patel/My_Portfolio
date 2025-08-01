import React, { memo, useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import ThreeErrorBoundary from "../ThreeErrorBoundary";
import webglManager from "../../utils/webglManager";

const Stars = (props) => {
  const ref = useRef();
  const [sphere, setSphere] = useState(null);
  const [devicePerformance, setDevicePerformance] = useState('high');

  useEffect(() => {
    // Detect device performance
    const detectPerformance = () => {
      const cores = navigator.hardwareConcurrency || 2;
      const memory = navigator.deviceMemory || 4;
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile || cores < 4 || memory < 4) {
        return 'low';
      } else if (cores < 8 || memory < 8) {
        return 'medium';
      } else {
        return 'high';
      }
    };

    const performance = detectPerformance();
    setDevicePerformance(performance);

    // Create sphere with performance-based density
    let starCount, radius;
    switch (performance) {
      case 'low':
        starCount = 1000;
        radius = 1.0;
        break;
      case 'medium':
        starCount = 2500;
        radius = 1.1;
        break;
      default:
        starCount = 5000;
        radius = 1.2;
    }

    try {
      const sphereData = random.inSphere(new Float32Array(starCount), { radius });
      setSphere(sphereData);
    } catch (error) {
      console.warn("Failed to create stars sphere:", error);
      // Fallback to smaller star field
      const fallbackSphere = random.inSphere(new Float32Array(500), { radius: 1.0 });
      setSphere(fallbackSphere);
    }
  }, []);

  useFrame((state, delta) => {
    if (ref.current && sphere) {
      const rotationSpeed = devicePerformance === 'low' ? 0.5 : 1;
      ref.current.rotation.x -= (delta / 10) * rotationSpeed;
      ref.current.rotation.y -= (delta / 15) * rotationSpeed;
    }
  });

  if (!sphere) {
    return null; // Don't render until sphere is ready
  }

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={devicePerformance === 'low' ? 0.003 : 0.002}
          sizeAttenuation={devicePerformance !== 'low'}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  const [hasError, setHasError] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [contextId] = useState(() => Math.random().toString(36).substr(2, 9));

  const handleCanvasError = (error) => {
    console.warn("Stars Canvas error:", error);
    webglManager.reportFailure('Stars', error);
    setHasError(true);
  };

  const handleCanvasCreated = (state) => {
    try {
      // Register with WebGL manager (Stars get priority as background)
      const registered = webglManager.registerContext('Stars', contextId);
      if (!registered) {
        console.warn("Stars Canvas: Failed to register with WebGL Manager");
        setHasError(true);
        return;
      }

      if (!state.gl) {
        throw new Error("WebGL context not available for Stars");
      }
      
      // Set timeout for canvas creation
      const timeout = setTimeout(() => {
        console.warn("Stars Canvas creation timeout");
        setHasError(true);
      }, 2000);

      // Clear timeout on successful creation
      if (state.gl.getExtension) {
        clearTimeout(timeout);
        setCanvasReady(true);
        
        // Optimize for background rendering
        state.gl.setClearColor(0x000000, 0);
        state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        console.log("Stars Canvas: Successfully created with WebGL Manager");
      } else {
        clearTimeout(timeout);
        setHasError(true);
      }
    } catch (error) {
      console.warn("Error setting up Stars Canvas:", error);
      webglManager.reportFailure('Stars', error);
      setHasError(true);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      webglManager.unregisterContext('Stars', contextId);
    };
  }, [contextId]);

  if (hasError) {
    // Silent fallback - no stars background
    return <div className="w-fill h-auto absolute inset-0 z-[-1] bg-gradient-to-b from-black via-gray-900 to-black" />;
  }

  return (
    <div className="w-fill h-auto absolute inset-0 z-[-1]">
      <ThreeErrorBoundary 
        fallback={<div className="w-fill h-auto absolute inset-0 z-[-1] bg-gradient-to-b from-black via-gray-900 to-black" />}
        onError={handleCanvasError}
      >
        <Canvas
          camera={{ position: [0, 0, 1] }}
          dpr={1} // Fixed DPR for stability
          gl={{ 
            preserveDrawingBuffer: true,
            antialias: false, // Always disabled for background performance
            alpha: false,
            premultipliedAlpha: false,
            powerPreference: "default", // Stable preference
            failIfMajorPerformanceCaveat: true // Fail gracefully on low performance
          }}
          onError={handleCanvasError}
          onCreated={handleCanvasCreated}
        >
          <Suspense fallback={null}>
            <Stars />
          </Suspense>
          <Preload all />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
};

export default memo(StarsCanvas);
