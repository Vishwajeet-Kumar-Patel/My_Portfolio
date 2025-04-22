import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const Earth = () => {
  const { scene, errors } = useGLTF("./models/desktop_pc_mobile/scene.gltf");

  // Log errors if the model fails to load
  if (errors && errors.length > 0) {
    console.error("GLTF Model loading errors:", errors);
  }

  useEffect(() => {
    if (scene) {
      // Traverse through all geometries and sanitize NaN values
      scene.traverse((child) => {
        if (child.isMesh && child.geometry) {
          const position = child.geometry.attributes.position;
          if (position) {
            for (let i = 0; i < position.count; i++) {
              if (isNaN(position.getX(i))) position.setX(i, 0);
              if (isNaN(position.getY(i))) position.setY(i, 0);
              if (isNaN(position.getZ(i))) position.setZ(i, 0);
            }
            // Mark geometry as needing an update
            child.geometry.attributes.position.needsUpdate = true;
          }
        }
      });
    }
  }, [scene]);

  return <primitive key="earth" object={scene} scale={2.5} position-y={0} rotation-y={0} />;
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
