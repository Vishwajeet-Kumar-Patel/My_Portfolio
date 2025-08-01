// WebGL Context Manager for coordinated error handling across components
import React, { useState, useEffect, useRef } from 'react';

class WebGLManager {
  constructor() {
    this.activeContexts = new Set();
    this.failedComponents = new Set();
    this.systemPerformance = 'unknown';
    this.isSystemDegraded = false;
    this.maxActiveContexts = this.detectMaxContexts();
    
    this.detectSystemPerformance();
    this.setupGlobalErrorHandling();
  }

  detectMaxContexts() {
    // Conservative context limits based on device capability
    const cores = navigator.hardwareConcurrency || 2;
    const memory = navigator.deviceMemory || 4;
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile || cores < 4 || memory < 4) {
      return 2; // Very conservative for low-end devices
    } else if (cores < 8 || memory < 8) {
      return 4; // Moderate for mid-range devices
    } else {
      return 6; // Higher for high-end devices
    }
  }

  detectSystemPerformance() {
    const cores = navigator.hardwareConcurrency || 2;
    const memory = navigator.deviceMemory || 4;
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const connection = navigator.connection;
    
    let score = 0;
    
    // CPU score
    if (cores >= 8) score += 3;
    else if (cores >= 4) score += 2;
    else score += 1;
    
    // Memory score
    if (memory >= 8) score += 3;
    else if (memory >= 4) score += 2;
    else score += 1;
    
    // Device type penalty
    if (isMobile) score -= 2;
    
    // Network considerations for deployment
    if (connection) {
      if (connection.effectiveType === '4g') score += 1;
      else if (connection.effectiveType === '3g') score -= 1;
      else if (connection.effectiveType === '2g') score -= 2;
    }
    
    if (score >= 6) this.systemPerformance = 'high';
    else if (score >= 4) this.systemPerformance = 'medium';
    else this.systemPerformance = 'low';
    
    console.log(`WebGL Manager: System performance detected as ${this.systemPerformance} (score: ${score})`);
  }

  setupGlobalErrorHandling() {
    // Listen for WebGL context lost events globally
    window.addEventListener('webglcontextlost', (event) => {
      console.warn('WebGL context lost detected globally');
      this.handleGlobalContextLoss();
      event.preventDefault();
    });

    // Monitor memory usage if available (less aggressive for development)
    if (performance.memory) {
      setInterval(() => {
        const memUsage = performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize;
        if (memUsage > 0.90) { // Increased threshold from 0.85 to 0.90
          console.warn('High memory usage detected, degrading system');
          this.degradeSystem();
        }
      }, 10000); // Increased interval from 5000 to 10000ms for less frequent checks
    }
  }

  registerContext(componentName, contextId) {
    if (this.activeContexts.size >= this.maxActiveContexts) {
      console.warn(`WebGL Manager: Max contexts (${this.maxActiveContexts}) reached, denying ${componentName}`);
      return false;
    }
    
    if (this.failedComponents.has(componentName)) {
      console.warn(`WebGL Manager: Component ${componentName} previously failed, denying context`);
      return false;
    }
    
    if (this.isSystemDegraded && componentName !== 'Stars') {
      console.warn(`WebGL Manager: System degraded, denying non-essential component ${componentName}`);
      return false;
    }
    
    this.activeContexts.add({ componentName, contextId, createdAt: Date.now() });
    console.log(`WebGL Manager: Registered context for ${componentName} (${this.activeContexts.size}/${this.maxActiveContexts})`);
    return true;
  }

  unregisterContext(componentName, contextId) {
    for (const context of this.activeContexts) {
      if (context.componentName === componentName && context.contextId === contextId) {
        this.activeContexts.delete(context);
        console.log(`WebGL Manager: Unregistered context for ${componentName} (${this.activeContexts.size}/${this.maxActiveContexts})`);
        break;
      }
    }
  }

  reportFailure(componentName, error) {
    console.warn(`WebGL Manager: Component ${componentName} failed:`, error);
    this.failedComponents.add(componentName);
    
    // If too many components fail, degrade the system
    if (this.failedComponents.size >= 2) {
      this.degradeSystem();
    }
    
    // Clean up any contexts for this component
    for (const context of this.activeContexts) {
      if (context.componentName === componentName) {
        this.activeContexts.delete(context);
      }
    }
  }

  degradeSystem() {
    if (this.isSystemDegraded) return;
    
    console.warn('WebGL Manager: Degrading system performance mode');
    this.isSystemDegraded = true;
    
    // Schedule auto-recovery
    this.scheduleAutoRecovery();
    
    // Emit custom event for components to react
    window.dispatchEvent(new CustomEvent('webgl-system-degraded', {
      detail: { 
        activeContexts: this.activeContexts.size,
        failedComponents: Array.from(this.failedComponents),
        systemPerformance: this.systemPerformance
      }
    }));
  }

  handleGlobalContextLoss() {
    console.warn('WebGL Manager: Handling global context loss');
    this.activeContexts.clear();
    this.degradeSystem();
  }

  canCreateContext(componentName) {
    if (this.failedComponents.has(componentName)) {
      return false;
    }
    
    if (this.isSystemDegraded && !['Stars'].includes(componentName)) {
      return false;
    }
    
    return this.activeContexts.size < this.maxActiveContexts;
  }

  getSystemStatus() {
    return {
      performance: this.systemPerformance,
      activeContexts: this.activeContexts.size,
      maxContexts: this.maxActiveContexts,
      failedComponents: Array.from(this.failedComponents),
      isDegraded: this.isSystemDegraded
    };
  }

  // Recovery mechanism
  attemptRecovery() {
    console.log('WebGL Manager: Attempting system recovery');
    this.failedComponents.clear();
    this.isSystemDegraded = false;
    
    // Wait a bit before allowing new contexts
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('webgl-system-recovered'));
    }, 2000);
  }

  // Auto-recovery after degradation
  scheduleAutoRecovery() {
    if (this.isSystemDegraded) {
      setTimeout(() => {
        if (this.isSystemDegraded) {
          console.log('WebGL Manager: Auto-recovery triggered after 30 seconds');
          this.attemptRecovery();
        }
      }, 30000); // Auto-recover after 30 seconds
    }
  }
}

