import {Outlet} from 'react-router';
import {cn} from '~/utils/cn';
import {AccountMenu} from './AccountMenu';
import styles from './AccountPage.module.css';

interface AccountPageProps {
  customer: any;
}

export function AccountPage({customer}: AccountPageProps) {
  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <div className={cn(styles['account-page'], 'min-h-[60vh]')}>
      <div className={styles['account-page-container']}>
        <div className={styles['account-page-header']}>
          <h1 className={styles['account-page-heading-title']}>{heading}</h1>
          <p className={styles['account-page-heading-text']}>
            Manage your orders, update your profile details, and manage your shipping addresses.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          <div className="w-full lg:w-72 shrink-0">
            <AccountMenu />
          </div>

          <div className="flex-1 w-full bg-white/60 backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-sm border border-white/40">
            <Outlet context={{customer}} />
          </div>
        </div>
      </div>
    </div>
  );
}
