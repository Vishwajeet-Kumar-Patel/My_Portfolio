import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Decal, Float, OrbitControls, Preload, useTexture } from "@react-three/drei";
import CanvasLoader from "../Loader";
import { useFrame } from "@react-three/fiber";
import { createSafeIcosahedronGeometry } from "../../utils/threeHelpers";
import ThreeErrorBoundary from "../ThreeErrorBoundary";
import { useThreeD } from "../../contexts/ThreeDContext";
import webglManager from "../../utils/webglManager";

const Ball = (props) => {
  const [decal] = useTexture([props.imgUrl]);
  const meshRef = React.useRef();
  const [geometry, setGeometry] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  // Create and sanitize geometry
  useEffect(() => {
    const geo = createSafeIcosahedronGeometry(1, 1);
    setGeometry(geo);
  }, []);

  // Rotate decal over time with performance monitoring
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.01;  // Adjust the rotation speed if necessary
    }
  });

  // Monitor performance and simplify if needed
  useEffect(() => {
    if (meshRef.current) {
      let frameCount = 0;
      let lastTime = performance.now();
      let isActive = true;

      const checkPerformance = () => {
        if (!isActive) return;
        
        frameCount++;
        const currentTime = performance.now();
        
        if (frameCount % 60 === 0) { // Check every 60 frames
          const fps = 1000 / ((currentTime - lastTime) / 60);
          lastTime = currentTime;
          
          if (fps < 20) { // If FPS is too low
            console.warn("Ball component performance degraded, FPS:", fps);
            // Could trigger parent component to switch to 2D mode
          }
        }
        
        if (isActive) {
          requestAnimationFrame(checkPerformance);
        }
      };
      
      checkPerformance();
      
      return () => {
        isActive = false;
      };
    }
  }, [geometry]);

  if (!geometry) {
    return null; // Don't render until geometry is ready
  }

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={isMobile ? 0.6 : 0.4} />
      <directionalLight 
        position={[0, 0, 0.25]} 
        intensity={isMobile ? 0.4 : 0.6} 
        castShadow={!isMobile}
      />
      <mesh 
        ref={meshRef} 
        castShadow={!isMobile} 
        receiveShadow={!isMobile} 
        scale={2.75} 
        geometry={geometry}
      >
        <meshStandardMaterial
          color="#fff8eb"
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal
          map={decal}
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          flatShading
        />
      </mesh>
    </Float>
  );
};

const BallCanvas = ({ icon }) => {
  const [hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [shouldUseFallback, setShouldUseFallback] = useState(false);
  const [contextId] = useState(() => Math.random().toString(36).substr(2, 9));
  const { threeDEnabled, reportError } = useThreeD();

  useEffect(() => {
    // Get system status from WebGL manager
    const systemStatus = webglManager.getSystemStatus();
    console.log('Ball Canvas - System Status:', systemStatus);

    // Check if we can create a WebGL context
    const canCreate = webglManager.canCreateContext('Ball');
    if (!canCreate) {
      console.log('Ball Canvas: WebGL Manager denied context creation - system is in performance protection mode');
      setShouldUseFallback(true);
      return;
    }

    // Listen for system degradation events
    const handleSystemDegraded = (event) => {
      console.warn('Ball Canvas: System degraded, switching to fallback');
      setShouldUseFallback(true);
    };

    const handleSystemRecovered = () => {
      console.log('Ball Canvas: System recovered, checking if we can render');
      setShouldUseFallback(!webglManager.canCreateContext('Ball'));
    };

    window.addEventListener('webgl-system-degraded', handleSystemDegraded);
    window.addEventListener('webgl-system-recovered', handleSystemRecovered);

    return () => {
      window.removeEventListener('webgl-system-degraded', handleSystemDegraded);
      window.removeEventListener('webgl-system-recovered', handleSystemRecovered);
      webglManager.unregisterContext('Ball', contextId);
    };
  }, [contextId]);

  useEffect(() => {
    // Check if device is mobile or low performance
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    // Check for low performance indicators
    const isLowPerf = mediaQuery.matches || 
                     navigator.hardwareConcurrency <= 2 || 
                     navigator.deviceMemory <= 4 ||
                     /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsLowPerformance(isLowPerf);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
      setIsLowPerformance(event.matches || isLowPerf);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  const handleCanvasError = (error) => {
    console.error("Ball Canvas error:", error);
    webglManager.reportFailure('Ball', error);
    reportError();
    setHasError(true);
    setShouldUseFallback(true);
  };

  // If 3D is disabled globally, this component has errors, device is low performance, or WebGL manager says to fallback
  if (!threeDEnabled || hasError || isLowPerformance || shouldUseFallback) {
    return (
      <div 
        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-full border border-purple-500/30 backdrop-blur-sm"
        style={{ 
          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          border: '1px solid rgba(147, 51, 234, 0.3)',
          borderRadius: '50%',
          backdropFilter: 'blur(4px)'
        }}
      >
        <img 
          src={icon} 
          alt="Technology" 
          className="w-3/5 h-3/5 object-contain filter brightness-90 hover:brightness-110 transition-all duration-300"
          loading="lazy"
          onError={(e) => {
            // Fallback for broken images
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `
              <div style="
                width: 60%; 
                height: 60%; 
                background: linear-gradient(45deg, #9333ea, #3b82f6); 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                color: white; 
                font-size: 12px; 
                font-weight: bold;
              ">
                Tech
              </div>
            `;
          }}
        />
      </div>
    );
  }

  return (
    <ThreeErrorBoundary fallback={
      <div 
        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-full border border-purple-500/30"
      >
        <img 
          src={icon} 
          alt="Technology" 
          className="w-3/5 h-3/5 object-contain filter brightness-90"
          loading="lazy"
        />
      </div>
    }>
      <Canvas 
        frameloop="demand" 
        gl={{ 
          preserveDrawingBuffer: true,
          antialias: false, // Always disable for performance
          alpha: false,
          premultipliedAlpha: false,
          powerPreference: "default", // Always use default for stability
          failIfMajorPerformanceCaveat: true // Fail gracefully on low performance
        }}
        dpr={1} // Always use 1 for stability
        camera={{
          fov: 75,
          near: 0.1,
          far: 200,
          position: [0, 0, 5]
        }}
        onError={handleCanvasError}
        onCreated={(state) => {
          // Register with WebGL manager
          const registered = webglManager.registerContext('Ball', contextId);
          if (!registered) {
            console.warn("Ball Canvas: Failed to register with WebGL Manager");
            handleCanvasError(new Error("WebGL Manager denied context"));
            return;
          }

          // Set a timeout to fallback if Canvas takes too long
          const timeout = setTimeout(() => {
            console.warn("Ball Canvas creation timeout, falling back to 2D");
            handleCanvasError(new Error("Canvas creation timeout"));
          }, 3000);

          // Clear timeout on successful creation
          if (state.gl) {
            clearTimeout(timeout);
            state.gl.setClearColor(0x000000, 0);
            console.log("Ball Canvas: Successfully created with WebGL Manager");
          } else {
            clearTimeout(timeout);
            handleCanvasError(new Error("WebGL context not available"));
          }
        }}
      >
        <Suspense fallback={null}>
          <OrbitControls enableZoom={false} />
          <Ball imgUrl={icon} />
        </Suspense>
        <Preload all />
      </Canvas>
    </ThreeErrorBoundary>
  );
};

export default BallCanvas;
