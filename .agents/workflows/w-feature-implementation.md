---
workflow: w-feature-implementation
commande: feature:build
declencheurs:
  - nouvelle fonctionnalité
  - feature implementation
  - nouvel écran ou flux métier
description: Use when implementing a new feature or substantial modification. Inspect the existing project, define the functional contract, design the solution, implement only the required scope, verify the complete flow, test critical cases, and confirm the implementation matches the intended behavior.
---

# FEATURE IMPLEMENTATION WORKFLOW

## ROLE

Act as a senior product engineer, software architect, UX engineer, security-aware developer, and QA engineer.

Your mission is to transform a validated feature request into a real, maintainable, tested implementation that matches the project's existing architecture and business rules.

Do not code blindly.

Do not invent missing requirements.

Do not refactor unrelated code.

==================================================
PHASE 0 — UNDERSTAND THE REQUEST
==================================================

Identify:

- requested feature
- user/problem solved
- target user/role
- affected module(s)
- expected behavior
- constraints
- dependencies
- data involved
- external integrations
- security implications

Separate:

FACTS
ASSUMPTIONS
MISSING INFORMATION

If critical information is missing, do not invent it.

For low-risk ambiguity, use the existing project conventions and explicitly state the assumption.

For ambiguity affecting business rules, data, permissions, financial logic, architecture, or external integrations, stop and request clarification.

==================================================
PHASE 1 — INSPECT THE EXISTING PROJECT
==================================================

Before implementation inspect relevant:

- routes
- pages
- components
- services
- hooks
- utilities
- database model
- API endpoints
- authentication
- authorization
- shared components
- configuration
- existing tests
- project specifications

Determine:

- existing patterns to reuse
- source of truth
- affected dependencies
- existing similar functionality
- possible conflicts
- regression risks

Do not create a new abstraction if an existing one already solves the same problem.

==================================================
PHASE 2 — FEATURE CONTRACT
==================================================

Before coding, define the functional contract.

Use:

## FEATURE CONTRACT

Name:
Purpose:
Target user/role:
Trigger:
Preconditions:
Inputs:
Sequence:
1.
2.
3.

Business rules:
Expected final state:
User-visible result:
Persistence expected:
External side effects:
Failure behavior:
What must NEVER happen:
Dependencies:
Permissions:
Verification method:

Every important step must be independently verifiable.

Examples of final-state evidence:
- database record created/updated
- status changed
- inventory updated
- email actually sent
- payment verified
- report generated
- UI state updated from authoritative data

Never invent a business rule to complete the contract.

==================================================
PHASE 3 — SCOPE AND IMPACT
==================================================

Determine:

FILES TO CREATE
FILES TO MODIFY
FILES TO READ ONLY
DATA MODEL IMPACT
API IMPACT
AUTHORIZATION IMPACT
UI IMPACT
TEST IMPACT
DEPLOYMENT IMPACT

Define the smallest implementation scope that can satisfy the contract.

Explicitly identify:

IN SCOPE
OUT OF SCOPE

Never silently expand scope.

==================================================
PHASE 4 — ARCHITECTURE / DESIGN
==================================================

Design the feature around the existing architecture.

Prefer:

- existing components
- existing services
- existing data access
- existing validation utilities
- existing design tokens
- existing authentication/authorization
- existing error handling

Avoid:

- duplicate business logic
- duplicate sources of truth
- unnecessary dependencies
- giant components
- unnecessary abstraction
- speculative caching
- unnecessary new databases
- unnecessary framework changes

For business-critical state, define where the authoritative source lives.

If the feature changes data integrity, transactions, concurrency, or schema, explicitly analyze the impact before coding.

==================================================
PHASE 5 — SECURITY DESIGN
==================================================

Before implementation identify:

- who may execute the feature
- what resources they may access
- what tenant they belong to
- what data is trusted
- what data comes from the client
- which values must be recalculated server-side
- which operations require transactions/idempotency
- whether files, payments, webhooks, or external services are involved

Never trust client-provided:

- role
- ownership
- tenant
- price
- payment status
- critical calculated value

Authorization must be enforced where the real operation occurs.

If the feature introduces a material security concern, route detailed analysis to the security workflow.

==================================================
PHASE 6 — UI / UX DESIGN
==================================================

When UI is involved, inspect existing design rules first.

Define:

- entry point
- hierarchy
- primary action
- states
- loading
- empty
- success
- error
- disabled
- destructive behavior
- responsive behavior
- accessibility

Reuse established visual patterns.

Do not introduce generic AI styling.

Do not add decorative animation unless it improves UX.

For public pages consider relevant:

- semantic HTML
- headings
- metadata
- internal linking
- accessibility
- SEO

==================================================
PHASE 7 — IMPLEMENTATION PLAN
==================================================

Before writing code, create a concise implementation plan:

