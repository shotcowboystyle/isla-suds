import {useFetcher, useActionData, data} from 'react-router';
import {ContactForm} from '~/components/contact/ContactForm';
import {ContactHeader} from '~/components/contact/ContactHeader';
import {CONTACT_PAGE} from '~/content/contact';
import type {Route} from './+types/contact';

export const meta: Route.MetaFunction = () => {
  return [{title: CONTACT_PAGE.meta.title}, {name: 'description', content: CONTACT_PAGE.meta.description}];
};

export async function action({request}: Route.ActionArgs) {
  const formData = await request.formData();
  const name = String(formData.get('name') || '');
  const email = String(formData.get('email') || '');
  const subject = String(formData.get('subject') || '');
  const orderNumber = String(formData.get('orderNumber') || '');
  const message = String(formData.get('message') || '');

  // Validation - required fields
  if (!name || !email || !subject || !message) {
    return data({error: 'Please fill in all required fields'}, {status: 400});
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return data({fieldErrors: {email: 'Please enter a valid email address'}}, {status: 400});
  }

  // TODO: Send email via Shopify Forms or external service
  console.log('Contact form submission:', {
    name,
    email,
    subject,
    orderNumber,
    message,
  });

  return data({success: true});
}

export default function ContactPage() {
  const actionData = useActionData<{
    success: boolean;
    error?: string;
    fieldErrors?: {email: string};
  }>();

  return (
    <div className="relative min-h-screen bg-black overflow-hidden pt-16">
      {/* Background Image Placeholder - using a gradient/solid color for now,
          in a real implementation this would be the chocolate splash image */}
      <div className="absolute inset-0 z-0">
        {/* Placeholder for the chocolate splash background */}
        {/* <div className="absolute inset-0 bg-linear-to-br from-[#5D4037] to-[#3E2723]" /> */}
        {/* You can add an image here later:
         <img src="/path/to/chocolate-splash.jpg" alt="Background" className="w-full h-full object-cover" />
         */}
      </div>

      <div className="flex justify-center items-center w-auto h-auto overflow-hidden pt-[7vw] pb-0 bg-position-[35%_40%] bg-cover sm:bg-center md:pb-[5vw]">
        <div className="w-screen h-auto pt-[100px] sm:pt-[10vw] md:pt-0 md:px-[2vw]">
          <div className="relative grid max-md:auto-cols-[1fr] max-md:gap-10 grid-cols-[1fr] md:grid-cols-[1fr_1fr] md:grid-rows-[auto_auto] z-2 grid-rows-[auto] h-full">
            <ContactHeader className="place-self-center px-4 justify-self-center text-secondary text-center md:text-left" />

            {/* <div className="w-full lg:w-1/2"> */}
            {!actionData?.success ? (
              <ContactForm actionData={actionData} />
            ) : (
              <div className="bg-secondary rounded-4xl p-12 text-center shadow-2xl">
                <h2 className="text-3xl font-bold text-black mb-4">{CONTACT_PAGE.successMessage}</h2>
                <p className="text-black/80">We&apost;ll get back to you shortly.</p>
              </div>
            )}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
