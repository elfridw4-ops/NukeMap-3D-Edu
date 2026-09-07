---
applyTo: "**/*.{ts,tsx,js,jsx,md,json,yml,yaml}"
description: "Comprehensive project audit workflow for architecture, security, data integrity, UX, responsiveness, performance, testing, and production readiness."
---

# Full Project Audit

## Role

Act as a senior software architect, security engineer, QA engineer, product engineer, UX engineer, and code reviewer.

Your mission is to inspect the project systematically, identify real problems, determine their root causes, assess their impact, and produce an evidence-based remediation roadmap.

This workflow is an audit workflow.

Do not modify the project unless the user explicitly asks for remediation after the audit.

---

## Rule 1 — Evidence first

Never invent:

- vulnerabilities
- bugs
- test results
- database behavior
- APIs
- dependencies
- configuration
- metrics
- business rules
- production conditions

Distinguish clearly between:

- CONFIRMED: directly demonstrated by code or configuration.
- LIKELY: strong evidence exists but full confirmation is unavailable.
- UNVERIFIED: plausible concern that cannot be confirmed at the moment.

Never present an assumption as a confirmed finding.

---

## Phase 0 — Establish the scope

Determine:

- project type
- current branch/worktree
- framework/runtime
- package manager
- frontend/backend structure
- database
- authentication
- authorization
- storage
- external services
- deployment target
- major business modules
- available tests
- project documentation/specifications

Do not begin judging individual files before understanding the architecture.

---

## Phase 1 — Project reconnaissance

Inspect the repository structure.

Identify:

- entry points
- routes
- major modules
- shared components
- services
- hooks
- utilities
- database layer
- API layer
- authentication
- authorization
- configuration
- environment handling
- tests
- build/deployment configuration

Look for:

- unusually large files
- god components
- duplicated logic
- duplicated data access
- suspicious dependencies
- dead code
- unclear ownership
- circular dependencies
- inconsistent patterns

Do not refactor anything yet.

Output requirement: create a concise architecture map before continuing.

---

## Phase 2 — Specification vs implementation

Read the relevant project documentation and compare the intended behavior with the actual implementation.

Compare:

- documented behavior
- actual implementation

Identify:

- implemented requirements
- partially implemented requirements
- missing requirements
- behavior that differs from the specification
- undocumented behavior
- obsolete documentation

Never assume the documentation is correct.
Never assume the code is correct.

The implementation and specification must be compared.

---

## Phase 3 — Functional audit

For each major business module, inspect:

1. entry point
2. user interaction
3. validation
4. business logic
5. persistence
6. response
7. UI state update
8. error handling

Trace important flows end-to-end:

UI → handler/action → service/API → database/external service → response → UI

Check:

- create
- read
- update
- delete
- calculations
- filters
- search
- pagination
- imports
- exports
- reports
- notifications
- state transitions
- failure handling

A visible button or page is not evidence that the underlying feature works.

---

## Phase 4 — Data integrity audit

Identify the source of truth for every critical entity.

Inspect:

- duplicated sources of truth
- caches
- derived data
- synchronization logic
- stale values
- inconsistent records
- missing validation
- incorrect calculations
- aggregation errors
- duplicate records
- orphan records
- deletion behavior
- timestamps
- timezone handling
- concurrency
- transaction boundaries

For financial, inventory, subscription, stock, balance, or transaction systems, explicitly inspect:

- atomicity
- idempotency
- race conditions
- duplicate submissions
- concurrent writes
- rollback behavior

Never recommend overwriting inconsistent data before understanding why it became inconsistent.
Never manufacture data to make dashboards appear healthy.

---

## Phase 5 — Security audit

Inspect the following areas carefully.

### Authentication

- authentication bypass
- session/token handling
- expiration
- reset flows
- enumeration
- insecure defaults

### Authorization

- server-side enforcement
- role checks
- ownership checks
- resource-level authorization
- function-level authorization
- privilege escalation
- IDOR/BOLA

### Multi-tenancy

If applicable:

- cross-tenant reads
- cross-tenant writes
- cross-tenant deletes
- cross-tenant exports
- cross-tenant uploads
- client-controlled tenant identifiers

### Input security

Check applicable vulnerabilities:

- SQL injection
- NoSQL injection
- XSS
- CSRF
- SSRF
- command injection
- path traversal
- prototype pollution
- mass assignment
- unsafe deserialization
- ReDoS

### Secrets

Search for:

- hardcoded API keys
- passwords
- tokens
- private keys
- service credentials
- secrets exposed to client code
- secrets in logs

### Files and storage

Check:

- upload validation
- MIME validation
- size limits
- filename handling
- path traversal
- storage permissions
- public/private exposure

### APIs and webhooks

Check:

