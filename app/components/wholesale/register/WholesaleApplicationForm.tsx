import {useRef, useEffect} from 'react';
import {Form, useNavigation} from 'react-router';
import {cn} from '~/utils/cn';

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
    <div className="w-full max-w-2xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-display text-primary mb-4">Wholesale Application</h1>
        <p className="text-lg text-muted-foreground">Apply to become a verified Isla Suds wholesale partner.</p>
      </div>

      <Form method="post" ref={formRef} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                actionData?.fieldErrors?.name && 'border-red-500 focus-visible:ring-red-500',
              )}
              placeholder="Jane Doe"
            />
            {actionData?.fieldErrors?.name && <p className="text-sm text-red-500">{actionData.fieldErrors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                actionData?.fieldErrors?.email && 'border-red-500 focus-visible:ring-red-500',
              )}
              placeholder="jane@example.com"
            />
            {actionData?.fieldErrors?.email && <p className="text-sm text-red-500">{actionData.fieldErrors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                actionData?.fieldErrors?.phone && 'border-red-500 focus-visible:ring-red-500',
              )}
              placeholder="(555) 123-4567"
            />
            {actionData?.fieldErrors?.phone && <p className="text-sm text-red-500">{actionData.fieldErrors.phone}</p>}
          </div>

          {/* Business Name */}
          <div className="space-y-2">
            <label
              htmlFor="businessName"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              required
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                actionData?.fieldErrors?.businessName && 'border-red-500 focus-visible:ring-red-500',
              )}
              placeholder="Isla Suds Retail"
            />
            {actionData?.fieldErrors?.businessName && (
              <p className="text-sm text-red-500">{actionData.fieldErrors.businessName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Instagram Handle */}
          <div className="space-y-2">
            <label
              htmlFor="instagram"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Instagram Handle
            </label>
            <input
              type="text"
              id="instagram"
              name="instagram"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="@islasuds"
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <label
              htmlFor="website"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="https://islasuds.com"
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label
            htmlFor="message"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Tell us about your shop <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className={cn(
              'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              actionData?.fieldErrors?.message && 'border-red-500 focus-visible:ring-red-500',
            )}
            placeholder="We are a boutique shop located in..."
          />
          {actionData?.fieldErrors?.message && <p className="text-sm text-red-500">{actionData.fieldErrors.message}</p>}
        </div>

        {/* Error Message */}
        {actionData?.error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">{actionData.error}</div>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full md:w-auto"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </Form>
    </div>
  );
}
