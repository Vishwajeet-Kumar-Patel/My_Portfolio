import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const Earth = () => {
  // Error state to capture loading issues
  const [hasError, setHasError] = useState(false);

  const earth = useGLTF("./models/desktop_pc_mobile/scene.gltf", (state) => {
    // Check for errors in the loading process
    if (state.errors.length > 0) {
      console.error("GLTF model loading errors:", state.errors);
      setHasError(true); // Set error state to true if there are loading issues
    }
  });

  if (hasError) {
    return <div>Error loading model</div>; // Display an error message
  }

  return <primitive key="earth" object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />;
};

const EarthCanvas = () => {
  return (
    <Canvas
      shadows
      frameloop="demand"
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <Preload all />
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth />
      </Suspense>
    </Canvas>
  );
};

export default EarthCanvas;
