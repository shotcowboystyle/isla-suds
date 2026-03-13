import {createMediaQueryHook} from './use-media-query';

const MOBILE_QUERY = '(max-width: 480px)';
const MOBILE_UA_KEYWORDS = ['android', 'webos', 'iphone', 'ipod', 'blackberry', 'windows phone', 'mobile'];

const useMobileQuery = createMediaQueryHook(MOBILE_QUERY, MOBILE_UA_KEYWORDS);

interface UseIsMobileReturn {
  isMobile: boolean;
  isLoading: boolean;
}

export const useIsMobile = (): UseIsMobileReturn => {
  const {matches, isLoading} = useMobileQuery();
  return {isMobile: matches, isLoading};
};
