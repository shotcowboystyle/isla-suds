import {Form} from 'react-router';
import {cn} from '~/utils/cn';
import styles from './AccountLogout.module.css';

export function AccountLogout() {
  return (
    <Form className="account-logout" method="POST" action="/account/logout">
      <button type="submit" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">
        Sign out
      </button>
    </Form>
  );
}
