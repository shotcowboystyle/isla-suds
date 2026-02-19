import {Form, useNavigation} from 'react-router';
import {Button} from '~/components/ui/Button';
import {LiquidButton} from '~/components/ui/LiquidButton';
import {CONTACT_PAGE} from '~/content/contact';
import {cn} from '~/utils/cn';
import styles from './ContactForm.module.css';

interface ContactFormProps {
  actionData?: {
    success: boolean;
    error?: string;
    fieldErrors?: {
      email?: string;
      name?: string;
      message?: string;
    };
  };
}

export function ContactForm({actionData}: ContactFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const {form} = CONTACT_PAGE;

  return (
    <div className={styles['contact-form-wrapper']}>
      <div className={styles['contact-form-heading-wrapper']}>
        <h3 className={styles['contact-form-heading']}>DON&apos;T BE SHY.</h3>
        <h3 className={styles['contact-form-heading']}>HIT US UP AND WE&apos;LL GET BACK TO YOU!</h3>
      </div>

      <Form method="post" className={styles['contact-form-grid']}>
        <input
          type="text"
          name="name"
          required={form.fields.name.required}
          placeholder={form.fields.name.placeholder}
          className={styles['form-input']}
        />

        <input
          type="email"
          name="email"
          required={form.fields.email.required}
          placeholder={form.fields.email.placeholder}
          className={styles['form-input']}
        />

        <select
          name="subject"
          required={form.fields.subject.required}
          className={styles['form-select']}
          defaultValue=""
        >
          <option value="" disabled>
            {form.fields.subject.placeholder}
          </option>
          {form.fields.subject.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="orderNumber"
          placeholder={form.fields.orderNumber.placeholder}
          className={styles['form-input']}
        />

        <textarea
          name="message"
          required={form.fields.message.required}
          rows={6}
          placeholder={form.fields.message.placeholder}
          className={styles['form-textarea']}
        />

        {actionData?.error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{actionData.error}</div>}

        <div className={styles['form-button-wrapper']}>
          <LiquidButton
            type="submit"
            disabled={isSubmitting}
            text={isSubmitting ? form.submit.submitting : form.submit.default}
          />
        </div>
      </Form>
    </div>
  );
}
