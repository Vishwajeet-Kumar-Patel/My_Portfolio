import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Decal, Float, OrbitControls, Preload, useTexture } from "@react-three/drei";
import CanvasLoader from "../Loader";
import { useFrame } from "@react-three/fiber";
import { createSafeIcosahedronGeometry } from "../../utils/threeHelpers";
import ThreeErrorBoundary from "../ThreeErrorBoundary";
import { useThreeD } from "../../contexts/ThreeDContext";

const Ball = (props) => {
  const [decal] = useTexture([props.imgUrl]);
  const meshRef = React.useRef();
  const [geometry, setGeometry] = useState(null);

  // Create and sanitize geometry
  useEffect(() => {
    const geo = createSafeIcosahedronGeometry(1, 1);
    setGeometry(geo);
  }, []);

  // Rotate decal over time
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.01;  // Adjust the rotation speed if necessary
    }
  });

  if (!geometry) {
    return null; // Don't render until geometry is ready
  }

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.25]} intensity={0.75} />
      <mesh ref={meshRef} castShadow receiveShadow scale={2.75} geometry={geometry}>
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
  const { threeDEnabled, reportError } = useThreeD();

  const handleCanvasError = (error) => {
    console.error("Ball Canvas error:", error);
    reportError();
    setHasError(true);
  };

  // If 3D is disabled globally or this component has errors, show 2D fallback
  if (!threeDEnabled || hasError) {
    return (
      <div 
        style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          borderRadius: '50%',
          border: '2px solid #333'
        }}
      >
        <img 
          src={icon} 
          alt="Technology" 
          style={{ 
            width: '60%', 
            height: '60%', 
            objectFit: 'contain',
            filter: 'brightness(0.8)'
          }} 
        />
      </div>
    );
  }

  return (
    <ThreeErrorBoundary fallback={
      <div 
        style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          borderRadius: '50%',
          border: '2px solid #333'
        }}
      >
        <img 
          src={icon} 
          alt="Technology" 
          style={{ 
            width: '60%', 
            height: '60%', 
            objectFit: 'contain',
            filter: 'brightness(0.8)'
          }} 
        />
      </div>
    }>
      <Canvas 
        frameloop="demand" 
        gl={{ 
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: true
        }}
        onError={handleCanvasError}
        onCreated={(state) => {
          // Additional safety check
          if (!state.gl) {
            handleCanvasError(new Error("WebGL context not available"));
          }
        }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls enableZoom={false} />
          <Ball imgUrl={icon} />
        </Suspense>
        <Preload all />
      </Canvas>
    </ThreeErrorBoundary>
  );
};

export default BallCanvas;
