import {useState, useEffect} from 'react';

interface UseMediaQueryReturn {
  matches: boolean;
  isLoading: boolean;
}

export function useMediaQuery(
  query: string,
  uaKeywords?: string[],
): UseMediaQueryReturn {
  const [matches, setMatches] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const check = () => {
      const mediaQuery = window.matchMedia(query);
      let result = mediaQuery.matches;

      if (uaKeywords?.length) {
        const userAgent = navigator.userAgent.toLowerCase();
        const uaMatch = uaKeywords.some((keyword) =>
          userAgent.includes(keyword),
        );
        result = result || uaMatch;
      }

      setMatches(result);
      setIsLoading(false);
    };

    check();

    const mediaQuery = window.matchMedia(query);
    const handleChange = () => check();

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query, uaKeywords]);

  return {matches, isLoading};
}
