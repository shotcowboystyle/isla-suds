import type {Route} from './+types/api.$version.[graphql.json]';

export async function action({params, context, request}: Route.ActionArgs) {
  // Parse and validate the GraphQL payload
  let body: any;
  try {
    body = await request.json();
    if (!body || typeof body.query !== 'string') {
      return new Response('Invalid GraphQL payload', {status: 400});
    }
  } catch (error) {
    return new Response('Invalid JSON payload', {status: 400});
  }

  // Filter headers to only forward safe ones
  const allowedHeaders = ['content-type', 'accept'];
  const safeHeaders = new Headers();
  for (const [key, value] of request.headers) {
    if (allowedHeaders.includes(key.toLowerCase())) {
      safeHeaders.set(key, value);
    }
  }

  const response = await fetch(`https://${context.env.PUBLIC_CHECKOUT_DOMAIN}/api/${params.version}/graphql.json`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: safeHeaders,
  });

  return new Response(response.body, {headers: new Headers(response.headers)});
}
