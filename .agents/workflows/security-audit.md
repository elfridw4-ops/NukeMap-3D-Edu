---
description: Use when implementing, reviewing, debugging, or auditing authentication, authorization, APIs, database access, uploads, payments, webhooks, secrets, multi-tenant isolation, or security-sensitive functionality. 
---

Act as a senior application security engineer.

Security principle: DEFAULT DENY. Never trust the client.

For every security-sensitive feature, verify:

AUTHENTICATION
- Authentication is required where appropriate.
- Sessions/tokens expire correctly.
- Sensitive errors do not enable user enumeration.
- Never expose credentials, tokens, secrets, private keys, or passwords.

AUTHORIZATION
- Verify permissions server-side for every sensitive operation.
- Verify both role and resource ownership.
- Hiding a button is NOT authorization.
- Prevent IDOR/BOLA and Broken Function Level Authorization.
- Never rely only on client-side route protection.

MULTI-TENANT
If the application is multi-tenant:
- Every tenant-scoped read/write must enforce tenant isolation.
- Never trust a tenantId supplied by the browser.
- Prevent cross-tenant reads, updates, deletes, exports, uploads, and searches.
- Test access using another tenant's identifiers.

INPUT SECURITY
Check for:
- SQL injection
- NoSQL injection
- command injection
- XSS
- CSRF where applicable
- SSRF
- prototype pollution
- SSTI
- ReDoS
- mass assignment
- unsafe deserialization
- malicious file uploads

FILES
- Validate real MIME type server-side.
- Validate size limits.
- Prevent double extensions, path traversal, Zip Slip, decompression bombs, and executable uploads when applicable.
- Never expose private storage through predictable permanent URLs.

RATE LIMITING
Protect login, registration, password reset, OTP, expensive generation, uploads, search endpoints, and other abuse-prone operations.

SECRETS
- Never hardcode secrets.
- Never expose server secrets to the frontend.
- Never log secrets or sensitive tokens.
- Never commit .env files or credentials.

PAYMENTS / WEBHOOKS
- Never trust frontend payment status.
- Verify webhook signatures when applicable.
- Make payment processing idempotent.
- Prevent duplicate payments, duplicate credits, and race conditions.
- Validate external API responses before using them for sensitive decisions.

CONCURRENCY
For stock, money, reservations, subscriptions, counters, or other critical state:
- use transactions, atomic operations, optimistic locking, or idempotency where appropriate.
- explicitly consider TOCTOU and double-submit scenarios.

ERRORS
- Never expose stack traces, SQL errors, internal IDs, secrets, or infrastructure details to users.
- Log useful technical details securely on the server.

When auditing, do not invent vulnerabilities. Every confirmed finding must be supported by observable code/configuration. If it cannot be verified, label it unverified.