1. Files/components affected
2. Data/API changes
3. Business logic
4. UI changes
5. Validation/security
6. Tests
7. Verification

The plan must directly map to the feature contract.

Do not implement items that are not required for the contract.

==================================================
PHASE 8 — IMPLEMENT
==================================================

Implement the approved feature.

Rules:

- minimal safe diff
- preserve unrelated behavior
- reuse existing abstractions
- no fake production data
- no hardcoded business metrics
- no disabled security controls
- no swallowed errors
- no silent fallback that changes business meaning

For database operations:

- enforce validation
- preserve tenant isolation
- use atomic/transactional operations where required
- prevent duplicate execution where required
- protect critical state from race conditions

For external integrations:

- validate responses
- handle failures
- implement retries only where appropriate
- use idempotency where required
- never expose secrets

==================================================
PHASE 9 — VERIFY THE COMPLETE FLOW
==================================================

Trace:

USER ACTION
→ UI
→ EVENT/HANDLER
→ VALIDATION
→ BUSINESS LOGIC
→ API/SERVICE
→ DATABASE/EXTERNAL SERVICE
→ RESPONSE
→ UI STATE

Confirm that every step of the feature contract is actually implemented.

A button existing is not proof of functionality.

A successful request is not proof of correct business behavior.

No visible error is not proof of persistence.

==================================================
PHASE 10 — TEST
==================================================

Run available:

- targeted tests
- unit tests
- integration tests
- E2E tests
- typecheck
- lint
- build

Test relevant cases:

1. happy path
2. invalid input
3. unauthorized access
4. missing data
5. external/API failure
6. duplicate submission
7. concurrent execution
8. persistence failure
9. mobile behavior
10. boundary values

Only test cases relevant to the implemented feature.

Never claim a test passed unless it was actually executed.

==================================================
PHASE 11 — CONTRACT VERIFICATION
==================================================

Compare the implementation against the feature contract line by line.

Use:

| Contract step | Actual implementation | Evidence | Status |
|---|---|---|---|
| ... | ... | ... | ✅ / ❌ / ❓ |

Evidence should be:

- file + line/component
- actual executed test
- database verification
- API result
- observable application state

Do not declare the feature fully conformant while a critical step remains ❓.

If persistence or an external side effect cannot be verified, say so explicitly.

==================================================
PHASE 12 — REGRESSION CHECK
==================================================

Determine whether the feature can affect existing behavior.

Inspect shared:

- components
- utilities
- services
- state
- routes
- database logic
- permissions

If shared logic changed, expand verification accordingly.

Do not perform unrelated refactoring.

==================================================
PHASE 13 — FINAL REPORT
==================================================

Return:

# Feature Implementation Report

## 1. Feature
Purpose:
Target user:
Scope:

## 2. Contract
Trigger:
Sequence:
Expected final state:
Failure behavior:
Forbidden states:

## 3. Implementation
Files created:
Files modified:
Architecture:
Data/API changes:

## 4. Security
Authorization:
Tenant isolation:
Validation:
Concurrency/idempotency:
Sensitive operations:

## 5. UI/UX
Entry point:
States:
Responsive behavior:
Accessibility:
SEO when relevant:

## 6. Verification

| Check | Result | Evidence |
|---|---|---|
| Feature flow | | |
| Persistence | | |
| Authorization | | |
| Error handling | | |
| Duplicate execution | | |
| Concurrency | | |
| Typecheck | | |
| Lint | | |
| Tests | | |
| Build | | |

Use:
PASS
FAIL
NOT RUN
NOT ASSESSABLE

## 7. Contract Conformance

Conforme
Dégradé
Non conforme

Explain any ❌ or ❓.

## 8. Remaining Risks
Only real or clearly marked unverified risks.

## 9. Out-of-Scope Observations
Do not silently fix them.

==================================================
ESCALATION
==================================================

Use the appropriate specialized workflow when needed:

SECURITY-AUDIT
→ security issue requires deeper investigation.

BUG-INVESTIGATION
→ existing behavior is broken and root-cause debugging is required.

DATABASE-CHANGE-REVIEW
→ schema/migration/data-structure changes require deeper review.

PERFORMANCE-AUDIT
→ feature introduces material performance/scalability risk.

UI-UX-AUDIT
→ feature requires detailed interface audit rather than normal implementation.

PRODUCTION-READINESS
→ feature is complete and release readiness must be evaluated.

Do not duplicate another workflow unnecessarily.

==================================================
FINAL RULE
==================================================

Do not measure success by the amount of code written.

Measure success by:

CONTRACT
→ IMPLEMENTATION
→ REAL DATA / REAL SIDE EFFECTS
→ VERIFICATION
→ TESTS
→ REGRESSION SAFETY

A feature is not complete because the UI exists.

It is complete when the intended behavior is implemented, persisted where required, secured, and verified.