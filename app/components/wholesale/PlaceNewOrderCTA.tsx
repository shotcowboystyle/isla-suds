import {Link} from 'react-router';
import {wholesaleContent} from '~/content/wholesale';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';
import {buttonVariants} from '~/lib/variants';
import {cn} from '~/utils/cn';

export function PlaceNewOrderCTA() {
  return (
    <div className="mb-8">
      <Link
        to={WHOLESALE_ROUTES.ORDER}
        className={cn(buttonVariants({variant: 'primary', size: 'lg'}), 'w-full')}
      >
        {wholesaleContent.dashboard.placeNewOrderButton}
      </Link>
    </div>
  );
}
