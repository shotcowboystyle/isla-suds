import {createMediaQueryHook} from './use-media-query';

const DESKTOP_QUERY = '(min-width: 992px)';

const useDesktopQuery = createMediaQueryHook(DESKTOP_QUERY);

interface UseIsDesktopReturn {
  isDesktop: boolean;
  isLoading: boolean;
}

export const useIsDesktop = (): UseIsDesktopReturn => {
  const {matches, isLoading} = useDesktopQuery();
  return {isDesktop: matches, isLoading};
};
