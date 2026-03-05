import {useMediaQuery} from './use-media-query';

// const DESKTOP_QUERY = '(min-width: 992px) and (hover: hover) and (pointer: fine)';
const DESKTOP_QUERY = '(min-width: 992px)';

interface UseIsDesktopReturn {
  isDesktop: boolean;
  isLoading: boolean;
}

export const useIsDesktop = (): UseIsDesktopReturn => {
  const {matches, isLoading} = useMediaQuery(DESKTOP_QUERY);
  return {isDesktop: matches, isLoading};
};
