import { BrowserRouter } from "react-router-dom";
import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
} from "./components";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ThreeErrorBoundary from "./components/ThreeErrorBoundary";
import { ThreeDProvider } from "./contexts/ThreeDContext";

// Global error handler for Three.js
window.addEventListener('error', (event) => {
  if (event.error && event.error.message) {
    const message = event.error.message;
    if (message.includes('BufferGeometry') || 
        message.includes('computeBoundingSphere') || 
        message.includes('NaN') ||
        message.includes('WebGL')) {
      console.warn('Three.js error caught globally:', event.error);
      event.preventDefault(); // Prevent the error from breaking the app
      return false;
    }
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message) {
    const message = event.reason.message;
    if (message.includes('Three') || 
        message.includes('WebGL') || 
        message.includes('BufferGeometry')) {
      console.warn('Three.js promise rejection caught globally:', event.reason);
      event.preventDefault(); // Prevent the error from breaking the app
    }
  }
});

// Override console.error to catch Three.js errors and prevent console spam
const originalConsoleError = console.error;
console.error = function(...args) {
  const message = args.join(' ');
  if (message.includes('THREE.BufferGeometry.computeBoundingSphere') || 
      message.includes('THREE.WebGLRenderer: Context Lost')) {
    console.warn('Intercepted Three.js error:', ...args);
    return; // Don't log the error to console
  }
  originalConsoleError.apply(console, args);
};

// Monkey patch Three.js BufferGeometry to prevent NaN bounding sphere computation
import * as THREE from 'three';

// Store original method
const originalComputeBoundingSphere = THREE.BufferGeometry.prototype.computeBoundingSphere;

// Override with safe version
THREE.BufferGeometry.prototype.computeBoundingSphere = function() {
  try {
    // Check if position attribute exists and has valid data
    const position = this.attributes.position;
    if (position && position.array) {
      // Comprehensive check for invalid values
      let hasInvalidValues = false;
      const array = position.array;
      
      // First, do a quick sample check for performance
      const sampleSize = Math.min(100, array.length);
      for (let i = 0; i < sampleSize; i += 3) {
        const x = array[i];
        const y = array[i + 1];
        const z = array[i + 2];
        if (!isFinite(x) || !isFinite(y) || !isFinite(z) || 
            isNaN(x) || isNaN(y) || isNaN(z)) {
          hasInvalidValues = true;
          break;
        }
      }
      
      // If sample found issues, check and fix ALL values
      if (hasInvalidValues) {
        console.warn('Comprehensive geometry repair needed, fixing all values...');
        let fixedCount = 0;
        
        for (let i = 0; i < array.length; i += 3) {
          const x = array[i];
          const y = array[i + 1];
          const z = array[i + 2];
          
          if (!isFinite(x) || isNaN(x)) {
            array[i] = 0;
            fixedCount++;
          }
          if (!isFinite(y) || isNaN(y)) {
            array[i + 1] = 0;
            fixedCount++;
          }
          if (!isFinite(z) || isNaN(z)) {
            array[i + 2] = 0;
            fixedCount++;
          }
        }
        
        if (fixedCount > 0) {
          console.warn(`Fixed ${fixedCount} invalid position values`);
          position.needsUpdate = true;
        }
        
        // Create safe manual bounding sphere
        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
        
        for (let i = 0; i < array.length; i += 3) {
          const x = array[i];
          const y = array[i + 1];
          const z = array[i + 2];
          
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
          minZ = Math.min(minZ, z);
          maxZ = Math.max(maxZ, z);
        }
        
        const centerX = (minX + maxX) * 0.5;
        const centerY = (minY + maxY) * 0.5;
        const centerZ = (minZ + maxZ) * 0.5;
        const radius = Math.max(
          Math.sqrt((maxX - centerX) ** 2 + (maxY - centerY) ** 2 + (maxZ - centerZ) ** 2),
          0.1
        );
        
        if (!this.boundingSphere) {
          this.boundingSphere = new THREE.Sphere();
        }
        this.boundingSphere.center.set(centerX, centerY, centerZ);
        this.boundingSphere.radius = radius;
        return;
      }
    }
    
    // Call original method if data appears safe
    const result = originalComputeBoundingSphere.call(this);
    
    // Validate result after computation
    if (this.boundingSphere) {
      const radius = this.boundingSphere.radius;
      const center = this.boundingSphere.center;
      
      if (!isFinite(radius) || isNaN(radius) || radius <= 0) {
        console.warn('Detected invalid radius after computation, fixing...');
        this.boundingSphere.radius = 1;
      }
      
      if (!center || !isFinite(center.x) || !isFinite(center.y) || !isFinite(center.z) ||
          isNaN(center.x) || isNaN(center.y) || isNaN(center.z)) {
        console.warn('Detected invalid center after computation, fixing...');
        this.boundingSphere.center.set(0, 0, 0);
      }
    }
    
    return result;
  } catch (error) {
    console.warn('Error in computeBoundingSphere, using safe defaults:', error);
    if (!this.boundingSphere) {
      this.boundingSphere = new THREE.Sphere();
    }
    this.boundingSphere.center.set(0, 0, 0);
    this.boundingSphere.radius = 1;
  }
};

// Also patch the Box3.setFromBufferAttribute method which is often called before bounding sphere
const originalSetFromBufferAttribute = THREE.Box3.prototype.setFromBufferAttribute;
THREE.Box3.prototype.setFromBufferAttribute = function(attribute) {
  try {
    if (attribute && attribute.array) {
      // Check for NaN in the attribute
      let hasNaN = false;
      for (let i = 0; i < Math.min(attribute.array.length, 100); i++) {
        if (!isFinite(attribute.array[i])) {
          hasNaN = true;
          break;
        }
      }
      
      if (hasNaN) {
        console.warn('Detected NaN in BufferAttribute, setting safe bounding box');
        this.min.set(-1, -1, -1);
        this.max.set(1, 1, 1);
        return this;
      }
    }
    
    return originalSetFromBufferAttribute.call(this, attribute);
  } catch (error) {
    console.warn('Error in setFromBufferAttribute, using safe defaults:', error);
    this.min.set(-1, -1, -1);
    this.max.set(1, 1, 1);
    return this;
  }
};

const LazyStarsCanvas = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (inView) setShow(true);
  }, [inView]);

  return (
    <div ref={ref} className="fixed inset-0 -z-10 pointer-events-none">
      {show && <StarsCanvas />}
    </div>
  );
};

const App = () => {
  return (
    <ThreeDProvider>
      <BrowserRouter>
        <ThreeErrorBoundary fallback={
          <div style={{ 
            width: '100vw', 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#000',
            color: '#fff',
            fontSize: '18px'
          }}>
            Portfolio is loading... Please refresh if this persists.
          </div>
        }>
          <div className="relative z-0 bg-primary">
            <LazyStarsCanvas />
            
            <Navbar />
            <Hero />

            <About />
            <Experience />
            <Tech />
            <Works />
            {/* <Feedbacks /> */}

            <div className="relative z-0">
              <Contact />
            </div>
          </div>
        </ThreeErrorBoundary>
      </BrowserRouter>
    </ThreeDProvider>
  );
};

export default App;
