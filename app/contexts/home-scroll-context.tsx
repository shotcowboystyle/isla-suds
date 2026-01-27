import {createContext, useContext, type ReactNode} from 'react';

interface HomeScrollContextValue {
  isPastHero: boolean;
}

const HomeScrollContext = createContext<HomeScrollContextValue | null>(null);

export function HomeScrollProvider({
  children,
  isPastHero,
}: {
  children: ReactNode;
  isPastHero: boolean;
}) {
  return (
    <HomeScrollContext.Provider value={{isPastHero}}>
      {children}
    </HomeScrollContext.Provider>
  );
}

export function useHomeScroll(): HomeScrollContextValue | null {
  return useContext(HomeScrollContext);
}
