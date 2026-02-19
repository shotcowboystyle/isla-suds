import {createContext, useContext, useState, useEffect, type ReactNode} from 'react';

interface PreloaderContextType {
  preloaderComplete: boolean;
  setPreloaderComplete: (complete: boolean) => void;
}

const PreloaderContext = createContext<PreloaderContextType | undefined>(undefined);

export function PreloaderProvider({children}: {children: ReactNode}) {
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  return (
    <PreloaderContext.Provider value={{preloaderComplete, setPreloaderComplete}}>{children}</PreloaderContext.Provider>
  );
}

export function usePreloader() {
  const context = useContext(PreloaderContext);
  if (context === undefined) {
    throw new Error('usePreloader must be used within a PreloaderProvider');
  }
  return context;
}
