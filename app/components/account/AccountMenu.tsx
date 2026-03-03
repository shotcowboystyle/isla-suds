import {NavLink} from 'react-router';
import {cn} from '~/utils/cn';
import {AccountLogout} from './AccountLogout';
import styles from './AccountMenu.module.css';

export function AccountMenu() {
  function isActiveStyle({isActive, isPending}: {isActive: boolean; isPending: boolean}) {
    return cn(
      'block px-5 py-4 rounded-xl transition-all duration-200 text-base font-medium',
      isActive
        ? 'bg-white shadow-sm text-gray-900 border border-white/60'
        : 'text-gray-600 hover:bg-white/40 hover:text-gray-900',
      isPending ? 'opacity-70' : '',
    );
  }

  return (
    <nav role="navigation" className="flex flex-col gap-2">
      <NavLink to="/account/orders" className={isActiveStyle} end>
        Orders
      </NavLink>
      <NavLink to="/account/profile" className={isActiveStyle}>
        Profile Details
      </NavLink>
      <NavLink to="/account/addresses" className={isActiveStyle}>
        Addresses
      </NavLink>
      <div className="mt-4 px-5">
        <AccountLogout />
      </div>
    </nav>
  );
}
