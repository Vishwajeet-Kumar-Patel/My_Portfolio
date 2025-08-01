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
        
        // First pass: Comprehensive geometry sanitization
        clonedScene.traverse((child) => {
          if (child.isMesh && child.geometry) {
            const geometry = child.geometry;
            let geometryFixed = false;
            
            // Fix position attribute with comprehensive NaN detection
            if (geometry.attributes.position) {
              const posArray = geometry.attributes.position.array;
              let fixedPos = false;
              for (let i = 0; i < posArray.length; i++) {
                const value = posArray[i];
                if (!isFinite(value) || isNaN(value) || value === null || value === undefined) {
                  posArray[i] = 0;
                  fixedPos = true;
                  geometryFixed = true;
                }
              }
              if (fixedPos) {
                geometry.attributes.position.needsUpdate = true;
                console.warn(`Fixed ${posArray.length} position values in ${child.name || 'unnamed mesh'}`);
              }
            }
            
            // Fix normal attribute with better validation
            if (geometry.attributes.normal) {
              const normalArray = geometry.attributes.normal.array;
              let fixedNormal = false;
              for (let i = 0; i < normalArray.length; i += 3) {
                // Check each component of the normal vector
                const x = normalArray[i];
                const y = normalArray[i + 1];
                const z = normalArray[i + 2];
                
                if (!isFinite(x) || !isFinite(y) || !isFinite(z) || 
                    isNaN(x) || isNaN(y) || isNaN(z) ||
                    x === null || y === null || z === null) {
                  normalArray[i] = 0;
                  normalArray[i + 1] = 1;
                  normalArray[i + 2] = 0;
                  fixedNormal = true;
                  geometryFixed = true;
                }
              }
              if (fixedNormal) {
                geometry.attributes.normal.needsUpdate = true;
                console.warn(`Fixed normal values in ${child.name || 'unnamed mesh'}`);
              }
            }
            
            // Fix UV attribute
            if (geometry.attributes.uv) {
              const uvArray = geometry.attributes.uv.array;
              let fixedUV = false;
              for (let i = 0; i < uvArray.length; i++) {
                const value = uvArray[i];
                if (!isFinite(value) || isNaN(value) || value === null || value === undefined) {
                  uvArray[i] = 0;
                  fixedUV = true;
                  geometryFixed = true;
                }
              }
              if (fixedUV) {
                geometry.attributes.uv.needsUpdate = true;
                console.warn(`Fixed UV values in ${child.name || 'unnamed mesh'}`);
              }
            }
            
            // Fix skinning attributes for rigged models (like robots)
            if (geometry.attributes.skinIndex) {
              const skinIndexArray = geometry.attributes.skinIndex.array;
              let fixedSkinIndex = false;
              for (let i = 0; i < skinIndexArray.length; i++) {
                const value = skinIndexArray[i];
                if (!isFinite(value) || isNaN(value) || value < 0) {
                  skinIndexArray[i] = 0;
                  fixedSkinIndex = true;
                  geometryFixed = true;
                }
              }
              if (fixedSkinIndex) {
                geometry.attributes.skinIndex.needsUpdate = true;
                console.warn(`Fixed skinIndex values in ${child.name || 'unnamed mesh'}`);
              }
            }
            
            if (geometry.attributes.skinWeight) {
              const skinWeightArray = geometry.attributes.skinWeight.array;
              let fixedSkinWeight = false;
              for (let i = 0; i < skinWeightArray.length; i += 4) {
                let totalWeight = 0;
                let hasInvalidValues = false;
                
                // Check and fix each weight component
                for (let j = 0; j < 4; j++) {
                  const weight = skinWeightArray[i + j];
                  if (!isFinite(weight) || isNaN(weight) || weight < 0) {
                    skinWeightArray[i + j] = 0;
                    hasInvalidValues = true;
                    fixedSkinWeight = true;
                    geometryFixed = true;
                  }
                  totalWeight += skinWeightArray[i + j];
                }
                
                // Normalize weights if needed
                if (hasInvalidValues || totalWeight === 0 || Math.abs(totalWeight - 1.0) > 0.001) {
                  if (totalWeight === 0) {
                    skinWeightArray[i] = 1; // Default to first bone
                    skinWeightArray[i + 1] = 0;
                    skinWeightArray[i + 2] = 0;
                    skinWeightArray[i + 3] = 0;
                  } else {
                    // Normalize existing weights
                    for (let j = 0; j < 4; j++) {
                      skinWeightArray[i + j] /= totalWeight;
                    }
                  }
                  fixedSkinWeight = true;
                  geometryFixed = true;
                }
              }
              if (fixedSkinWeight) {
                geometry.attributes.skinWeight.needsUpdate = true;
                console.warn(`Fixed skinWeight values in ${child.name || 'unnamed mesh'}`);
              }
            }
            
            // Force geometry update if we made fixes
            if (geometryFixed) {
              geometry.boundingSphere = null;
              geometry.boundingBox = null;
              
              // Manually create safe bounding sphere to prevent NaN issues
              const position = geometry.attributes.position;
              if (position && position.array.length > 0) {
                let minX = Infinity, minY = Infinity, minZ = Infinity;
                let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
                
                for (let i = 0; i < position.array.length; i += 3) {
                  const x = position.array[i];
                  const y = position.array[i + 1];
                  const z = position.array[i + 2];
                  
                  if (isFinite(x) && isFinite(y) && isFinite(z)) {
                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x);
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);
                    minZ = Math.min(minZ, z);
                    maxZ = Math.max(maxZ, z);
                  }
                }
                
                if (isFinite(minX) && isFinite(maxX)) {
                  const centerX = (minX + maxX) * 0.5;
                  const centerY = (minY + maxY) * 0.5;
                  const centerZ = (minZ + maxZ) * 0.5;
                  const radius = Math.max(
                    Math.sqrt((maxX - centerX) ** 2 + (maxY - centerY) ** 2 + (maxZ - centerZ) ** 2),
                    0.1 // Minimum radius
                  );
                  
                  geometry.boundingSphere = {
                    center: { x: centerX, y: centerY, z: centerZ },
                    radius: radius,
                    isSphere: true
                  };
                } else {
                  // Fallback to safe default
                  geometry.boundingSphere = {
                    center: { x: 0, y: 0, z: 0 },
                    radius: 1,
                    isSphere: true
                  };
                }
              }
            }
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
