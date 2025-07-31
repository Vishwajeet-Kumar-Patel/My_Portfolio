/**
 * Utility functions for Three.js operations
 */
import * as THREE from 'three';

/**
 * Checks if a value is a valid number (not NaN, not Infinity)
 * @param {number} value - The value to check
 * @returns {boolean} - Whether the value is valid
 */
export const isValidNumber = (value) => {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
};

/**
 * Comprehensive geometry validation and repair
 * @param {THREE.BufferGeometry} geometry - The geometry to validate
 * @param {string} meshName - Optional name for logging
 * @returns {boolean} - Whether any repairs were made
 */
export const validateAndRepairGeometry = (geometry, meshName = 'unnamed') => {
  if (!geometry || !geometry.attributes) {
    console.warn(`Invalid geometry passed to validateAndRepairGeometry: ${meshName}`);
    return false;
  }

  let repairsMade = false;

  try {
    // Validate and repair position attribute
    const position = geometry.attributes.position;
    if (position && position.array) {
      const array = position.array;
      for (let i = 0; i < array.length; i++) {
        if (!isValidNumber(array[i])) {
          array[i] = 0;
          repairsMade = true;
        }
      }
      if (repairsMade) {
        position.needsUpdate = true;
        console.warn(`Repaired position attribute for ${meshName}`);
      }
    }

    // Validate and repair normal attribute
    const normal = geometry.attributes.normal;
    if (normal && normal.array) {
      const array = normal.array;
      let normalRepairs = false;
      for (let i = 0; i < array.length; i += 3) {
        if (!isValidNumber(array[i]) || !isValidNumber(array[i + 1]) || !isValidNumber(array[i + 2])) {
          array[i] = 0;
          array[i + 1] = 1;
          array[i + 2] = 0;
          normalRepairs = true;
        }
      }
      if (normalRepairs) {
        normal.needsUpdate = true;
        repairsMade = true;
        console.warn(`Repaired normal attribute for ${meshName}`);
      }
    }

    // Validate and repair UV attribute
    const uv = geometry.attributes.uv;
    if (uv && uv.array) {
      const array = uv.array;
      let uvRepairs = false;
      for (let i = 0; i < array.length; i++) {
        if (!isValidNumber(array[i])) {
          array[i] = 0;
          uvRepairs = true;
        }
      }
      if (uvRepairs) {
        uv.needsUpdate = true;
        repairsMade = true;
        console.warn(`Repaired UV attribute for ${meshName}`);
      }
    }

    // Clear potentially corrupted bounds
    if (repairsMade) {
      geometry.boundingSphere = null;
      geometry.boundingBox = null;
    }

    return repairsMade;
  } catch (error) {
    console.error(`Error validating geometry ${meshName}:`, error);
    return false;
  }
};

/**
 * Creates a safe icosahedron geometry with fallback to sphere
 * @param {number} radius - The radius of the geometry
 * @param {number} detail - The detail level
 * @returns {THREE.BufferGeometry} - A safe geometry
 */
export const createSafeIcosahedronGeometry = (radius = 1, detail = 1) => {
  try {
    const geometry = new THREE.IcosahedronGeometry(radius, detail);
    const wasSanitized = sanitizeGeometry(geometry, 'icosahedron');
    
    // Additional validation - check if geometry has valid triangles
    if (geometry.attributes.position.count === 0) {
      throw new Error('Geometry has no vertices');
    }
    
    return geometry;
  } catch (error) {
    console.warn('Icosahedron geometry creation failed, using sphere fallback:', error);
    try {
      const fallbackGeometry = new THREE.SphereGeometry(radius, 16, 16);
      sanitizeGeometry(fallbackGeometry, 'sphere-fallback');
      return fallbackGeometry;
    } catch (fallbackError) {
      console.error('Fallback sphere geometry also failed:', fallbackError);
      // Return a basic box as last resort
      const boxGeometry = new THREE.BoxGeometry(radius, radius, radius);
      sanitizeGeometry(boxGeometry, 'box-fallback');
      return boxGeometry;
    }
  }
};

/**
 * Sanitizes NaN values in a BufferGeometry's attributes
 * @param {THREE.BufferGeometry} geometry - The geometry to sanitize
 * @param {string} meshName - Optional name for logging purposes
 * @returns {boolean} - Whether any fixes were applied
 */
export const sanitizeGeometry = (geometry, meshName = 'unnamed') => {
  // Use the comprehensive validation function
  return validateAndRepairGeometry(geometry, meshName);
};

/**
 * Traverses a scene and sanitizes all geometries
 * @param {THREE.Object3D} scene - The scene or object to traverse
 */
export const sanitizeScene = (scene) => {
  if (!scene) return;

  try {
    scene.traverse((child) => {
      if (child.isMesh && child.geometry) {
        try {
          // Clear any existing bounding sphere/box that might have NaN
          child.geometry.boundingSphere = null;
          child.geometry.boundingBox = null;
          
          // Validate and repair the geometry
          const repairsMade = validateAndRepairGeometry(child.geometry, child.name || 'unnamed mesh');
          
          // Create safe bounds
          try {
            // Try to compute bounds normally first
            child.geometry.computeBoundingSphere();
            child.geometry.computeBoundingBox();
            
            // Validate the computed bounds
            if (!child.geometry.boundingSphere || 
                !isValidNumber(child.geometry.boundingSphere.radius) ||
                !child.geometry.boundingSphere.center ||
                !isValidNumber(child.geometry.boundingSphere.center.x) ||
                !isValidNumber(child.geometry.boundingSphere.center.y) ||
                !isValidNumber(child.geometry.boundingSphere.center.z)) {
              throw new Error('Invalid bounding sphere computed');
            }
          } catch (computeError) {
            console.warn(`Compute bounds failed for ${child.name || 'unnamed mesh'}, using safe defaults:`, computeError);
            // Create safe default bounds manually
            child.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 1);
            child.geometry.boundingBox = new THREE.Box3(
              new THREE.Vector3(-1, -1, -1),
              new THREE.Vector3(1, 1, 1)
            );
          }
          
          if (repairsMade) {
            console.log(`Successfully sanitized geometry: ${child.name || 'unnamed mesh'}`);
          }
        } catch (childError) {
          console.error(`Critical error processing mesh ${child.name || 'unnamed'}:`, childError);
          // Remove problematic mesh from scene as last resort
          if (child.parent) {
            console.warn(`Removing critically damaged mesh: ${child.name || 'unnamed'}`);
            child.parent.remove(child);
          }
        }
      }
    });
  } catch (traverseError) {
    console.error('Error traversing scene:', traverseError);
  }
};

/**
 * Error boundary for Three.js canvas components
 * @param {Function} callback - The callback to wrap
 * @returns {Function} - Wrapped callback with error handling
 */
export const withThreeErrorHandling = (callback) => {
  return (...args) => {
    try {
      return callback(...args);
    } catch (error) {
      console.error('Three.js error caught:', error);
      // Return null or a fallback component
      return null;
    }
  };
};
