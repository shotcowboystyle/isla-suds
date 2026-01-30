import {describe, it, expect, vi} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import {createMemoryRouter, RouterProvider} from 'react-router';
import userEvent from '@testing-library/user-event';
import ContactPage, {meta, action} from '~/routes/contact';

describe('Contact Page', () => {
  it('renders at /contact route', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/contact',
          Component: ContactPage,
        },
      ],
      {
        initialEntries: ['/contact'],
      },
    );

    render(<RouterProvider router={router} />);

    // Page should load without error
    expect(screen.getByRole('heading', {level: 1})).toBeInTheDocument();
  });

  it('exports meta function with correct SEO data', () => {
    const metaResult = meta({} as any);

    expect(metaResult).toEqual(
      expect.arrayContaining([
        expect.objectContaining({title: expect.stringContaining('Contact')}),
        expect.objectContaining({
          name: 'description',
          content: expect.any(String),
        }),
      ]),
    );
  });

  it('displays warm heading', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/contact',
          Component: ContactPage,
        },
      ],
      {
        initialEntries: ['/contact'],
      },
    );

    render(<RouterProvider router={router} />);

    // Should have warm heading like "Let's Talk" or "Get in Touch"
    const heading = screen.getByRole('heading', {level: 1});
    expect(heading.textContent).toMatch(/Let's Talk|Get in Touch/i);
  });

  it('displays expected response time message', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/contact',
          Component: ContactPage,
        },
      ],
      {
        initialEntries: ['/contact'],
      },
    );

    render(<RouterProvider router={router} />);

    expect(
      screen.getByText(/24-48 hours|within 24-48 hours/i),
    ).toBeInTheDocument();
  });

  it('renders form with all required fields', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/contact',
          Component: ContactPage,
        },
      ],
      {
        initialEntries: ['/contact'],
      },
    );

    render(<RouterProvider router={router} />);

    // Should have Name field
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();

    // Should have Email field
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    // Should have Message field
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();

    // Should have Submit button
    expect(
      screen.getByRole('button', {name: /send message/i}),
    ).toBeInTheDocument();
  });

  it('renders form inputs with proper semantic HTML', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/contact',
          Component: ContactPage,
        },
      ],
      {
        initialEntries: ['/contact'],
      },
    );

    render(<RouterProvider router={router} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);

    // Name should be text input
    expect(nameInput).toHaveAttribute('type', 'text');

    // Email should be email input
    expect(emailInput).toHaveAttribute('type', 'email');

    // Message should be textarea
    expect(messageInput.tagName).toBe('TEXTAREA');

    // All should be required
    expect(nameInput).toBeRequired();
    expect(emailInput).toBeRequired();
    expect(messageInput).toBeRequired();
  });

  it('displays email fallback link', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/contact',
          Component: ContactPage,
        },
      ],
      {
        initialEntries: ['/contact'],
      },
    );

    render(<RouterProvider router={router} />);

    const emailLink = screen.getByRole('link', {name: /hello@islasuds.com/i});
    expect(emailLink).toHaveAttribute('href', 'mailto:hello@islasuds.com');
  });
});

describe('Contact Page - Form Submission', () => {
  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(
      [
        {
          path: '/contact',
          Component: ContactPage,
          action: action,
        },
      ],
      {
        initialEntries: ['/contact'],
      },
    );

    render(<RouterProvider router={router} />);

    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'I love your soaps!');

    // Submit form
    await user.click(screen.getByRole('button', {name: /send message/i}));

    // Should show success message
    await waitFor(() => {
      expect(screen.getByText(/thanks for reaching out/i)).toBeInTheDocument();
    });
  });

  it('shows validation errors for empty fields', async () => {
    const formData = new FormData();
    formData.set('name', '');
    formData.set('email', '');
    formData.set('message', '');

    const request = new Request('http://localhost/contact', {
      method: 'POST',
      body: formData,
    });

    const response: any = await action({
      request,
      context: {} as any,
      params: {},
    });

    // data() returns DataWithResponseInit with {data, init} structure
    expect(response.init.status).toBe(400);
    expect(response.data.error).toBeDefined();
    expect(response.data.error).toBe('All fields are required');
  });

  it('validates email format', async () => {
    const formData = new FormData();
    formData.set('name', 'John Doe');
    formData.set('email', 'invalid-email');
    formData.set('message', 'Hello');

    const request = new Request('http://localhost/contact', {
      method: 'POST',
      body: formData,
    });

    const response: any = await action({
      request,
      context: {} as any,
      params: {},
    });

    // data() returns DataWithResponseInit with {data, init} structure
    expect(response.init.status).toBe(400);
    expect(response.data.fieldErrors?.email).toBeDefined();
    expect(response.data.fieldErrors.email).toBe(
      'Please enter a valid email address',
    );
  });
});
