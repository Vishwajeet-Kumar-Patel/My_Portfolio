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

  // Additional scene processing to fix any geometry issues
  useEffect(() => {
    if (scene) {
      try {
        scene.traverse((child) => {
          if (child.isMesh) {
            // Ensure proper materials
            if (child.material) {
              child.material.side = 2; // DoubleSide to prevent face culling issues
              child.material.needsUpdate = true;
            }
            
            // Comprehensive geometry validation
            if (child.geometry) {
              const geometry = child.geometry;
              
              // Force recompute bounds with safety checks
              try {
                geometry.boundingSphere = null;
                geometry.boundingBox = null;
                
                // Validate position attribute before bounds computation
                if (geometry.attributes.position) {
                  const posArray = geometry.attributes.position.array;
                  let hasInvalidValues = false;
                  
                  for (let i = 0; i < posArray.length; i++) {
                    if (!isFinite(posArray[i]) || isNaN(posArray[i])) {
                      posArray[i] = 0;
                      hasInvalidValues = true;
                    }
                  }
                  
                  if (hasInvalidValues) {
                    geometry.attributes.position.needsUpdate = true;
                    console.warn(`Fixed position values in robot mesh: ${child.name || 'unnamed'}`);
                  }
                }
                
                // Safe bounds computation
                geometry.computeBoundingSphere();
                
                // Validate computed bounds
                if (!geometry.boundingSphere || 
                    !isFinite(geometry.boundingSphere.radius) ||
                    isNaN(geometry.boundingSphere.radius)) {
                  geometry.boundingSphere = {
                    center: { x: 0, y: 0, z: 0 },
                    radius: 1,
                    isSphere: true
                  };
                  console.warn(`Created safe bounding sphere for: ${child.name || 'unnamed'}`);
                }
              } catch (boundsError) {
                console.warn(`Bounds computation failed for ${child.name || 'unnamed'}, using defaults:`, boundsError);
                geometry.boundingSphere = {
                  center: { x: 0, y: 0, z: 0 },
                  radius: 1,
                  isSphere: true
                };
              }
            }
            
            // Fix any skeleton issues for robot animations
            if (child.skeleton) {
              try {
                child.skeleton.bones.forEach(bone => {
                  if (bone.position) {
                    // Ensure bone positions are valid
                    if (!isFinite(bone.position.x) || isNaN(bone.position.x)) bone.position.x = 0;
                    if (!isFinite(bone.position.y) || isNaN(bone.position.y)) bone.position.y = 0;
                    if (!isFinite(bone.position.z) || isNaN(bone.position.z)) bone.position.z = 0;
                  }
                  if (bone.rotation) {
                    if (!isFinite(bone.rotation.x) || isNaN(bone.rotation.x)) bone.rotation.x = 0;
                    if (!isFinite(bone.rotation.y) || isNaN(bone.rotation.y)) bone.rotation.y = 0;
                    if (!isFinite(bone.rotation.z) || isNaN(bone.rotation.z)) bone.rotation.z = 0;
                  }
                  if (bone.scale) {
                    if (!isFinite(bone.scale.x) || isNaN(bone.scale.x)) bone.scale.x = 1;
                    if (!isFinite(bone.scale.y) || isNaN(bone.scale.y)) bone.scale.y = 1;
                    if (!isFinite(bone.scale.z) || isNaN(bone.scale.z)) bone.scale.z = 1;
                  }
                });
                
                // Recalculate skeleton after fixes
                child.skeleton.calculateInverses();
              } catch (skeletonError) {
                console.warn(`Skeleton repair failed for ${child.name || 'unnamed'}:`, skeletonError);
              }
            }
          }
        });
        console.log('Robot scene processing completed successfully');
      } catch (processingError) {
        console.error('Error during robot scene processing:', processingError);
      }
    }
  }, [scene]);

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
  const { threeDEnabled, reportError, errorCount } = useThreeD();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);
    const handleMediaQueryChange = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  // Handle WebGL context loss with better recovery
  const handleWebGLContextLost = (event) => {
    console.warn("WebGL context lost in Computers canvas, preventing default and attempting recovery");
    event.preventDefault();
    setWebglError(true);
    reportError();
    
    // Attempt to recover after a delay with exponential backoff
    const recoveryDelay = Math.min(2000 * Math.pow(2, Math.min(3, errorCount)), 10000);
    setTimeout(() => {
      console.log(`Attempting WebGL context recovery after ${recoveryDelay}ms delay`);
      setWebglError(false);
    }, recoveryDelay);
  };

  const handleWebGLContextRestored = () => {
    console.log("WebGL context restored in Computers canvas");
    setWebglError(false);
  };

  const handleCanvasError = (error) => {
    console.error("Canvas error:", error);
    reportError();
    setWebglError(true);
    
    // Auto-recovery for certain error types
    if (error.message && (
      error.message.includes("WebGL") || 
      error.message.includes("context") ||
      error.message.includes("lost")
    )) {
      setTimeout(() => {
        console.log("Attempting auto-recovery from WebGL error");
        setWebglError(false);
      }, 3000);
    }
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
