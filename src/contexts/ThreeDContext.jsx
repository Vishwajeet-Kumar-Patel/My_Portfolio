import React, { createContext, useContext, useState, useEffect } from 'react';

const ThreeDContext = createContext();

export const useThreeD = () => {
  const context = useContext(ThreeDContext);
  if (!context) {
    throw new Error('useThreeD must be used within ThreeDProvider');
  }
  return context;
};

export const ThreeDProvider = ({ children }) => {
  const [threeDEnabled, setThreeDEnabled] = useState(true);
  const [errorCount, setErrorCount] = useState(0);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.warn('WebGL not supported, disabling 3D');
        setIsWebGLSupported(false);
        setThreeDEnabled(false);
      }
    } catch (error) {
      console.warn('WebGL check failed:', error);
      setIsWebGLSupported(false);
      setThreeDEnabled(false);
    }
  }, []);

  const reportError = () => {
    setErrorCount(prev => {
      const newCount = prev + 1;
      console.warn(`3D error count: ${newCount}`);
      
      // Disable 3D after 3 errors
      if (newCount >= 3) {
        console.warn('Too many 3D errors, disabling 3D rendering');
        setThreeDEnabled(false);
      }
      
      return newCount;
    });
  };

  const disable3D = () => {
    console.warn('3D rendering disabled manually');
    setThreeDEnabled(false);
  };

  const enable3D = () => {
    if (isWebGLSupported) {
      console.log('3D rendering re-enabled');
      setThreeDEnabled(true);
      setErrorCount(0);
    }
  };

  return (
    <ThreeDContext.Provider value={{
      threeDEnabled,
      isWebGLSupported,
      errorCount,
      reportError,
      disable3D,
      enable3D
    }}>
      {children}
    </ThreeDContext.Provider>
  );
};
