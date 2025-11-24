# Isla Suds Organic Goats Milk Soap with Essential Oils - Product Requirements Document

**Author:** SilkySmooth
**Date:** Monday, November 24, 2025
**Version:** 1.0

---

## Executive Summary

**Vision:** Transform "Isla Suds" from a local family recipe into a recognized organic brand through a storytelling-driven e-commerce platform.
**Core Problem:** Mass-market soaps lack authenticity and transparency. Isla Suds offers a trusted, family-crafted organic alternative.
**Primary User:** Health-conscious consumers seeking authentic, chemical-free products, and local boutiques (wholesale) wanting high-quality local stock.

### What Makes This Special

**Heritage & Authenticity:** The "Family Recipe" narrative. The platform will prioritize "Product Storytelling" (ingredients, process, origin) over simple transactional grids.

---

## Project Classification

**Technical Type:** web_app
**Domain:** general
**Complexity:** medium

**Project Type:** Web Application (E-commerce Storefront + Admin Backend)
**Domain:** Retail / Direct-to-Consumer (DTC)
**Complexity:** Medium (Standard e-commerce features + Wholesale logic)

---

## Success Criteria

**Primary Metric (Volume):** Consistent monthly order volume growth (Targeting 50-100 initial orders/mo).
**Brand Metric:** High engagement time on Product Detail Pages (users reading the "Family Recipe" story).
**Operational Metric:** Seamless order fulfillment flow (0 inventory sync errors).

### Business Metrics

- Monthly Recurring Revenue (MRR) from repeat customers.
- Average Order Value (AOV).
- Conversion Rate (Visitor -> Purchase).

---

## Product Scope

### MVP - Minimum Viable Product

**Core E-commerce (Retail Only):**
- **Story-Driven Storefront:** Homepage, About Us (The Family Recipe), Product Catalog.
- **Product Experience:** Rich Product Detail Pages (PDP) highlighting "Organic" & "Ingredients".
- **Shopping:** Cart, Guest Checkout, Customer Accounts (Optional for MVP).
- **Payments:** Stripe Integration.
- **Shipping:** Standard flat-rate or weight-based shipping (treating Local the same as National).
- **Admin:** Inventory management, Order processing.

### Growth Features (Post-MVP)

**Phase 2 (Wholesale Expansion):**
- B2B Customer Groups (Wholesale vs Retail).
- Price Lists (Wholesale discounts).
- Tax exempt handling.

**Phase 3 (Marketing Ecosystem):**
- Content Blog / Recipe Hub.
- Email Marketing Integration.
- Subscription models (Soap-of-the-month).

### Vision (Future)

A fully integrated lifestyle brand platform where the digital experience mirrors the organic, handmade quality of the physical product.

---

## Domain-Specific Requirements

**Regulatory & Transparency (Organic/Cosmetic):**
- **Ingredient Transparency:** System must support detailed ingredient lists per product (not just description text).
- **Labeling Compliance:** Product images/data must reflect physical packaging claims.

This section shapes all functional and non-functional requirements below.

---

## Innovation & Novel Patterns

**Narrative Commerce:**
Merging content and commerce. The product page isn't just "Buy Soap"; it's "See how this batch was made."

### Validation Approach

- A/B test "Story-first" layouts vs "Product-first" layouts.
- Monitor "Add to Cart" rates specifically from the "Our Story" page.

---

## web_app Specific Requirements

**Headless E-commerce Architecture (MedusaJS):**
- **Storefront API:** Public-facing endpoints for fetching products, categories (collections), and cart management.
- **Admin API:** Secure endpoints for order fulfillment and inventory updates.
- **Image Optimization:** High-quality asset delivery for product visuals (critical for brand feel).

### API Specification

- `GET /products`: Retrieve catalog with "Organic" tags and ingredient metadata.
- `POST /cart`: Manage shopping session.
- `POST /checkout`: Initialize Stripe payment intent.
- `GET /collections`: Filter by scent/type.

