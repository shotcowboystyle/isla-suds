import {useFetcher} from 'react-router';
import styles from './NewsletterSignup.module.css';

interface NewsletterResponse {
  success?: boolean;
  error?: string;
}

export const NewsletterSignup = () => {
  const fetcher = useFetcher<NewsletterResponse>();
  const isSubmitting = fetcher.state === 'submitting';
  const isSuccess = fetcher.data?.success === true;
  const error = fetcher.data?.error;

  return (
    <div className={styles['newsletter-signup-wrapper']}>
      <p className={styles['paragraph']}>
        Get Exclusive Early Access and Stay Informed About Product Updates, Events, and More!
      </p>

      <div className={styles['footer-form']}>
        {!isSuccess ? (
          <fetcher.Form
            method="post"
            action="/api/newsletter"
            id="newsletter-form"
            name="newsletter-form"
            data-name="newsletter-form"
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
              disabled={isSubmitting}
            />

            <input
              type="submit"
              className={styles['submit-button']}
              value=""
              disabled={isSubmitting}
              aria-label={isSubmitting ? 'Subscribing...' : 'Subscribe'}
            />
          </fetcher.Form>
        ) : (
          <div
            className={styles['form-submit-success']}
            tabIndex={-1}
            role="region"
            aria-label="Newsletter signup success"
            style={{display: 'block'}}
          >
            <div>Thank you! Your submission has been received!</div>
          </div>
        )}

        {error && (
          <div
            className={styles['form-submit-failure']}
            tabIndex={-1}
            role="alert"
            aria-label="Newsletter signup failure"
            style={{display: 'block'}}
          >
            <div>{error}</div>
          </div>
        )}
      </div>
    </div>
  );
};
