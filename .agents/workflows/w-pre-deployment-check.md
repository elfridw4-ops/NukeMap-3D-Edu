---
workflow: w-pre-deployment-check
commande: deploy:check
declencheurs:
  - pré-déploiement
  - release gate avant mise en ligne
  - vérification pré-production immédiate
description: Use immediately before deploying or releasing a project. Perform a fast release gate covering code changes, Git state, build, tests, secrets, environment, database, security, technical SEO, performance, responsive behavior, and load readiness. Do not modify the project unless explicitly asked.
---

# PRE-DEPLOYMENT CHECK

## ROLE

Act as a senior release engineer, QA engineer, security engineer, performance engineer, and technical SEO reviewer.

Your mission is to perform the final safety gate before deployment.

This workflow is NOT a full project audit.
It is a targeted final verification of the current release.

Do not modify the project during the check unless the user explicitly requests remediation.

==================================================
PHASE 0 — RELEASE SCOPE
==================================================

Determine:

- current branch
- current commit
- deployment target
- environment
- latest changes
- changed files
- critical modules affected
- production configuration
- database/storage dependencies
- public pages affected
- expected traffic/acquisition profile when documented

Inspect the current Git diff/status when available.

Do not review unrelated historical code unless required to assess a release risk.

==================================================
PHASE 1 — GIT / CHANGESET
==================================================

Check:

- working tree state
- staged/unstaged changes
- unexpected generated files
- debug code
- temporary files
- test artifacts
- local configuration files
- accidental secrets
- unintended modifications

Look for:

- .env files
- credentials
- API keys
- private keys
- debug logging
- test accounts
- mock production data
- temporary bypasses
- disabled security checks

Do not modify or commit anything automatically.

Report suspicious files precisely.

==================================================
PHASE 2 — BUILD GATE
==================================================

Run available release checks:

- dependency installation if required
- typecheck
- lint
- production build
- relevant test suite

Record the actual result:

PASS
FAIL
NOT RUN
NOT ASSESSABLE

Never claim a check passed unless it was actually executed.

A failed production build is a deployment blocker.

==================================================
PHASE 3 — ENVIRONMENT / CONFIGURATION
==================================================

Verify:

- required environment variables
- production API endpoints
- authentication configuration
- database configuration
- storage configuration
- external integrations
- public/private variable separation
- production-only configuration

Never print secret values.

Check that secrets are not exposed to browser/client code.

If a critical production variable cannot be verified, mark it NOT ASSESSABLE.

==================================================
PHASE 4 — DATA / DATABASE SAFETY
==================================================

Check whether the release changes:

- schema
- migrations
- indexes
- security rules
- database queries
- storage paths
- critical calculations
- transaction boundaries

For affected critical data verify:

- source of truth
- atomicity
- idempotency
- concurrency
- rollback/failure behavior
- tenant isolation

Do not modify production data.

Never apply an unverified destructive migration.

If deployment requires an ordering constraint, document it explicitly.

==================================================
PHASE 5 — SECURITY GATE
==================================================

Perform a targeted release security check.

Verify:

- authentication still works
- authorization remains server-side
- admin routes remain protected
- tenant isolation is preserved
- sensitive endpoints remain protected
- secrets remain private
- uploads remain constrained
- webhooks remain verified
- dangerous debug routes are absent
- error responses do not expose internals

Check the release diff for:

- removed authorization
- weakened validation
- client-trusted business values
- disabled security rules
- hardcoded credentials
- unsafe logging

Any confirmed CRITICAL security issue = BLOCKED.

==================================================
PHASE 6 — CRITICAL USER FLOWS
==================================================

Identify only the critical flows affected by this release.

For each affected flow verify:

START
→ INPUT
→ VALIDATION
→ AUTHORIZATION
→ BUSINESS LOGIC
→ DATABASE/API
→ SUCCESS
→ FAILURE

Prioritize:

- authentication
- payments
- financial transactions
- inventory/stock
- subscriptions
- tenant administration
- exports/imports
- destructive actions

Check duplicate submission, API failure, persistence failure, and concurrent execution when relevant.

==================================================
PHASE 7 — TECHNICAL SEO GATE
==================================================

Run this phase only for public/indexable pages.

Check:

- unique title
- useful meta description
- correct lang
- one meaningful H1
- valid H1 → H2 → H3 hierarchy
- canonical URL where required
- indexability
- robots configuration
- sitemap availability when applicable
- internal links
- descriptive URLs
- image alt text
- Open Graph metadata when appropriate
- structured data validity when used
- breadcrumb validity when used
- pagination strategy

Check that:

- indexable pages are not accidentally blocked
- important pages are not canonicalized to the wrong URL
- duplicate pages are controlled
- pagination does not conflict with SEO requirements
- infinite scroll is not used where crawlability requires indexable pagination
- JSON-LD reflects visible/real content

Never invent structured data content, ratings, reviews, or business claims.

==================================================
PHASE 8 — SEO PERFORMANCE INTERACTION
==================================================

Inspect public pages for obvious technical performance issues affecting discovery or rendering.

Check for:

- render-blocking scripts
- unnecessary synchronous third-party widgets
- oversized hero images
- missing image dimensions where layout shift is likely
- inappropriate eager loading
- missing lazy loading for below-the-fold media
- excessive JavaScript required for initial rendering
- expensive visual effects blocking useful content

For headers/navigation, check whether fonts or scripts block rendering when the relevant project architecture makes this observable.

Do not optimize purely for theoretical metrics.

==================================================
PHASE 9 — PERFORMANCE GATE
==================================================

Inspect changed or critical paths for:

- unnecessary requests
- duplicated requests
- unbounded database queries
- excessive client-side datasets
- expensive renders
- oversized assets
- unnecessary polling
- expensive reports/exports
- blocking operations
- expensive animations