// Singleton instance
const webglManager = new WebGLManager();

// Expose recovery function globally for debugging
if (typeof window !== 'undefined') {
  window.webglRecovery = () => {
    console.log('Manual WebGL recovery triggered');
    webglManager.attemptRecovery();
  };
  window.webglStatus = () => {
    console.log('WebGL Manager Status:', webglManager.getSystemStatus());
    return webglManager.getSystemStatus();
  };
}

export default webglManager;

// Helper functions for components
export const createWebGLWrapper = (Component, componentName) => {
  return React.forwardRef((props, ref) => {
    const [canRender, setCanRender] = useState(true);
    const contextId = useRef(Math.random().toString(36).substr(2, 9));
    
    useEffect(() => {
      const handleSystemDegraded = () => {
        if (!['Stars'].includes(componentName)) {
          setCanRender(false);
        }
      };
      
      const handleSystemRecovered = () => {
        setCanRender(webglManager.canCreateContext(componentName));
      };
      
      window.addEventListener('webgl-system-degraded', handleSystemDegraded);
      window.addEventListener('webgl-system-recovered', handleSystemRecovered);
      
      return () => {
        window.removeEventListener('webgl-system-degraded', handleSystemDegraded);
        window.removeEventListener('webgl-system-recovered', handleSystemRecovered);
        webglManager.unregisterContext(componentName, contextId.current);
      };
    }, []);
    
    if (!canRender || !webglManager.canCreateContext(componentName)) {
      return null;
    }
    
    return React.createElement(Component, { 
      ...props, 
      ref,
      webglManager: webglManager, 
      contextId: contextId.current 
    });
  });
};
