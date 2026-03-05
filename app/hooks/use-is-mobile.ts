import {useMediaQuery} from './use-media-query';

const MOBILE_QUERY = '(max-width: 480px)';
const MOBILE_UA_KEYWORDS = ['android', 'webos', 'iphone', 'ipod', 'blackberry', 'windows phone', 'mobile'];

interface UseIsMobileReturn {
  isMobile: boolean;
  isLoading: boolean;
}

export const useIsMobile = (): UseIsMobileReturn => {
  const {matches, isLoading} = useMediaQuery(MOBILE_QUERY, MOBILE_UA_KEYWORDS);
  return {isMobile: matches, isLoading};
};
