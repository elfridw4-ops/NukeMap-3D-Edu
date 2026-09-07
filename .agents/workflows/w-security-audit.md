---
description: Use when explicitly asked to audit application security, authentication, authorization, APIs, database access, multi-tenancy, secrets, storage, uploads, webhooks, payments, or security-sensitive code. Inspect first and report evidence-based findings 
---


# SECURITY AUDIT WORKFLOW

## ROLE

Act as a senior application security engineer and defensive security auditor.

Your mission is to identify real security weaknesses in the application, prove them when possible, determine their impact, classify their severity, and provide precise remediation steps.

This is an AUDIT workflow.

Do NOT modify application code during the audit unless the user explicitly asks for remediation.

Do not exploit vulnerabilities destructively.
Do not access data outside the authorized project.
Do not exfiltrate secrets or sensitive information.
Do not create persistence, backdoors, malware, or destructive proof-of-concepts.

==================================================
PHASE 0 — SCOPE
==================================================

Determine:

- application architecture
- frontend/backend
- framework/runtime
- database
- authentication provider
- authorization model
- roles
- tenant model
- APIs
- storage
- external integrations
- webhooks
- payment systems if applicable
- deployment environment
- security configuration
- relevant environment variables/configuration

Inspect project documentation and security rules when available.

Never assume the documented security model matches the implementation.

==================================================
PHASE 1 — ATTACK SURFACE MAPPING
==================================================

Map the application's attack surface.

Identify:

- public routes
- authenticated routes
- admin routes
- API endpoints
- server actions/functions
- database operations
- storage buckets
- file uploads
- authentication endpoints
- password/reset flows
- invitation flows
- webhooks
- payment callbacks
- external integrations
- search/filter endpoints
- exports
- imports
- administrative operations

For each sensitive entry point determine:

INPUT
→ VALIDATION
→ AUTHENTICATION
→ AUTHORIZATION
→ BUSINESS LOGIC
→ DATA ACCESS
→ OUTPUT

Document missing or weak controls.

==================================================
PHASE 2 — AUTHENTICATION
==================================================

Inspect:

- login
- logout
- registration
- password reset
- email verification
- session management
- token handling
- refresh behavior
- expiration
- account recovery
- invitations
- MFA if implemented

Look for:

- authentication bypass
- insecure session handling
- tokens exposed to client code
- sensitive tokens in URLs
- weak reset flows
- user enumeration
- insecure defaults
- missing expiration
- improper logout
- privilege granted before verification

Do not recommend MFA merely as a generic checklist item.
Determine whether the application's risk profile justifies it.

==================================================
PHASE 3 — AUTHORIZATION
==================================================

Never trust frontend authorization.

For every sensitive operation verify server-side:

- authenticated identity
- role
- resource ownership
- tenant
- permitted action

Check:

- IDOR
- BOLA
- BFLA
- horizontal privilege escalation
- vertical privilege escalation
- unauthorized reads
- unauthorized updates
- unauthorized deletes
- unauthorized exports
- unauthorized administrative operations

Test authorization conceptually or with safe local verification where possible.

Example:

User A → Resource A = allowed
User A → Resource B = must be denied
Employee → Admin action = must be denied
Tenant A → Tenant B = must be denied

A hidden or disabled button is NOT a security control.

==================================================
PHASE 4 — MULTI-TENANT ISOLATION
==================================================

If the application is multi-tenant, treat tenant isolation as CRITICAL infrastructure.

Verify every tenant-scoped operation:

- read
- create
- update
- delete
- search
- filtering
- export
- import
- upload
- download
- reports
- analytics
- notifications
- background jobs

Check whether tenant identity comes from:

SAFE:
authenticated server-side context

UNSAFE:
client-controlled tenantId without server verification

Look for predictable IDs and direct object access.

Verify that:

Tenant A cannot read or mutate Tenant B data.

Never assume Firestore/database rules or application code are sufficient without inspecting both when both exist.

==================================================
PHASE 5 — DATABASE SECURITY
==================================================

Inspect database access patterns and security rules.

Check:

- server-side authorization
- row/document-level isolation
- overly broad reads
- overly broad writes
- public collections
- public documents
- client-controlled fields
- mass assignment
- unsafe update operations
- missing validation
- sensitive fields exposed to clients
- unsafe queries
- unbounded queries
- deletion permissions

For Firestore or similar document databases inspect:

- security rules
- collection/document paths
- authenticated context
- role claims
- tenant checks
- write validation
- update validation
- delete permissions

Never assume a database query is secure because the UI restricts access.

==================================================
PHASE 6 — INPUT VALIDATION
==================================================

Trace untrusted input into:

- database queries
- HTML
- templates
- shell commands
- URLs
- redirects
- file paths
- API calls
- dynamic expressions
- regular expressions

Check applicable risks:

- SQL injection
- NoSQL injection
- XSS
- command injection
- SSRF
- path traversal
- prototype pollution
- SSTI
- unsafe deserialization
- ReDoS
- mass assignment

Validation must occur server-side for security-sensitive operations.

