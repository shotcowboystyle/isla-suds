import {DevMotion} from '~/components/dev/DevMotion';
import type {Route} from './+types/dev.motion';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Framer Motion Test | Isla Suds Dev'},
    {
      name: 'description',
      content: 'Testing Framer Motion dynamic import and basic animations',
    },
  ];
};

export default function DevMotionRoute() {
  return <DevMotion />;
}
