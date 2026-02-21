import {FaArrowRight} from 'react-icons/fa6';
import styles from './NewsletterSignup.module.css';

export const NewsletterSignup = () => {
  return (
    <div className={styles['newsletter-signup-wrapper']}>
      <p className={styles['paragraph']}>
        Get Exclusive Early Access and Stay Informed About Product Updates, Events, and More!
      </p>

      <div className={styles['footer-form-wrapper']}>
        <form
          id="newsletter-form"
          name="newsletter-form"
          data-name="newsletter-form"
          method="post"
          className={styles['footer-form']}
          aria-label="Newsletter signup"
        >
          <input
            className={styles['text-field']}
            maxLength={256}
            name="email"
            placeholder="Enter your email"
            type="email"
            id="newsletter-email"
            required={true}
          />

          <input type="submit" data-wait="Please wait..." className={styles['submit-button']} value="" />
        </form>

        <div className={styles['form-submit-success']} tabIndex={-1} role="region" aria-label="Newsletter signup success">
          <div>Thank you! Your submission has been received!</div>
        </div>

        <div className={styles['form-submit-failure']} tabIndex={-1} role="region" aria-label="Newsletter signup failure">
          <div>Oops! Something went wrong while submitting the form.</div>
        </div>
      </div>
    </div>
  );
};
