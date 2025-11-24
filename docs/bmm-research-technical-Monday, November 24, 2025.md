# Technical Research Report: Isla Suds E-commerce Platform
**Date:** November 24, 2025

## 1. Executive Summary
For the "Isla Suds" Organic Goats Milk Soap project, we have selected **MedusaJS** as the core e-commerce platform. This decision is driven primarily by the unique requirement for **Wholesale/B2B capabilities** on a **tight budget ($20/mo)**, while leveraging the team's existing **Vue/React/Node.js** expertise. MedusaJS provides a headless, API-first architecture that allows for a custom storefront and powerful admin features without the high recurring costs of enterprise SaaS solutions.

## 2. Requirements and Constraints

### Functional Requirements
-   **Core:** Inventory Management, Payment Processing (Stripe), Order Management.
-   **Channels:** Single storefront initially, supporting both Retail and Wholesale customers.
-   **Wholesale Specifics:** Needs "Customer Groups" and "Price Lists" to offer different pricing to wholesale accounts.
-   **User Interface:** Simple landing page initially, evolving into full store. Admin interface must be usable by non-technical staff.

### Non-Functional Requirements
-   **Performance:** Target <100ms load times (Headless architecture supports this).
-   **Scalability:** Costs should scale with traffic (Serverless/PaaS hosting).
-   **Security:** Standard e-commerce security (PCI compliance handled via Stripe).

### Constraints
-   **Tech Stack:** Team prefers Vue, React, or Node.js.
-   **Budget:** Target ~$20/month for hosting.
-   **Type:** Greenfield project (fresh start).

## 3. Technology Options Evaluated

### Option 1: MedusaJS (Self-Hosted)
-   **Stack:** Node.js Backend + React Admin + Next.js/Nuxt Storefront.
-   **Model:** Open Source (MIT). Self-hosted.

### Option 2: Shopify Basic (Headless)
-   **Stack:** SaaS Backend + React (Hydrogen) Storefront.
-   **Model:** SaaS Subscription ($39/mo+).

### Option 3: Supabase + Stripe (Custom)
-   **Stack:** Postgres + Node.js + Stripe API.
-   **Model:** Backend-as-a-Service (Usage-based).

## 4. Detailed Profiles

### MedusaJS
-   **Pros:** Native B2B features (Price lists, groups), full code control, free license, fits strict budget.
-   **Cons:** Self-hosting requires DevOps effort (Postgres/Redis management).

### Shopify Basic
-   **Pros:** Zero maintenance, massive ecosystem.
-   **Cons:** Wholesale features locked behind expensive "Plus" plan, API rate limits on Basic plan restrict headless scaling.

## 5. Comparative Analysis

| Feature | MedusaJS | Shopify Basic | Supabase + Stripe |
| :--- | :--- | :--- | :--- |
| **Wholesale (B2B)** | **Native** | Limited/Expensive | Manual Build |
| **Monthly Cost** | **Low (~$15)** | High ($39+) | Low/Variable |
| **Dev Control** | **High** | Medium | High |
| **Admin UI** | **Included** | Excellent | None |

## 6. Trade-off Analysis
Choosing MedusaJS means trading **operational simplicity** (Shopify's "it just works") for **financial efficiency and feature power**. You accept the responsibility of managing a server and database in exchange for getting enterprise-grade B2B features for free.

## 7. Real-World Evidence
MedusaJS has matured significantly by 2025 ("Medusa 2.0"), with a strong community of developers migrating from Shopify. It is battle-tested for high-volume stores, though users report that the initial learning curve for deployment is steeper than SaaS.

## 8. Recommendations
**Primary Choice: MedusaJS**
-   **Host:** Railway.app (Hobby/Pro tier) or DigitalOcean Droplet.
-   **Storefront:** Next.js (React) or Nuxt (Vue) Starter.
-   **Database:** Managed Postgres (Neon or Railway).

**Implementation Roadmap:**
1.  Initialize Medusa Backend project.
2.  Deploy to PaaS (Railway recommended for ease).
3.  Configure Stripe plugin.
4.  Set up "Wholesale" customer group and price list logic.
5.  Build storefront using Medusa's Next.js starter template.

## 9. Architecture Decision Record (ADR)
*See attached ADR-001 for formal record.*

## 10. Next Steps
-   Proceed to **Architecture Design** phase to map out the specific data models and API integrations.
-   Begin **Product Requirements Document (PRD)** to detail the specific user flows for Wholesale vs Retail customers.