Do not trust:

- hidden fields
- disabled fields
- client-side validation
- client-provided roles
- client-provided prices
- client-provided tenant IDs
- client-provided ownership
- client-provided payment status

==================================================
PHASE 7 — XSS / OUTPUT SECURITY
==================================================

Inspect:

- dangerouslySetInnerHTML
- raw HTML rendering
- markdown rendering
- user-generated content
- rich text
- URL parameters
- DOM manipulation
- third-party content

Determine whether untrusted content can become executable HTML/JavaScript.

Do not recommend sanitization blindly.
Identify the actual rendering context first.

Check appropriate:

- output encoding
- sanitization
- Content Security Policy
- safe URL handling

==================================================
PHASE 8 — API SECURITY
==================================================

For each sensitive endpoint inspect:

- authentication
- authorization
- input validation
- rate limiting
- pagination
- resource ownership
- tenant isolation
- error handling
- response filtering

Check for:

- unrestricted endpoints
- excessive data exposure
- mass assignment
- predictable resource identifiers
- missing rate limits
- unrestricted expensive operations
- inconsistent authorization
- insecure CORS
- internal errors exposed to clients

Never trust request parameters that determine authorization.

==================================================
PHASE 9 — SECRETS
==================================================

Search the repository and configuration for exposed:

- API keys
- passwords
- access tokens
- private keys
- service credentials
- database credentials
- webhook secrets

Check:

- source code
- frontend bundles/configuration
- environment handling
- logs
- error messages
- documentation
- committed configuration

Classify whether a discovered credential is:

- public/client-safe
- sensitive
- secret
- potentially compromised

Do not print actual secret values in the final report.

If a real secret appears exposed, report its location and recommend rotation without reproducing the secret.

==================================================
PHASE 10 — FILE UPLOADS AND STORAGE
==================================================

Inspect:

- upload endpoint
- client validation
- server validation
- MIME validation
- file size limits
- filename handling
- storage path construction
- access permissions
- download authorization
- deletion authorization

Check applicable risks:

- executable uploads
- path traversal
- malicious filenames
- MIME spoofing
- oversized files
- decompression bombs
- public exposure
- predictable storage paths

Verify that private files cannot be retrieved merely by guessing a URL or identifier.

==================================================
PHASE 11 — WEBHOOKS / EXTERNAL INTEGRATIONS
==================================================

For every webhook inspect:

- signature verification
- authentication
- replay protection when appropriate
- timestamp validation when appropriate
- payload validation
- authorization
- idempotency
- duplicate event handling
- error handling

Never trust:

- frontend payment state
- webhook payloads without verification
- external IDs without validation

For payments or financial state:

external event
→ verification
→ validation
→ authorization
→ atomic state change
→ idempotent persistence

A frontend success message is never proof of payment.

==================================================
PHASE 12 — RATE LIMITING / ABUSE
==================================================

Identify abuse-prone operations:

- login
- registration
- password reset
- OTP
- invitations
- search
- expensive queries
- exports
- imports
- file uploads
- report generation
- AI generation
- payment operations

Determine whether limits are appropriate.

Consider:

- IP
- account
- tenant
- endpoint
- operation cost

Do not recommend arbitrary limits without considering legitimate usage.

==================================================
PHASE 13 — CONCURRENCY / BUSINESS LOGIC
==================================================

Security includes business-logic abuse.

Inspect:

- duplicate submissions
- race conditions
- TOCTOU
- replay
- double spending
- double credit
- stock manipulation
- price manipulation
- privilege transitions
- subscription state manipulation

For critical state determine whether the operation requires:

- transaction
- atomic update
- optimistic locking
- idempotency key
- server-side recalculation
- unique constraint

Never trust critical values calculated only by the client.

==================================================
PHASE 14 — ERROR / INFORMATION DISCLOSURE
==================================================

Inspect errors returned to users.

Ensure they do not expose:

- stack traces
- SQL/database errors
- internal filesystem paths
- secret values
- tokens
- private identifiers
- infrastructure details
- unnecessary authorization information

At the same time, errors must remain useful enough for legitimate users.

Technical details should be logged securely server-side when appropriate.

==================================================
PHASE 15 — SECURITY CONFIGURATION
==================================================

Inspect applicable:

- CORS
- CSP
- security headers
- cookie flags
- HTTPS assumptions
- SameSite
- Secure
- HttpOnly
- iframe restrictions
- referrer policy
- permissions policy
- dependency configuration

Do not blindly add security headers that break legitimate functionality.

Evaluate the actual deployment context.

==================================================
PHASE 16 — DEPENDENCIES
==================================================

Inspect dependency configuration for:

- obviously unnecessary packages
- suspicious packages
- outdated security-sensitive packages when version information is available
- duplicated libraries
- excessive attack surface

Do not claim a package is vulnerable without reliable evidence.

Do not upgrade dependencies during the audit.

Report upgrade recommendations separately from confirmed vulnerabilities.

==================================================
PHASE 17 — FINDINGS
==================================================

Severity:

CRITICAL
Severe compro