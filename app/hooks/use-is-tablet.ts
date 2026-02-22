import {useMediaQuery} from './use-media-query';

const TABLET_QUERY = '(min-width: 769px) and (max-width: 1024px)';
const TABLET_UA_KEYWORDS = [
  'ipad',
  'tablet',
  'kindle',
  'silk',
  'playbook',
  'nexus 7',
  'nexus 9',
  'nexus 10',
  'galaxy tab',
  'sm-t',
  'gt-p',
  'gt-n',
];

interface UseIsTabletReturn {
  isTablet: boolean;
  isLoading: boolean;
}

export const useIsTablet = (): UseIsTabletReturn => {
  const {matches, isLoading} = useMediaQuery(TABLET_QUERY, TABLET_UA_KEYWORDS);
  return {isTablet: matches, isLoading};
};
