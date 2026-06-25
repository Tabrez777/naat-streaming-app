import { useState, useEffect } from 'react';

export function useNavigation() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Listen for browser back/forward button clicks
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Call this function to change the URL programmatically
  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    
    // Notify the rest of the application that the path shifted
    window.dispatchEvent(new Event('popstate'));
  };

  return [currentPath, navigateTo];
}