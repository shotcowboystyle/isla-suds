import {useFetcher, useActionData, Form, data} from 'react-router';
import {CONTACT_PAGE} from '~/content/contact';
import type {Route} from './+types/contact';

export const meta: Route.MetaFunction = () => {
  return [
    {title: CONTACT_PAGE.meta.title},
    {name: 'description', content: CONTACT_PAGE.meta.description},
  ];
};

export async function action({request}: Route.ActionArgs) {
  const formData = await request.formData();
  const name = String(formData.get('name') || '');
  const email = String(formData.get('email') || '');
  const message = String(formData.get('message') || '');

  // Validation - all fields required
  if (!name || !email || !message) {
    return data(
      {error: 'All fields are required'},
      {status: 400},
    );
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return data(
      {fieldErrors: {email: 'Please enter a valid email address'}},
      {status: 400},
    );
  }

  // TODO: Send email via Shopify Forms or external service
  // For now, we just return success
  // Actual email sending will be implemented in Task 4
  console.log('Contact form submission:', {name, email, message});

  return data({success: true});
}

export default function ContactPage() {
  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher<typeof action>();
  return (
    <div className="min-h-screen">
      <div className="px-6 sm:px-10 py-12 sm:py-20 max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-fluid-display mb-4 text-[var(--text-primary)]">
            {CONTACT_PAGE.heading}
          </h1>
          <p className="text-fluid-body text-[var(--text-muted)]">
            {CONTACT_PAGE.subheading}
          </p>
        </header>

        {/* Success Message */}
        {actionData?.success && (
          <div className="mb-6 p-4 bg-[var(--canvas-elevated)] border border-[var(--accent-primary)] border-opacity-30 rounded-sm">
            <p className="text-fluid-body text-[var(--accent-primary)]">
              {CONTACT_PAGE.successMessage}
            </p>
          </div>
        )}

        {/* Error Message */}
        {actionData?.error && (
          <div className="mb-6 p-4 bg-[var(--canvas-elevated)] border border-red-500 border-opacity-30 rounded-sm">
            <p className="text-fluid-body text-red-600">{actionData.error}</p>
          </div>
        )}

        {/* Contact Form */}
        {!actionData?.success && (
          <Form method="post" className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-fluid-body text-[var(--text-primary)] mb-2"
            >
              {CONTACT_PAGE.form.fields.name.label}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder={CONTACT_PAGE.form.fields.name.placeholder}
              className="w-full px-4 py-3 text-fluid-body bg-[var(--canvas-elevated)] border border-[var(--text-muted)] border-opacity-20 rounded-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-fluid-body text-[var(--text-primary)] mb-2"
            >
              {CONTACT_PAGE.form.fields.email.label}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder={CONTACT_PAGE.form.fields.email.placeholder}
              className="w-full px-4 py-3 text-fluid-body bg-[var(--canvas-elevated)] border border-[var(--text-muted)] border-opacity-20 rounded-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
              aria-describedby={
                actionData?.fieldErrors?.email ? 'email-error' : undefined
              }
            />
            {actionData?.fieldErrors?.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {actionData.fieldErrors.email}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <label
              htmlFor="message"
              className="block text-fluid-body text-[var(--text-primary)] mb-2"
            >
              {CONTACT_PAGE.form.fields.message.label}
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              placeholder={CONTACT_PAGE.form.fields.message.placeholder}
              className="w-full px-4 py-3 text-fluid-body bg-[var(--canvas-elevated)] border border-[var(--text-muted)] border-opacity-20 rounded-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent resize-y"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={fetcher.state === 'submitting'}
            className="w-full sm:w-auto px-8 py-3 text-fluid-body bg-[var(--accent-primary)] text-white rounded-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {fetcher.state === 'submitting'
              ? CONTACT_PAGE.form.submit.submitting
              : CONTACT_PAGE.form.submit.default}
          </button>
        </Form>
        )}

        {/* Email fallback */}
        <div className="mt-8 pt-8 border-t border-[var(--text-muted)] border-opacity-20">
          <p className="text-fluid-body text-[var(--text-muted)]">
            {CONTACT_PAGE.emailFallback.text}{' '}
            <a
              href={`mailto:${CONTACT_PAGE.emailFallback.email}`}
              className="text-[var(--accent-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2"
            >
              {CONTACT_PAGE.emailFallback.email}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
