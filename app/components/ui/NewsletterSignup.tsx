import {useState} from 'react';
import {FaArrowRight} from 'react-icons/fa6';
import styles from './NewsletterSignup.module.css';

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // MVP: Newsletter integration not yet wired up
  };

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
          method="get"
          className={styles['footer-form']}
          aria-label="newsletter-form"
        >
          <input
            className={styles['text-field']}
            maxLength={256}
            name="email-2"
            data-name="Email 2"
            placeholder="Enter your email"
            type="email"
            id="email-2"
            required={true}
          />

          <input type="submit" data-wait="Please wait..." className={styles['submit-button']} value="" />
        </form>

        <div className={styles['form-submit-success']} tabIndex={-1} role="region" aria-label="footer-form success">
          <div>Thank you! Your submission has been received!</div>
        </div>

        <div className={styles['form-submit-failure']} tabIndex={-1} role="region" aria-label="footer-form failure">
          <div>Oops! Something went wrong while submitting the form.</div>
        </div>
      </div>
    </div>
  );
};
