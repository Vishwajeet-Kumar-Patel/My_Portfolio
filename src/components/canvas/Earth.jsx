import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";
import { sanitizeScene } from "../../utils/threeHelpers";
import ThreeErrorBoundary from "../ThreeErrorBoundary";

const Earth = () => {
  const { scene, errors } = useGLTF("./models/desktop_pc_mobile/scene.gltf");

  // Log errors if the model fails to load
  if (errors && errors.length > 0) {
    console.error("GLTF Model loading errors:", errors);
  }

  useEffect(() => {
    if (scene) {
      // Use the utility function to sanitize the entire scene
      sanitizeScene(scene);
    }
  }, [scene]);

  return <primitive key="earth" object={scene} scale={2.5} position-y={0} rotation-y={0} />;
};

const EarthCanvas = () => {
  return (
    <ThreeErrorBoundary fallback="3D Earth model failed to load">
      <Canvas
        shadows
        frameloop="demand"
        gl={{ 
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: true
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
        onError={(error) => {
          console.error("Earth Canvas error:", error);
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
    </ThreeErrorBoundary>
  );
};

export default EarthCanvas;