### Authentication & Authorization

**Customer:** Email/Password (Standard) + Guest Checkout (Priority for conversion).
**Admin:** Secure Token-based auth for Store Owners.

### Platform Support

**Web:** Responsive Progressive Web App (PWA). Mobile-first design (as social traffic will drive mobile visits).

### Device Capabilities

**Touch Optimization:** Large tap targets for "Add to Cart" on mobile.
**Fast Loading:** Image optimization for mobile data networks.

---

## User Experience Principles

**Visual Authenticity:** Use warmth, texture, and high-quality imagery to convey "Organic/Handmade". Avoid sterile corporate aesthetics.
**Transparency First:** Ingredients and origin stories should be prominent, not hidden in tabs.
**Frictionless Flow:** The transition from "Reading the Story" to "Buying the Product" must be seamless.

### Key Interactions

- **Quick-Add:** Ability to add to cart without leaving the collection page.
- **Ingredient Highlight:** Hover/Tap on ingredients to see their benefits.
- **Visual Search:** Filter soaps by scent profile (Earthy, Floral, Citrus).

---

## Functional Requirements

**1. Product Catalog & Storytelling**
- FR1: Users can view a list of all products, filterable by category (e.g., Scent, Skin Type).
- FR2: Users can view detailed product pages including high-res images, price, and description.
- FR3: Users can view a dedicated "Ingredients" section for each product.
- FR4: System displays inventory status (e.g., "In Stock", "Low Stock").
- FR5: Users can read the "Brand Story/About Us" content on a dedicated page.

**2. Shopping Cart & Checkout**
- FR6: Users can add items to a cart (persisted across session).
- FR7: Users can adjust quantities or remove items from the cart.
- FR8: Users can proceed to checkout as a Guest (no account required).
- FR9: Users can enter shipping address and select shipping method.
- FR10: Users can securely pay via Credit Card (Stripe Integration).
- FR11: Users receive an email confirmation after successful purchase.

**3. Customer Accounts (Basic)**
- FR12: Users can optionally register for an account to save order history.
- FR13: Users can log in to view past orders and current order status.
- FR14: Users can update their saved shipping address.

**4. Admin & Operations (Back Office)**
- FR15: Admins can create, update, and delete products (images, prices, descriptions).
- FR16: Admins can view a list of all orders and filter by status (Pending, Shipped).
- FR17: Admins can update order status (e.g., mark as "Shipped" with tracking number).
- FR18: Admins can manage stock levels manually.
- FR19: System automatically deducts inventory upon successful purchase.

**5. Marketing & SEO**
- FR20: System generates SEO-friendly URLs for all product and content pages.
- FR21: Admins can edit meta titles and descriptions for products.

---

## Non-Functional Requirements

### Performance

- **Load Time:** Homepage and PDPs must load in < 2 seconds on 4G mobile networks.
- **Core Web Vitals:** Must pass Google's Core Web Vitals assessment (LCP, CLS, FID) for SEO ranking.
- **Image Optimization:** All images must be automatically compressed and served via CDN (Next.js Image / Medusa).

### Security

- **PCI Compliance:** Payment processing must be offloaded entirely to Stripe (no raw card data touching our server).
- **SSL/TLS:** 100% HTTPS enforcement.
- **Sanitization:** All user inputs (forms) must be sanitized to prevent XSS/Injection.

### Scalability

- **Traffic Spikes:** Architecture must support sudden traffic spikes from social media marketing (Serverless hosting recommended).

### Accessibility

- **WCAG 2.1 AA:** Color contrast and alt text for all product images to ensure inclusivity.

---

_This PRD captures the essence of Isla Suds Organic Goats Milk Soap with Essential Oils - A digital storefront that translates the "Family Recipe" trust into a high-converting, seamless shopping experience._

_Created through collaborative discovery between SilkySmooth and AI facilitator._