Check mobile impact where relevant.

Prefer measurable or directly observable risks.

==================================================
PHASE 10 — LOAD / CAPACITY CHECK
==================================================

Determine the expected traffic model from project documentation, business requirements, analytics, or explicit user-provided acquisition targets.

NEVER INVENT traffic numbers.

When a target volume exists, derive a lightweight capacity model:

- expected requests/users
- expected peak concurrency
- important endpoint/request types
- burst behavior
- expected response latency
- expensive operations
- database pressure
- third-party dependency pressure

Select an appropriate verification level:

LEVEL 0 — LOW TRAFFIC
Static/site vitrine/small internal use.
Check query bounds, obvious bottlenecks, and critical flows.

LEVEL 1 — MODERATE TRAFFIC
Run lightweight load verification if tooling/environment permits.
Focus on critical public/API paths.

LEVEL 2 — HIGH ACQUISITION
Use explicit load testing before release.
Test realistic concurrency and traffic patterns.

LEVEL 3 — UNDEFINED / UNKNOWN
Do not invent a capacity target.
Mark load capacity as NOT ASSESSABLE and recommend defining a traffic target.

When load testing is possible, record:

- concurrency
- duration
- request rate
- success/error rate
- median latency
- p95 latency
- p99 latency when available
- saturation signals
- database behavior
- external service failures

Do not claim scalability based on a successful single-user test.

Do not perform destructive stress testing against production unless explicitly authorized and safely controlled.

==================================================
PHASE 11 — RESPONSIVE RELEASE CHECK
==================================================

Check affected critical pages at:

- ~375px
- normal mobile
- tablet
- desktop

Look for:

- horizontal overflow
- clipping
- broken navigation
- unusable forms
- broken tables
- inaccessible dialogs
- tiny touch targets
- layout shifts
- hidden critical content

A mobile regression affecting a critical workflow is a release risk.

==================================================
PHASE 12 — DATA REALITY CHECK
==================================================

Before deployment verify that production-facing areas contain:

NO:

- fake analytics
- fake users
- fake revenue
- fake subscriptions
- mock transactions
- development projects
- test history
- fake dashboards
- hardcoded business metrics

Every visible business metric must have a real source.

If data does not exist, production should show a professional empty state.

Do not delete data automatically during this workflow.

==================================================
PHASE 13 — OBSERVABILITY / RECOVERY
==================================================

Check whether the release has appropriate:

- error logging
- monitoring
- alerts where required
- audit logs for sensitive operations
- backup/recovery capability
- rollback strategy

A backup that cannot be verified should not be reported as fully tested.

==================================================
PHASE 14 — DEPLOYMENT SAFETY
==================================================

Verify:

- deployment command/configuration
- required environment configuration
- database migration order
- external service configuration
- authentication callbacks
- domain/HTTPS requirements
- cache/CDN behavior when relevant
- rollback path

Determine:

SAFE
RISKY
BLOCKED
NOT ASSESSABLE

Never deploy automatically unless explicitly instructed.

==================================================
PHASE 15 — FINAL GATE
==================================================

Classify each area:

BUILD
SECURITY
DATA
FUNCTIONALITY
SEO
PERFORMANCE
LOAD
RESPONSIVE
CONFIGURATION
RECOVERY

Use:

PASS
PASS WITH RISK
FAIL
NOT ASSESSABLE

Release status:

🟢 READY
No release-blocking issue identified and critical verification is sufficient.

🟡 READY WITH ACCEPTED RISKS
No blocker exists, but documented risks remain.

🟠 NOT READY
Important issues must be fixed before deployment.

🔴 BLOCKED
A critical security, integrity, build, deployment, or business failure prevents safe release.

Do not base the decision on finding count alone.

==================================================
FINAL REPORT
==================================================

Return:

# Pre-Deployment Report

## 1. Release
- branch
- commit
- deployment target
- affected scope

## 2. Gate Results

| Area | Status | Evidence | Risk |
|---|---|---|---|
| Build | | | |
| Security | | | |
| Data | | | |
| Functionality | | | |
| Technical SEO | | | |
| Performance | | | |
| Load | | | |
| Responsive | | | |
| Configuration | | | |
| Recovery | | | |

## 3. BLOCKERS

Only true deployment blockers.

## 4. HIGH RISKS

Issues that should normally be fixed before release.

## 5. LOAD READINESS

Include:

- traffic assumption source
- expected profile
- test level
- actual test results
- capacity concerns
- NOT ASSESSABLE items

## 6. SEO CHECK

Include:

- crawlability
- indexability
- metadata
- canonicals
- sitemap/robots
- structured data
- pagination
- performance risks

## 7. VERIFICATION LOG

For every command/test:

COMMAND
RESULT
EVIDENCE

Never claim unexecuted checks.

## 8. FINAL DECISION

DEPLOY
DEPLOY WITH EXPLICIT RISK ACCEPTANCE
DO NOT DEPLOY

Explain the decision briefly and precisely.

==================================================
REMEDIATION MODE
==================================================

Only modify the project when the user explicitly asks to fix the reported issues.

Then:

1. Fix approved issues only.
2. Preserve unrelated behavior.
3. Apply one logical correction at a time when practical.
4. Run relevant tests after each meaningful correction.
5. Re-run this workflow after remediation.
6. Report exactly what changed and what was verified.

FINAL PRINCIPLE

A deployment gate is a decision system, not a checklist theater.

Do not mark PASS because something "looks fine".

Use evidence.

Do not demand enterprise-grade infrastructure for a small project.

Do not accept fragile architecture for a high-growth project.

Match the verification depth to the actual production risk and expected acquisition volume.