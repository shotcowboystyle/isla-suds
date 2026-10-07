import {data, useActionData} from 'react-router';
import {ContactHero} from '~/components/contact/ContactHero';
import {MessageDesk} from '~/components/contact/MessageDesk';
import {CONTACT_PAGE} from '~/content/contact';
import {sendContactFormEmail} from '~/lib/email.server';
import {emailValidator, extractFields} from '~/utils/form-validation';
import {createMeta} from '~/utils/meta';
import type {Route} from './+types/contact';

export const meta: Route.MetaFunction = createMeta(CONTACT_PAGE.meta);

/** The slip's ballpoint hand; preloaded so typing never swaps font mid-word. */
export const links: Route.LinksFunction = () => [
  {rel: 'preload', href: '/fonts/Caveat-latin.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous'},
];

export type ContactActionData = {
  success?: boolean;
  /** Echoed back so the goat can hold a slip with the sender's name on it. */
  name?: string;
  error?: string;
  fieldErrors?: {email?: string};
};

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const {name, email, subject, orderNumber, message} = extractFields(
    formData,
    'name',
    'email',
    'subject',
    'orderNumber',
    'message',
  );

  if (!name || !email || !subject || !message) {
    return data<ContactActionData>({error: CONTACT_PAGE.slip.required}, {status: 400});
  }

  const emailError = emailValidator(email);
  if (emailError) {
    return data<ContactActionData>({fieldErrors: {email: emailError}}, {status: 400});
  }

  const founderEmail = context.env.FOUNDER_EMAIL;
  const resendApiKey = context.env.RESEND_API_KEY;

  if (!founderEmail || !resendApiKey) {
    return data<ContactActionData>({error: CONTACT_PAGE.slip.busy}, {status: 500});
  }

  try {
    await sendContactFormEmail({
      apiKey: resendApiKey,
      to: founderEmail,
      name,
      email,
      subject,
      orderNumber: orderNumber || undefined,
      message,
    });
  } catch (error) {
    console.error('Contact form email failed', error);
    return data<ContactActionData>({error: CONTACT_PAGE.slip.busy}, {status: 500});
  }

  return data<ContactActionData>({success: true, name});
}

export default function ContactPage() {
  const actionData = useActionData<ContactActionData>();

  return (
    <>
      <ContactHero />
      <MessageDesk actionData={actionData} />
    </>
  );
}
