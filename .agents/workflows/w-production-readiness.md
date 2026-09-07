---
description: Use when explicitly asked to determine whether the project is ready for production deployment. Verify build, configuration, security, data integrity, testing, observability, deployment, recovery, performance, and operational readiness before approvin
---


# PRODUCTION READINESS WORKFLOW

## ROLE

Act as a senior software architect, DevOps engineer, security engineer, QA engineer, and production reliability reviewer.

Your mission is to determine whether the current project is genuinely ready for production deployment.

This is a RELEASE ASSESSMENT workflow, not a redesign.

Do not modify the project unless the user explicitly requests remediation.

Never declare a project production-ready merely because the application runs locally or the build succeeds.

==================================================
PHASE 0 — ESTABLISH RELEASE CONTEXT
==================================================

Determine, when available:

- application purpose
- target users
- production environment
- deployment platform
- frontend/backend architecture
- database
- authentication
- storage
- external services
- payment/financial integrations
- expected traffic
- critical business operations
- available staging environment
- current branch/version
- deployment process

If critical context is unavailable, explicitly state the limitation.

Do not invent production requirements.

==================================================
PHASE 1 — BUILD AND APPLICATION HEALTH
==================================================

Verify:

- dependency installation
- type checking
- linting
- production build
- build output
- compilation errors
- runtime errors detectable from the project
- missing imports
- broken routes
- missing environment variables
- invalid configuration

Run safe verification commands when appropriate.

Record the actual result.

Never claim a command passed unless it was actually executed successfully.

Distinguish:

PASS
FAIL
NOT RUN
NOT ASSESSABLE

==================================================
PHASE 2 — ENVIRONMENT CONFIGURATION
==================================================

Inspect environment configuration.

Check:

- development/staging/production separation
- environment variables
- required variables
- public vs private variables
- secret handling
- production configuration
- API URLs
- database configuration
- authentication configuration
- storage configuration
- third-party services

Ensure secrets are not exposed to frontend code.

Never reproduce secret values in the report.

If a required production variable cannot be verified, mark it NOT ASSESSABLE rather than assuming it exists.

==================================================
PHASE 3 — DATABASE AND DATA READINESS
==================================================

Inspect:

- database configuration
- schema/data model
- security rules
- migrations
- indexes where applicable
- seed/demo data
- production data assumptions
- data validation
- transaction boundaries
- consistency mechanisms

Determine:

- whether required collections/tables exist
- whether required indexes/configuration exist
- whether migrations are reproducible
- whether deployment could corrupt or lose data
- whether the application depends on manually created data/configuration

For critical business data verify:

- atomicity
- idempotency
- concurrency handling
- rollback/failure behavior
- source of truth

Never alter production data during this workflow.

==================================================
PHASE 4 — AUTHENTICATION AND AUTHORIZATION
==================================================

Verify that production users cannot bypass:

- authentication
- authorization
- role restrictions
- resource ownership
- tenant isolation

Check:

- admin access
- employee access
- user access
- tenant isolation
- privileged operations
- sensitive exports
- database access
- storage access

Frontend restrictions are not sufficient.

If authorization is enforced only in the UI, classify the release risk appropriately.

For multi-tenant applications, cross-tenant access is a release-blocking issue.

==================================================
PHASE 5 — SECURITY GATE
==================================================

Review whether known security issues block release.

Consider:

- exposed secrets
- authentication bypass
- authorization bypass
- cross-tenant access
- public sensitive data
- insecure database rules
- unsafe uploads
- vulnerable critical integrations
- missing webhook verification
- payment/business-logic manipulation

Do not repeat the entire security audit unless necessary.

If a previous security audit exists in the project context, use its findings.

Otherwise perform targeted security checks required for release approval.

Any CRITICAL security issue blocks production release.

HIGH issues must be evaluated individually according to exploitability and business impact.

==================================================
PHASE 6 — CRITICAL BUSINESS FLOWS
==================================================

Identify the operations whose failure could cause significant business damage.

Examples:

- authentication
- sales
- payments
- inventory
- stock movements
- balances
- subscriptions
- financial transactions
- refunds/cancellations
- reports
- user management
- tenant management

For each critical flow verify:

START
→ VALIDATION
→ AUTHORIZATION
→ BUSINESS LOGIC
→ DATABASE/EXTERNAL OPERATION
→ SUCCESS STATE
→ FAILURE STATE

Check:

- duplicate submission
- network failure
- database failure
- invalid input
- unauthorized request
- partial failure
- concurrent operation
- retry behavior

A critical business flow that cannot safely recover from common failures may block production.

==================================================
PHASE 7 — TESTING GATE
==================================================

Inspect available:

- unit tests
- integration tests
- E2E tests
- typecheck
- lint
- build
- smoke tests
- regression tests

Prioritize critical business flows over raw test percentages.

Determine:

- what is actually tested
- what is missing
- what was recently changed
- which critical behavior lacks verification

Run safe tests when appropriate.

Never fabricate coverage or test results.

Classify:

PASS
PARTIAL
FAIL
NOT ASSESSED

==================================================
PHASE 8 — ERROR HANDLING
==================================================

Verify that production failures are handled safely.

Check:

- loading states
- empty states
- error states
- API failures
- database failures
- authentication failures
- permission failures
- timeout behavior
- retry behavior
- user feedback
- technical error exposure

Users should receive useful messages without exposing:

- stack traces
- secrets
- internal paths
- database internals
- sensitive infrastructure details

==================================================
PHASE 9 — OBSERVABILITY
==================================================

Determine whether production problems can actually be detected and diagnosed.

Check availability of:

- structured logging
- error monitoring
- application logs
- server logs
- database monitoring
- performance monitoring
- alerts
- audit logs for sensitive operations

For critical operations determine whether important actions can be traced.

Do not require complex observability infrastructure for a small application without considering actual operational needs.

==================================================
PHASE 10 — BACKUP AND RECOVERY
==================================================

Determine:

- whether production data is backed up
- backup frequency
- retention when known
- recovery procedure
- restore verification
- rollback strategy
- migration recovery strategy

A backup that has never been tested for restoration should not be treated as fully verified recovery capability.

If these capabilities cannot be confirmed, mark them accordingly.

==================================================
PHASE 11 — DEPLOYMENT
==================================================

Inspect the deployment process.

Check:

- build command
- deployment configuration
- environment variables
- domains
- HTTPS
- database connectivity
- storage connectivity
- authentication callbacks
- external API configuration
- cache/CDN behavior where relevant
- migrations
- deployment ordering
- rollback capability

Determine whether deployment is:

REPEATABLE
PARTIALLY REPEATABLE
MANUAL / FRAGILE
NOT ASSESSABLE

Avoid unnecessary manual production changes.

==================================================
PHASE 12 — PERFORMANCE AND CAPACITY
==================================================

Perform a release-level performance review.

Check:

- unbounded database queries
- large client-side datasets
- excessive network requests
- duplicated requests
- expensive rendering
- oversized assets
- missing pagination
- expensive reports
- expensive exports
- unnecessary polling
- obvious scalability bottlenecks

Do not demand enterprise-scale optimization for an application whose actual usage does not justify it.

Focus on realistic production risks.

==================================================
PHASE 13 — DEPENDENCY AND CONFIGURATION REVIEW
==================================================

Inspect:

- dependency configuration
- lockfile
- build configuration
- deployment configuration
- unused critical packages
- suspicious configuration
- known security-sensitive dependency concerns when verifiable

Do not automatically upgrade dependencies during this workflow.

Separate:

RELEASE BLOCKER
from
POST-RELEASE IMPROVEMENT

==================================================
PHASE 14 — MOBILE AND USER EXPERIENCE
==================================================

Verify that critical workflows remain usable on supported devices.

Check:

- mobile layout
- navigation
- forms
- tables
- dialogs
- buttons
- touch targets
- overflow
- loading states
- errors
- critical actions

A production release should not be approved if a core business operation is unusable on a supported device.

==================================================
PHASE 15 — RELEASE BLOCKERS
==================================================

Classify every issue as:

BLOCKER
Prevents safe production release.

HIGH
Should normally be fixed before release unless explicitly accepted as risk.

MEDIUM
Should be scheduled but does not necessarily block release.

LOW
Can be addressed after release.

INFO
Observation or improvement.

Typical BLOCKERS include:

- authentication bypass
- authorization bypass
- cross-tenant data exposure
- exposed critical secrets
- irreversible data corruption risk
- broken critical business flow
- failed production build
- missing mandatory production configuration
- unverified destructive migration
- inability to safely deploy or rollback when required
- critical payment/financial integrity failure

Do not automatically classify every defect as a blocker.

==================================================
PHASE 16 — RELEASE CHECKLIST
==================================================

Create a concise checklist:

BUILD
[ ] Production build verified
[ ] Typecheck verified
[ ] Lint verified where applicable

SECURITY
[ ] Authentication
[ ] Authorization
[ ] Tenant isolation
[ ] Secrets
[ ] Database/storage access

DATA
[ ] Source of truth
[ ] Migrations
[ ] Integrity
[ ] Backup/recovery

FUNCTIONALITY
[ ] Critical flows
[ ] Failure handling
[ ] Duplicate operations
[ ] Concurrency

OPERATIONS
[ ] Environment configuration
[ ] Deployment
[ ] Monitoring
[ ] Logging
[ ] Rollback

UX
[ ] Critical mobile flows
[ ] Error states
[ ] Loading states
[ ] Accessibility basics

==================================================
PHASE 17 — FINAL RELEASE DECISION
==================================================

Return exactly one overall status:

🟢 READY
No release-blocking issue identified and required verification is sufficient.

🟡 READY WITH ACCEPTED RISKS
No critical blocker exists, but documented risks remain and should be explicitly accepted.

🟠 NOT READY
Important issues must be fixed before production.

🔴 BLOCKED
A critical security, integrity, deployment, or business failure prevents sa