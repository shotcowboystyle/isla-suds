import {useState, type RefObject} from 'react';
import {Form, useNavigation} from 'react-router';
import {CONTACT_PAGE} from '~/content/contact';
import {cn} from '~/utils/cn';
import styles from './MessageSlip.module.css';
import type {ContactActionData} from '~/routes/contact';

const {slip, email} = CONTACT_PAGE;

/**
 * The form, as a "While You Were Out" phone-message slip on a pad. What the
 * visitor types comes out in blue ballpoint; a tick box draws a pen tick; the
 * order-number line only appears for order help. `sheetRef` is the tear-off
 * sheet, handed to the desk so it can fly to the goat.
 */
export function MessageSlip({
  actionData,
  sheetRef,
}: {
  actionData?: ContactActionData;
  sheetRef: RefObject<HTMLDivElement>;
}) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [subject, setSubject] = useState('');
  const emailError = actionData?.fieldErrors?.email;

  return (
    <div className={styles.pad}>
      <div data-pad-rest className={styles.under} aria-hidden="true" />
      <div data-pad-rest className={styles.binding} aria-hidden="true" />

      <div ref={sheetRef} className={styles.sheet}>
        <Form method="post" className={styles.form} aria-labelledby="slip-title">
          <p id="slip-title" className={styles.title}>
            {slip.title}
          </p>

          <dl className={styles.printed}>
            {slip.printed.map(({label, value}) => (
              <div key={label}>
                <dt>{label}:</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.line}>
            <label htmlFor="slip-name" className={styles.label}>
              {slip.name.label}
              <span className="sr-only"> {slip.name.hint}</span>
            </label>
            <input
              id="slip-name"
              name="name"
              type="text"
              required
              maxLength={120}
              autoComplete="name"
              placeholder={slip.name.placeholder}
              className={styles.ink}
            />
          </div>

          <div className={styles.line}>
            <label htmlFor="slip-email" className={styles.label}>
              {slip.email.label}
              <span className="sr-only"> {slip.email.hint}</span>
            </label>
            <input
              id="slip-email"
              name="email"
              type="email"
              required
              maxLength={256}
              autoComplete="email"
              placeholder={slip.email.placeholder}
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? 'slip-email-error' : undefined}
              className={styles.ink}
            />
          </div>
          {emailError && (
            <p id="slip-email-error" className={styles.error}>
              {emailError}
            </p>
          )}

          <fieldset className={styles.boxes}>
            <legend className={styles.label}>{slip.subject.legend}</legend>
            {slip.subject.options.map((option) => (
              <label key={option.value} className={styles.box}>
                <input
                  type="radio"
                  name="subject"
                  value={option.value}
                  required
                  onChange={() => setSubject(option.value)}
                  className={styles.radio}
                />
                <span className={styles.tickbox} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 13.5 9.5 19 20.5 5" />
                  </svg>
                </span>
                {option.label}
              </label>
            ))}
          </fieldset>

          {subject === 'Order Support' && (
            <div className={styles.line}>
              <label htmlFor="slip-order" className={styles.label}>
                {slip.orderNumber.label}
              </label>
              <input
                id="slip-order"
                name="orderNumber"
                type="text"
                maxLength={40}
                placeholder={slip.orderNumber.placeholder}
                className={styles.ink}
              />
            </div>
          )}

          <div className={styles.message}>
            <label htmlFor="slip-message" className={styles.label}>
              {slip.message.label}
            </label>
            <textarea
              id="slip-message"
              name="message"
              required
              rows={5}
              maxLength={4000}
              placeholder={slip.message.placeholder}
              className={cn(styles.ink, styles.ruled)}
            />
          </div>

          {actionData?.error && (
            <p role="alert" className={styles.busy}>
              {actionData.error} {slip.orEmail} <a href={`mailto:${email}`}>{email}</a>.
            </p>
          )}

          <div className={styles.foot}>
            <span className={styles['taken-by']}>{slip.takenBy}</span>
            <button type="submit" disabled={isSubmitting} className={styles.send}>
              {isSubmitting ? slip.submitting : slip.submit}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
