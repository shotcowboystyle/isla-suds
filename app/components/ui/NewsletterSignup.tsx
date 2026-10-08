import {useFetcher} from 'react-router';
import {FOOTER} from '~/content/footer';
import {cn} from '~/utils/cn';
import chunky from './ChunkyButton.module.css';
import styles from './NewsletterSignup.module.css';

interface NewsletterResponse {
  success?: boolean;
  error?: string;
}

const COPY = FOOTER.newsletter;

export const NewsletterSignup = () => {
  const fetcher = useFetcher<NewsletterResponse>();
  const isSubmitting = fetcher.state === 'submitting';
  const isSuccess = fetcher.data?.success === true;
  const error = fetcher.data?.error;

  return (
    <div className={styles.card}>
      <h3 className={styles.heading}>{COPY.heading}</h3>
      <p className={styles.body}>{COPY.body}</p>

      {!isSuccess ? (
        <fetcher.Form
          method="post"
          action="/api/newsletter"
          id="newsletter-form"
          name="newsletter-form"
          className={styles.form}
          aria-label="Newsletter signup"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            {COPY.label}
          </label>
          <input
            className={styles.field}
            maxLength={256}
            name="email"
            placeholder={COPY.placeholder}
            type="email"
            id="newsletter-email"
            autoComplete="email"
            required
            disabled={isSubmitting}
          />
          <button type="submit" className={cn(chunky.chunky, styles.submit)} disabled={isSubmitting}>
            {isSubmitting ? COPY.submitting : COPY.submit}
          </button>
        </fetcher.Form>
      ) : (
        <div className={styles.success} tabIndex={-1} role="region" aria-label="Newsletter signup success">
          {COPY.success}
        </div>
      )}

      {error && (
        <div className={styles.failure} tabIndex={-1} role="alert" aria-label="Newsletter signup failure">
          {error}
        </div>
      )}
    </div>
  );
};
