import {forwardRef} from 'react';
import {CONTACT_PAGE} from '~/content/contact';
import {cn} from '~/utils/cn';
import styles from './ContactHeader.module.css';

interface ContactHeaderProps {
  ref: React.RefObject<HTMLDivElement>;
  className?: string;
}

export const ContactHeader = forwardRef<HTMLDivElement, ContactHeaderProps>(function ContactHeader({className}, ref) {
  return (
    <div ref={ref} className={cn(styles['contact-header-wrapper'], className)}>
      <h1 data-text-split className={styles['heading-1']}>
        {CONTACT_PAGE.heading}
      </h1>

      <p className={styles['heading-paragraph']}>{CONTACT_PAGE.subheading}</p>

      <div className="pt-4">
        <p className={styles['heading-paragraph']}>
          {CONTACT_PAGE.emailFallback.text}{' '}
          <a
            href={`mailto:${CONTACT_PAGE.emailFallback.email}`}
            className="font-bold border-b border-secondary hover:text-white transition-colors"
          >
            {CONTACT_PAGE.emailFallback.email}
          </a>
        </p>
      </div>
    </div>
  );
});
