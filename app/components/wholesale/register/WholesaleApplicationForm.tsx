import {useRef, useEffect} from 'react';
import {Form, useNavigation} from 'react-router';
import {LiquidButton} from '~/components/ui/LiquidButton';
import {cn} from '~/utils/cn';
import styles from './WholesaleApplicationForm.module.css';

interface WholesaleApplicationFormProps {
  actionData?: {
    success: boolean;
    error?: string;
    fieldErrors?: {
      name?: string;
      email?: string;
      phone?: string;
      businessName?: string;
      message?: string;
    };
  };
}

export function WholesaleApplicationForm({actionData}: WholesaleApplicationFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (actionData?.success) {
      formRef.current?.reset();
    }
  }, [actionData?.success]);

  if (actionData?.success) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-display text-primary mb-4">Application Received</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for your interest in becoming a wholesale partner. We have received your application and will review
          it shortly. You will hear from us within 1-2 business days.
        </p>
        <div className="p-4 bg-green-50 text-green-800 rounded-lg inline-block">
          Application submitted successfully.
        </div>
      </div>
    );
  }

  return (
    <div className={styles['page-grid']}>
      <div className={styles['intro-section']}>
        <div className={styles['intro-start-wrapper']}>
          <div className={styles['intro-heading-wrapper']}>
            <h1 className={styles['heading-text']}>Become a</h1>
          </div>

          <div className={styles['clipped-box']}>
            <h1 className={styles['clipped-text']}>Suds Seller</h1>
          </div>
        </div>

        <div className={styles['intro-end-wrapper']}>
          <div>
            <div className={styles['intro-end-heading']}>perks upon entry</div>
          </div>

          <div className={styles['intro-end-content-wrapper']}>
            <div className={styles['cards-grid']}>
              <div className={styles['card-1']}>
                <div className={styles['card-number']}>01</div>
                <h5 className={styles['card-heading']}>
                  Join the Isla Suds
                  <br />
                  team
                </h5>
              </div>

              <div className={styles['card-2']}>
                <div className={styles['card-number']}>02</div>
                <h5 className={styles['card-heading']}>Connect with Fanatics</h5>
              </div>

              <div className={styles['card-3']}>
                <div className={styles['card-number']}>03</div>
                <h5 className={styles['card-heading']}>
                  Share and
                  <br />
                  Shine
                </h5>
              </div>
              <div className={styles['card-grid-spacer']}></div>
              <div className={styles['card-grid-spacer']}></div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles['application-section']}>
        <div className={styles['application-content']}>
          <div className={styles['application-form-wrapper']}>
            <Form method="post" ref={formRef} className={styles['onboarding-form']}>
              <div className={styles['form-heading']}>Start your application</div>

              <div className={styles['form-fieldset']}>
                {/* Contact Name */}
                <div>
                  <label htmlFor="name" className="sr-only">
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className={cn(
                      styles['form-input'],
                      actionData?.fieldErrors?.name && 'border-red-500 focus-visible:ring-red-500',
                    )}
                    placeholder="Jane Doe"
                  />
                  {actionData?.fieldErrors?.name && (
                    <p className="text-sm text-red-500">{actionData.fieldErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className={cn(
                      styles['form-input'],
                      actionData?.fieldErrors?.email && 'border-red-500 focus-visible:ring-red-500',
                    )}
                    placeholder="jane@example.com"
                  />
                  {actionData?.fieldErrors?.email && (
                    <p className="text-sm text-red-500">{actionData.fieldErrors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="sr-only">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className={cn(
                      styles['form-input'],
                      actionData?.fieldErrors?.phone && 'border-red-500 focus-visible:ring-red-500',
                    )}
                    placeholder="(555) 123-4567"
                  />
                  {actionData?.fieldErrors?.phone && (
                    <p className="text-sm text-red-500">{actionData.fieldErrors.phone}</p>
                  )}
                </div>

                {/* Business Name */}
                <div>
                  <label htmlFor="businessName" className="sr-only">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    required
                    className={cn(
                      styles['form-input'],
                      actionData?.fieldErrors?.businessName && 'border-red-500 focus-visible:ring-red-500',
                    )}
                    placeholder="Isla Suds Retail"
                  />
                  {actionData?.fieldErrors?.businessName && (
                    <p className="text-sm text-red-500">{actionData.fieldErrors.businessName}</p>
                  )}
                </div>

                {/* Instagram Handle */}
                <div>
                  <label htmlFor="instagram" className="sr-only">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    className={cn(styles['form-input'])}
                    placeholder="@islasuds"
                  />
                </div>

                {/* Website */}
                <div>
                  <label htmlFor="website" className="sr-only">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    className={cn(styles['form-input'])}
                    placeholder="https://islasuds.com"
                  />
                </div>

                {/* Message */}
                <div className="col-span-1 min-[992px]:col-span-2">
                  <label htmlFor="message" className="sr-only">
                    Tell us about your shop <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className={cn(
                      styles['form-textarea'],
                      actionData?.fieldErrors?.message && 'border-red-500 focus-visible:ring-red-500',
                    )}
                    placeholder="We are a boutique shop located in..."
                  />
                  {actionData?.fieldErrors?.message && (
                    <p className="text-sm text-red-500">{actionData.fieldErrors.message}</p>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {actionData?.error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">{actionData.error}</div>
              )}

              <div className={styles['submit-button-wrapper']}>
                <LiquidButton
                  type="submit"
                  disabled={isSubmitting}
                  text={isSubmitting ? 'Submitting...' : 'Submit Application'}
                />
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
