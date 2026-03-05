/**
 * Shopify Admin REST API helper (server-side only).
 *
 * Used for creating/updating customers with tags and notes — capabilities
 * not available through the Storefront API.
 *
 * Setup: Create a custom app in Shopify Admin → Settings → Apps → Develop apps,
 * grant the `write_customers` scope, and set SHOPIFY_ADMIN_API_TOKEN in env.
 */

const ADMIN_API_VERSION = '2025-01';

interface CustomerInput {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string;
  note?: string;
  acceptsMarketing?: boolean;
}

interface CustomerResult {
  success: boolean;
  error?: string;
}

/**
 * Create a customer in Shopify via the Admin API.
 * If the email already exists, finds the customer and updates their tags/note.
 */
export async function submitToShopify(
  storeDomain: string,
  adminApiToken: string | undefined,
  input: CustomerInput,
): Promise<CustomerResult> {
  if (!adminApiToken) {
    throw new Error('SHOPIFY_ADMIN_API_TOKEN is not configured');
  }

  const baseUrl = `https://${storeDomain}/admin/api/${ADMIN_API_VERSION}`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': adminApiToken,
  };

  const createRes = await fetch(`${baseUrl}/customers.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      customer: {
        email: input.email,
        first_name: input.firstName,
        last_name: input.lastName,
        phone: input.phone,
        tags: input.tags,
        note: input.note,
        accepts_marketing: input.acceptsMarketing ?? false,
        send_email_welcome: false,
      },
    }),
  });

  if (createRes.ok) {
    return {success: true};
  }

  const createData = (await createRes.json()) as {errors?: {email?: string[]}};
  const emailTaken =
    Array.isArray(createData.errors?.email) &&
    createData.errors!.email!.some((msg: string) => msg.includes('taken'));

  if (!emailTaken) {
    return {success: false, error: 'Something went wrong. Please try again.'};
  }

  // Customer already exists — find them and append the new note/tags.
  const searchRes = await fetch(
    `${baseUrl}/customers/search.json?query=email:${encodeURIComponent(input.email)}&limit=1`,
    {headers},
  );

  if (!searchRes.ok) {
    // Customer exists in Shopify, that's still a success from the user's perspective.
    return {success: true};
  }

  const searchData = (await searchRes.json()) as {
    customers?: Array<{id: number; tags: string; note: string}>;
  };
  const existing = searchData.customers?.[0];

  if (!existing) {
    return {success: true};
  }

  // Merge tags (deduplicated) and append note with separator.
  const existingTags = existing.tags ? existing.tags.split(', ') : [];
  const newTags = input.tags ? input.tags.split(', ') : [];
  const mergedTags = [...new Set([...existingTags, ...newTags])].join(', ');

  const appendedNote = input.note
    ? existing.note
      ? `${existing.note}\n\n---\n\n${input.note}`
      : input.note
    : existing.note;

  await fetch(`${baseUrl}/customers/${existing.id}.json`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      customer: {
        id: existing.id,
        tags: mergedTags,
        note: appendedNote,
      },
    }),
  });

  return {success: true};
}
