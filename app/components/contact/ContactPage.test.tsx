import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createMemoryRouter, RouterProvider} from 'react-router';
import {PreloaderProvider} from '~/contexts/preloader-context';
import ContactPage from '~/routes/contact';
import type {ContactActionData} from '~/routes/contact';

function renderContact(actionResult?: ContactActionData) {
  const router = createMemoryRouter([{path: '/contact', Component: ContactPage, action: () => actionResult ?? null}], {
    initialEntries: ['/contact'],
  });
  return render(
    <PreloaderProvider>
      <RouterProvider router={router} />
    </PreloaderProvider>,
  );
}

describe('Contact page', () => {
  it('still announces itself as the contact page', () => {
    renderContact();
    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent(/contact isla suds/i);
    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent(/ring ring/i);
  });

  it('labels every slip field, so the memo styling costs nothing in accessibility', () => {
    renderContact();
    expect(screen.getByLabelText(/from \(your name\)/i)).toBeRequired();
    expect(screen.getByLabelText(/write back to \(your email\)/i)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/^message$/i).tagName).toBe('TEXTAREA');
    expect(screen.getByRole('group', {name: /re:/i})).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
    expect(screen.getByRole('button', {name: /send to the goat/i})).toBeInTheDocument();
  });

  it('only asks for an order number when the visitor ticks order help', async () => {
    const user = userEvent.setup();
    renderContact();
    expect(screen.queryByLabelText(/order no\./i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('radio', {name: /order help/i}));
    expect(screen.getByLabelText(/order no\./i)).toBeInTheDocument();

    await user.click(screen.getByRole('radio', {name: /just saying hi/i}));
    expect(screen.queryByLabelText(/order no\./i)).not.toBeInTheDocument();
  });

  it('hands the slip to the goat with the sender name on it after a send', async () => {
    const user = userEvent.setup();
    renderContact({success: true, name: 'Sam'});

    await user.type(screen.getByLabelText(/from/i), 'Sam');
    await user.type(screen.getByLabelText(/write back to/i), 'sam@example.com');
    await user.click(screen.getByRole('radio', {name: /just saying hi/i}));
    await user.type(screen.getByLabelText(/^message$/i), 'Hello goat');
    await user.click(screen.getByRole('button', {name: /send to the goat/i}));

    expect(await screen.findByRole('heading', {name: /message taken/i})).toBeInTheDocument();
    expect(screen.getByText(/thanks, sam\./i)).toBeInTheDocument();
    expect(screen.getByRole('img', {name: /goat.*holding up your message slip/i})).toBeInTheDocument();
    expect(screen.getByText('From: Sam')).toBeInTheDocument();
  });
});
