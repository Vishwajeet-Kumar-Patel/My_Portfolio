import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import { sanitizeScene, validateAndRepairGeometry } from "./threeHelpers";

/**
 * Safe GLTF loader hook that sanitizes the model before returning it
 * @param {string} url - The URL of the GLTF model
 * @returns {object} - The sanitized GLTF data
 */
export const useSafeGLTF = (url) => {
  const { scene, error, ...rest } = useGLTF(url);
  const [sanitizedScene, setSanitizedScene] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!scene || error) {
      setSanitizedScene(null);
      return;
    }

    if (isProcessing) return; // Prevent duplicate processing

    setIsProcessing(true);

    // Process the scene in the next tick to avoid blocking
    setTimeout(() => {
      try {
        // Clone the scene to avoid modifying the original
        const clonedScene = scene.clone();
        
        // First pass: Fix all NaN values in all geometries
        clonedScene.traverse((child) => {
          if (child.isMesh && child.geometry) {
            const geometry = child.geometry;
            
            // Fix position attribute
            if (geometry.attributes.position) {
              const posArray = geometry.attributes.position.array;
              let fixedPos = false;
              for (let i = 0; i < posArray.length; i++) {
                if (!isFinite(posArray[i])) {
                  posArray[i] = 0;
                  fixedPos = true;
                }
              }
              if (fixedPos) {
                geometry.attributes.position.needsUpdate = true;
              }
            }
            
            // Fix normal attribute
            if (geometry.attributes.normal) {
              const normalArray = geometry.attributes.normal.array;
              let fixedNormal = false;
              for (let i = 0; i < normalArray.length; i += 3) {
                if (!isFinite(normalArray[i]) || !isFinite(normalArray[i + 1]) || !isFinite(normalArray[i + 2])) {
                  normalArray[i] = 0;
                  normalArray[i + 1] = 1;
                  normalArray[i + 2] = 0;
                  fixedNormal = true;
                }
              }
              if (fixedNormal) {
                geometry.attributes.normal.needsUpdate = true;
              }
            }
            
            // Fix UV attribute
            if (geometry.attributes.uv) {
              const uvArray = geometry.attributes.uv.array;
              let fixedUV = false;
              for (let i = 0; i < uvArray.length; i++) {
                if (!isFinite(uvArray[i])) {
                  uvArray[i] = 0;
                  fixedUV = true;
                }
              }
              if (fixedUV) {
                geometry.attributes.uv.needsUpdate = true;
              }
            }
            
            // Clear any existing bounds that might be corrupted
            geometry.boundingSphere = null;
            geometry.boundingBox = null;
          }
        });
        
        // Second pass: Sanitize the scene using our utility
        sanitizeScene(clonedScene);
        
        // Third pass: Final validation - check if any geometry still has issues
        let isValid = true;
        clonedScene.traverse((child) => {
          if (child.isMesh && child.geometry) {
            const position = child.geometry.attributes.position;
            if (position && position.array) {
              // Check first 50 values for performance
              for (let i = 0; i < Math.min(50, position.array.length); i++) {
                if (!isFinite(position.array[i])) {
                  console.warn(`Invalid geometry still detected in ${child.name || 'unnamed mesh'} after cleanup`);
                  isValid = false;
                  break;
                }
              }
            }
            
            // Ensure bounding sphere exists and is valid
            if (!child.geometry.boundingSphere || !isFinite(child.geometry.boundingSphere.radius)) {
              console.warn(`Invalid bounding sphere in ${child.name || 'unnamed mesh'}, fixing...`);
              child.geometry.boundingSphere = {
                center: { x: 0, y: 0, z: 0 },
                radius: 1,
                isSphere: true
              };
            }
          }
        });

        if (isValid) {
          setSanitizedScene(clonedScene);
          console.log('GLTF scene successfully sanitized and validated');
        } else {
          console.error('Model validation failed after multiple cleanup attempts');
          setSanitizedScene(null);
        }
      } catch (sanitizeError) {
        console.error('Error sanitizing GLTF scene:', sanitizeError);
        setSanitizedScene(null);
      } finally {
        setIsProcessing(false);
      }
    }, 0);
  }, [scene, error, isProcessing]);

  return {
    scene: sanitizedScene,
    error,
    isProcessing,
    ...rest
  };
};
