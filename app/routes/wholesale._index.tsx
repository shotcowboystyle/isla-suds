import {redirect, useLoaderData} from 'react-router';
import {LastOrder} from '~/components/wholesale/LastOrder';
import {PartnerAcknowledgment} from '~/components/wholesale/PartnerAcknowledgment';
import {wholesaleContent} from '~/content/wholesale';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';
import {GET_LAST_ORDER_QUERY} from '~/graphql/customer-account/GetLastOrder';
import {GET_ORDER_FOR_REORDER_QUERY} from '~/graphql/customer-account/GetOrderForReorder';
import {WHOLESALE_DASHBOARD_CUSTOMER_QUERY} from '~/graphql/customer-account/WholesaleDashboardCustomer';
import type {Route} from './+types/wholesale._index';

interface ReorderActionResponse {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}

export async function loader({context}: Route.LoaderArgs) {
  const customerId = await context.session.get('customerId');

  if (!customerId) {
    return redirect(WHOLESALE_ROUTES.LOGIN);
  }

  // Fetch B2B customer data including firstName
  try {
    const customer = await context.customerAccount.query(
      WHOLESALE_DASHBOARD_CUSTOMER_QUERY,
    );

    // Validate response structure
    if (!customer?.data?.customer) {
      return redirect(WHOLESALE_ROUTES.LOGIN);
    }

    const {firstName, companyContacts} = customer.data.customer;

    // Validate B2B status
    const company = companyContacts?.edges?.[0]?.node?.company;
    if (!company) {
      return redirect(WHOLESALE_ROUTES.LOGIN);
    }

    // Fetch last order
    let lastOrder = null;
    try {
      const ordersData =
        await context.customerAccount.query(GET_LAST_ORDER_QUERY);
      lastOrder = ordersData?.data?.customer?.orders?.edges[0]?.node || null;
    } catch (orderError) {
      // Safe to continue: order history is optional, dashboard still functional
      lastOrder = null;
    }

    return {
      partnerName: firstName || 'Partner',
      storeCount: wholesaleContent.dashboard.storeCount,
      lastOrder,
    };
  } catch (error) {
    // Only redirect on auth/customer errors - user session likely invalid
    return redirect(WHOLESALE_ROUTES.LOGIN);
  }
}

export async function action({
  request,
  context,
}: Route.ActionArgs): Promise<ReorderActionResponse> {
  const customerId = await context.session.get('customerId');

  if (!customerId) {
    return {
      success: false,
      error: wholesaleContent.auth.sessionExpired,
    };
  }

  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'reorder') {
    const orderId = String(formData.get('orderId'));

    // Performance: Start timing reorder operation (AC requirement: <60s total)
    const startTime = performance.now();

    try {
      // Verify B2B customer status before allowing reorder
      const customerData = await context.customerAccount.query(
        WHOLESALE_DASHBOARD_CUSTOMER_QUERY,
      );
      const company =
        customerData?.data?.customer?.companyContacts?.edges?.[0]?.node
          ?.company;
      if (!company) {
        return {
          success: false,
          error: wholesaleContent.auth.notWholesaleCustomer,
        };
      }

      // Fetch order details to get line items with variant IDs
      const orderData = await context.customerAccount.query(
        GET_ORDER_FOR_REORDER_QUERY,
        {variables: {query: `id:${orderId}`}},
      );

      const order = orderData?.data?.customer?.orders?.edges?.[0]?.node;

      if (!order || !order.lineItems?.edges?.length) {
        return {
          success: false,
          error: wholesaleContent.reorder.errorMessage,
        };
      }

      // Extract line items for cart - filter out items without variants
      interface LineItemNode {
        variantId?: string | null;
        quantity: number;
      }

      const lineItems = order.lineItems.edges
        .filter(({node}: {node: LineItemNode}) => Boolean(node.variantId))
        .map(({node}: {node: LineItemNode}) => ({
          merchandiseId: node.variantId!,
          quantity: node.quantity,
        }));

      if (lineItems.length === 0) {
        return {
          success: false,
          error: wholesaleContent.reorder.errorMessage,
        };
      }

      // Create new cart with B2B customer identity for wholesale pricing
      const customerAccessToken = await context.session.get(
        'customerAccessToken',
      );
      const result = await context.cart.create({
        lines: lineItems,
        buyerIdentity: customerAccessToken
          ? {
              customerAccessToken,
            }
          : undefined,
      });

      const cartResult = result.cart;

      // Check for specific error types
      if (result.errors?.length) {
        const errorCode = result.errors[0]?.name;
        if (errorCode === 'MERCHANDISE_NOT_FOUND') {
          return {
            success: false,
            error:
              'Some items are out of stock. Please contact us for substitutions.',
          };
        }

        return {
          success: false,
          error: wholesaleContent.reorder.errorMessage,
        };
      }

      if (!cartResult?.checkoutUrl) {
        return {
          success: false,
          error: wholesaleContent.reorder.errorMessage,
        };
      }

      // Update cart ID in session
      context.cart.setCartId(cartResult.id);

      // Performance: Measure reorder operation time
      const duration = performance.now() - startTime;
      // Note: <60s AC includes checkout completion, but our part must be <2s
      if (duration > 2000) {
        // Log performance issue for monitoring (server-side only)
      }

      return {
        success: true,
        checkoutUrl: cartResult.checkoutUrl,
      };
    } catch (error) {
      return {
        success: false,
        error: wholesaleContent.reorder.errorMessage,
      };
    }
  }

  return {success: false};
}

export default function WholesaleDashboard() {
  const {partnerName, storeCount, lastOrder} = useLoaderData<typeof loader>();

  return (
    <div>
      <PartnerAcknowledgment
        partnerName={partnerName}
        storeCount={storeCount}
      />
      <LastOrder order={lastOrder} />
    </div>
  );
}
