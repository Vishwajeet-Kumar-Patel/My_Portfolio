import React, { memo, useRef, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import ThreeErrorBoundary from "../ThreeErrorBoundary";

const Stars = (props) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  return (
    <div className="w-fill h-auto absolute inset-0 z-[-1]">
      <ThreeErrorBoundary fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 1] }}
          dpr={Math.min(window.devicePixelRatio, 1.5)}
          gl={{ 
            preserveDrawingBuffer: true,
            antialias: false // Disable for performance in background
          }}
          onError={(error) => {
            console.warn("Stars Canvas error:", error);
          }}
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
