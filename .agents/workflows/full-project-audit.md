---
description: Use when explicitly asked to perform a comprehensive audit of the project, including architecture, functionality, data integrity, security, UI/UX, accessibility, responsiveness, performance, testing, and production readiness.
---


# FULL PROJECT AUDIT

## ROLE

Act as a senior software architect, security engineer, QA engineer, product engineer, UX engineer, and code reviewer.

Your mission is to inspect the project systematically, identify real problems, determine their root causes, assess their impact, and produce an evidence-based remediation roadmap.

This workflow is an AUDIT workflow.

Do not modify the project unless the user explicitly requests remediation after the audit.

---

# RULE 1 — EVIDENCE FIRST

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

Distinguish:

CONFIRMED = directly demonstrated by the code/configuration.

LIKELY = strong evidence exists but complete confirmation is unavailable.

UNVERIFIED = plausible concern that cannot currently be confirmed.

Never present an assumption as a confirmed finding.

---

# PHASE 0 — ESTABLISH THE SCOPE

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

# PHASE 1 — PROJECT RECONNAISSANCE

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
- God Components
- duplicated logic
- duplicated data access
- suspicious dependencies
- dead code
- unclear ownership
- circular dependencies
- inconsistent patterns

Do not refactor anything yet.

OUTPUT:

Create a concise architecture map before continuing.

---

# PHASE 2 — SPECIFICATION VS IMPLEMENTATION

Read relevant project documentation.

Compare:

DOCUMENTED BEHAVIOR
vs
ACTUAL IMPLEMENTATION

Identify:

- implemented requirements
- partially implemented requirements
- missing requirements
- behavior that differs from specifications
- undocumented behavior
- obsolete documentation

Never assume the documentation is correct.

Never assume the code is correct.

The implementation and specification must be compared.

---

# PHASE 3 — FUNCTIONAL AUDIT

For each major business module inspect:

1. entry point
2. user interaction
3. validation
4. business logic
5. persistence
6. response
7. UI state update
8. error handling

Trace important flows end-to-end:

UI
→ handler/action
→ service/API
→ database/external service
→ response
→ UI

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

A visible button or page is NOT evidence that the underlying feature works.

---

# PHASE 4 — DATA INTEGRITY AUDIT

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

For financial, inventory, subscription, stock, balance, or transaction systems explicitly inspect:

- atomicity
- idempotency
- race conditions
- duplicate submissions
- concurrent writes
- rollback behavior

Never recommend overwriting inconsistent data before understanding why it became inconsistent.

Never manufacture data to make dashboards appear healthy.

---

# PHASE 5 — SECURITY AUDIT

Inspect:

## Authentication

- authentication bypass
- session/token handling
- expiration
- reset flows
- enumeration
- insecure defaults

## Authorization

- server-side enforcement
- role checks
- ownership checks
- resource-level authorization
- function-level authorization
- privilege escalation
- IDOR/BOLA

## Multi-tenancy

If applicable:

- cross-tenant reads
- cross-tenant writes
- cross-tenant deletes
- cross-tenant exports
- cross-tenant uploads
- client-controlled tenant identifiers

## Input security

Check applicable:

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

## Secrets

Search for:

- hardcoded API keys
- passwords
- tokens
- private keys
- service credentials
- secrets exposed to client code
- secrets in logs

## Files/storage

Check:

- upload validation
- MIME validation
- size limits
- filename handling
- path traversal
- storage permissions
- public/private exposure

## APIs/webhooks

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

# PHASE 6 — ARCHITECTURE AUDIT

Evaluate maintainability.

Inspect:

- God Components
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

For each finding determine:

ROOT CAUSE
→ IMPACT
→ URGENCY
→ SMALLEST SAFE FIX

Do not recommend a complete rewrite unless the evidence genuinely justifies it.

---

# PHASE 7 — UI / UX AUDIT

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

# PHASE 8 — RESPONSIVE AUDIT

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

# PHASE 9 — PERFORMANCE AUDIT

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

# PHASE 10 — TESTING AUDIT

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

# PHASE 11 — PRODUCTION READINESS

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

READY
NEEDS ATTENTION
NOT PRODUCTION READY

A successful build alone is not proof of production readiness.

---

# PHASE 12 — CLASSIFY FINDINGS

Severity:

CRITICAL
Severe security compromise, major financial/data loss, cross-tenant exposure, authentication bypass, or catastrophic production failure.

HIGH
Major security, integrity, business, availability, or architectural risk.

MEDIUM
Meaningful defect or weakness with limited scope or workaround.

LOW
Minor defect, maintainability, UX, accessibility, or low-impact issue.

INFO
Observation or recommendation without a confirmed defect.

Do not inflate severity.

---

# PHASE 13 — BUILD THE FINDINGS

For every finding provide:

ID
Severity
Confidence
Category
Affected file/module
Evidence
Problem
Root cause
Impact
Recommended fix
Priority
Verification method

Use exact file paths whenever available.

Prefer precise evidence over vague descriptions.

---

# PHASE 14 — FINAL REPORT

Produce the final report in this order:

## 1. EXECUTIVE SUMMARY

- overall project health
- major strengths
- major risks
- production-readiness status

## 2. ARCHITECTURE

- current architecture
- strengths
- weaknesses
- technical debt

## 3. SECURITY

- confirmed findings
- likely findings
- unverified risks

## 4. DATA INTEGRITY

- sources of truth
- consistency problems
- critical risks

## 5. FUNCTIONALITY

- verified working areas
- defective areas
- incomplete areas