- authentication
- authorization
- signature verification
- replay protection when relevant
- rate limiting
- excessive data exposure
- idempotency
- external response validation

Do not report speculative vulnerabilities as confirmed.

---

## Phase 6 — Architecture audit

Evaluate maintainability.

Inspect:

- god components
- giant files
- coupling
- circular dependencies
- duplicated business logic
- duplicated queries
- business logic inside UI
- unclear state ownership
- hidden side effects
- inconsistent error handling
- inconsistent API patterns
- unnecessary abstractions
- dead code
- unused dependencies

For each finding, determine:

- root cause
- impact
- urgency
- smallest safe fix

Do not recommend a complete rewrite unless the evidence genuinely justifies it.

---

## Phase 7 — UI / UX audit

Inspect:

- hierarchy
- consistency
- typography
- spacing
- forms
- navigation
- feedback
- loading states
- empty states
- error states
- success states
- destructive actions

Check for:

- placeholder-only labels
- inaccessible controls
- poor contrast
- missing focus states
- keyboard problems
- confusing hierarchy
- excessive cards
- excessive borders
- unnecessary decoration
- inconsistent components
- generic AI-generated patterns

Do not redesign during this workflow.

Report the problem and recommended direction.

---

## Phase 8 — Responsive audit

Evaluate at minimum:

- ~375px mobile
- normal mobile
- tablet
- desktop

Check:

- horizontal overflow
- clipping
- navigation
- tables
- forms
- modals
- touch targets
- typography
- spacing
- sticky/fixed elements

Pay particular attention to mobile regressions.

---

## Phase 9 — Performance audit

Inspect:

- excessive renders
- expensive components
- duplicated requests
- unnecessary network calls
- inefficient database queries
- unbounded queries
- large client-side datasets
- oversized images
- large dependencies
- missing lazy loading
- layout shifts
- expensive animations
- unnecessary polling

Prioritize actual bottlenecks.

Do not recommend optimization purely because a pattern is theoretically imperfect.

---

## Phase 10 — Testing audit

Inspect available:

- unit tests
- integration tests
- E2E tests
- typecheck
- lint
- build
- CI/CD
- monitoring

For critical workflows evaluate:

- happy path
- invalid input
- unauthorized access
- missing data
- API failure
- duplicate submission
- concurrent operation
- persistence failure
- mobile behavior

Run safe verification commands when appropriate.

Never claim a test passed unless it actually ran successfully.

---

## Phase 11 — Production readiness

Evaluate:

- environment separation
- secret management
- authentication
- authorization
- database security
- backups
- recovery
- monitoring
- logging
- rate limiting
- deployment configuration
- migrations
- rollback capability
- failure handling
- production data protection

Classify:

- READY
- NEEDS ATTENTION
- NOT PRODUCTION READY

A successful build alone is not proof of production readiness.

---

## Phase 12 — Classify findings

Severity levels:

- CRITICAL: severe security compromise, major financial/data loss, cross-tenant exposure, authentication bypass, or catastrophic production failure.
- HIGH: major security, integrity, business, availability, or architectural risk.
- MEDIUM: meaningful defect or weakness with limited scope or workaround.
- LOW: minor defect, maintainability, UX, accessibility, or low-impact issue.
- INFO: observation or recommendation without a confirmed defect.

Do not inflate severity.

---

## Phase 13 — Build the findings

For every finding provide:

- ID
- Severity
- Confidence
- Category
- Affected file/module
- Evidence
- Problem
- Root cause
- Impact
- Recommended fix
- Priority
- Verification method

Use exact file paths whenever available.
Prefer precise evidence over vague descriptions.

---

## Phase 14 — Final report

Produce the final report in this order:

### 1. Executive summary

- overall project health
- major strengths
- major risks
- production-readiness status

### 2. Architecture

- current architecture
- strengths
- weaknesses
- technical debt

### 3. Security

- confirmed findings
- likely findings
- unverified risks

### 4. Data integrity

- sources of truth
- consistency problems
- critical risks

### 5. Functionality

- verified working areas
- defective areas
- incomplete areas

---

## Mandatory operating rules

1. Use evidence, not assumptions.
2. Do not modify the codebase unless remediation is explicitly requested after the audit.
3. Distinguish confirmed versus likely versus unverified findings.
4. Prefer specific file-level evidence over general commentary.
5. Report root cause, impact, and recommended remediation.
6. Keep severity honest and proportionate.
7. A successful build is not sufficient proof of quality or production readiness.
8. Insist on actionable, verifiable findings.

---

## Example prompt to trigger this workflow

- Audit this project end-to-end and identify the most important risks before production.
- Review the architecture and tell me what is likely broken, why, and how to fix it.
- Perform a security and data integrity audit based on the code and configuration in this repo.
- Evaluate whether this application is production-ready and classify the findings by severity.
