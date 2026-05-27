# Marketing & Tech Stack — Natural Wine Festival A'dam

> Where the brand, ticketing, and CRM/marketing live, and how they connect.
> Decided May 2026. Companion to `REDESIGN-PLAN.md` and `CMS-CONTENT-DECISION.md`.

## Principle — three systems, clean separation

| Layer | Tool | Owns |
|-------|------|------|
| **Brand & experience** | Custom static site | The brand: homepage-as-poster, winemakers, programme, journal |
| **Transactions** | **Eventix** (stays) | Tickets, Winemaker's Dinner, workshops, QR e-tickets, door scanning |
| **Relationships & data** | **GoHighLevel (GHL)** | CRM, one email system, automations, attribution |

```
Custom static site  →  brand · experience · journal      (GitHub → Coolify)
        │ links / embeds ↓
Eventix             →  tickets · dinner · workshops · QR · door scan   (stays)
        │ purchase webhook ↓
GoHighLevel         →  CRM · email/SMS · automations · attribution
```

## Why GHL

Solves three current pains:
- **No CRM today** → one contact record for every sub, buyer, trade contact, past attendee.
- **Disjointed email** → consolidates all *marketing* email into one system.
- **Attribution too slow** → campaign → revenue visible in near real-time.

Implementation capacity is **not** a constraint: we have an in-house GHL team (Philippines).

## Why Eventix stays (not GHL for ticketing)

GHL is a CRM with order forms, **not** event ticketing. Eventix natively handles what a festival needs and GHL can't: capacity/inventory caps, ticket tiers, QR e-tickets, **door scanning**, waitlists, refunds/transfers, and per-session workshop + Dinner booking. Eventix owns the transaction and the trust at checkout.

## Attribution wiring (the key fix)

Checkout happens *on Eventix* (off-site) — that split is why attribution is slow today. Fix it in two moves:

1. **Capture source before the handoff.** All campaign links carry UTMs → land on the custom site → GHL tags the contact with source/campaign. The *who* and *where-from* are known before Eventix.
2. **Join the purchase back.** Eventix purchase **webhook → GHL** → match on email → mark contact "purchased" → attribute to the original campaign.

## Rules

- **Transactional email** (ticket, QR, order confirmation) → stays on **Eventix**. Don't fight it.
- **Marketing / lifecycle email** → moves to **GHL** (kills the disjointed setup).
- **GHL sits BEHIND the site.** Build on-brand forms that POST to GHL's API; **never** paste GHL iframe/embeds onto the premium site (heavy, off-brand).
- Custom site deploy: **GitHub → Coolify** (per `REDESIGN-PLAN.md`).

## To verify with Eventix (before the PH team builds)

- **(a)** Does the purchase webhook include buyer email + order details? *(almost certainly yes)*
- **(b)** Can we append custom query params (GHL contact ID / UTM) to the Eventix checkout URL and get them **echoed back** in the webhook?
  - Yes → attribution is airtight.
  - No → email-matching only (still good).

## Open / next

- GHL data model: contact fields + tags (**consumer / trade / past-attendee**), pipelines (trade & press, sponsors).
- UTM naming convention.
- On-brand newsletter capture form → GHL API.
- Sending domain + sender setup + warmup.
