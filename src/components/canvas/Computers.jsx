import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const DeveloperModel = ({ isMobile }) => {
  const { scene } = useGLTF("https://modelviewer.dev/shared-assets/models/RobotExpressive.glb");
  

  useEffect(() => {
    if (!scene) {
      console.warn("Scene not loaded properly.");
    }
  }, [scene]);

  if (!scene) return null;

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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);
    const handleMediaQueryChange = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  return (
    <Canvas
  frameloop="demand"
  shadows
  dpr={isMobile ? [1, 1.0] : [1, 1.5]}
  camera={{
  position: isMobile ? [0, 1.2, 5.5] : [0, 1.6, 6.5],
  fov: 35,
}}

  gl={{ preserveDrawingBuffer: true }}
>
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
        <DeveloperModel isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
