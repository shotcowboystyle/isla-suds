import {describe, it, expect, vi, beforeEach} from 'vitest';

const {sendMock} = vi.hoisted(() => ({sendMock: vi.fn()}));
vi.mock('resend', () => ({
  Resend: class {
    emails = {send: sendMock};
  },
}));

const {sendContactFormEmail} = await import('./email.server');

const CONTACT = {
  apiKey: 're_test',
  to: 'owner@example.com',
  name: 'Sam',
  email: 'sam@example.com',
  subject: 'Order Support',
  message: 'Hello',
};

describe('sendContactFormEmail', () => {
  beforeEach(() => sendMock.mockReset());

  it('resolves when Resend accepts the email', async () => {
    sendMock.mockResolvedValue({data: {id: 'email_1'}, error: null});
    await expect(sendContactFormEmail(CONTACT)).resolves.toBeUndefined();
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({to: 'owner@example.com', replyTo: 'sam@example.com'}),
    );
  });

  // Resend returns failures instead of throwing; the contact page used to show
  // "Message taken." for emails that were never sent.
  it('throws when Resend reports an error', async () => {
    sendMock.mockResolvedValue({data: null, error: {name: 'validation_error', message: 'Invalid API key'}});
    await expect(sendContactFormEmail(CONTACT)).rejects.toThrow('Resend: Invalid API key');
  });
});
