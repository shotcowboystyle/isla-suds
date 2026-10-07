import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';
import {LiquidButton} from '~/components/ui/LiquidButton';
import {cn} from '~/utils/cn';
import styles from './PartnersApplicationForm.module.css';

export interface ApplicationResult {
  success: boolean;
  error?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    phone?: string;
    businessName?: string;
    message?: string;
  };
}

interface PartnersApplicationFormProps {
  /** No-JS fallback: the route's own action data after a full-page POST. */
  actionData?: ApplicationResult;
  /** The venue picked on the page, sent along as `shopType`. */
  shopType: string;
  placeholder: string;
}

const FIELDS: {
  name: 'name' | 'businessName' | 'email' | 'phone' | 'instagram' | 'website';
  label: string;
  type: string;
  required?: boolean;
  wide?: boolean;
}[] = [
  {name: 'name', label: 'Contact name', type: 'text', required: true},
  {name: 'businessName', label: 'Business name', type: 'text', required: true},
  {name: 'email', label: 'Email', type: 'email', required: true, wide: true},
  {name: 'phone', label: 'Phone', type: 'tel', required: true, wide: true},
  {name: 'instagram', label: 'Instagram handle', type: 'text'},
  {name: 'website', label: 'Website', type: 'url'},
];

/**
 * The wholesale application. Posts to the /partners action through a fetcher,
 * so the visitor stays on the page; without JS it falls back to a normal POST
 * and the route hands its action data back in.
 */
export function PartnersApplicationForm({actionData, shopType, placeholder}: PartnersApplicationFormProps) {
  const fetcher = useFetcher<ApplicationResult>();
  const result = fetcher.data ?? actionData;
  const isSubmitting = fetcher.state !== 'idle';
  const successRef = useRef<HTMLHeadingElement>(null);

  // The form disappears on success, so move focus to what replaced it.
  useEffect(() => {
    if (result?.success) successRef.current?.focus();
  }, [result?.success]);

  if (result?.success) {
    return (
      <div role="status" className={styles['success']}>
        <h3 ref={successRef} tabIndex={-1} className={styles['success-heading']}>
          Application received
        </h3>
        <p className={styles['success-text']}>
          Thanks for wanting to add some suds to your shelves. We&apos;ll get back to you within 1-2 business days.
        </p>
      </div>
    );
  }

  const errors = result?.fieldErrors;

  return (
    <fetcher.Form method="post" action="/partners" className={styles['onboarding-form']} noValidate>
      <input type="hidden" name="shopType" value={shopType} />

      <div className={styles['form-fieldset']}>
        {FIELDS.map((field) => {
          const error = (errors as Record<string, string | undefined> | undefined)?.[field.name];
          return (
            <div key={field.name} className={cn(styles['form-group'], field.wide && styles['form-group-wide'])}>
              <label htmlFor={`apply-${field.name}`} className={styles['form-label']}>
                {field.label}
                {field.required && <span aria-hidden="true"> *</span>}
              </label>
              <input
                type={field.type}
                id={`apply-${field.name}`}
                name={field.name}
                required={field.required}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `apply-${field.name}-error` : undefined}
                className={cn(styles['form-input'], error && styles['is-invalid'])}
              />
              {error && (
                <p id={`apply-${field.name}-error`} className={styles['form-error']}>
                  {error}
                </p>
              )}
            </div>
          );
        })}

        <div className={cn(styles['form-group'], styles['form-group-wide'])}>
          <label htmlFor="apply-message" className={styles['form-label']}>
            Tell us about your shop<span aria-hidden="true"> *</span>
          </label>
          <textarea
            id="apply-message"
            name="message"
            required
            rows={5}
            placeholder={placeholder}
            aria-invalid={errors?.message ? true : undefined}
            aria-describedby={errors?.message ? 'apply-message-error' : undefined}
            className={cn(styles['form-textarea'], errors?.message && styles['is-invalid'])}
          />
          {errors?.message && (
            <p id="apply-message-error" className={styles['form-error']}>
              {errors.message}
            </p>
          )}
        </div>
      </div>

      {result?.error && (
        <p role="alert" className={styles['form-alert']}>
          {result.error}
        </p>
      )}

      <div className={styles['submit-button-wrapper']}>
        <LiquidButton type="submit" disabled={isSubmitting} text={isSubmitting ? 'Sending...' : 'Send application'} />
      </div>
    </fetcher.Form>
  );
}
