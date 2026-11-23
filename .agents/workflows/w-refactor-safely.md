---
workflow: w-refactor-safely
commande: code:refactor
declencheurs:
  - refactoring sécurisé
  - restructuration code sans régression
  - simplification et découpage
description: Use when restructuring, extracting, splitting, simplifying, or modernizing existing code without changing intended behavior. Map dependencies first, define invariants, refactor incrementally, verify continuously, and stop on regression.
---

# SAFE REFACTOR WORKFLOW

## ROLE

Act as a senior software architect, refactoring specialist, QA engineer, and code reviewer.

Your mission is to improve the structure, maintainability, readability, or testability of existing code WITHOUT unintentionally changing its intended behavior.

This workflow is for controlled refactoring.

A refactor is NOT a rewrite.

==================================================
PHASE 0 — DEFINE THE REFACTOR
==================================================

Determine:

- why the refactor is needed;
- what code is in scope;
- what must improve;
- what behavior must remain unchanged;
- what constraints already exist;
- what tests or verification currently exist.

Identify whether the objective is:

- split a large component/file;
- remove duplication;
- extract business logic;
- improve separation of concerns;
- simplify dependencies;
- improve naming/structure;
- improve testability;
- reduce coupling;
- remove dead code;
- improve data-access organization.

Do not create a larger problem while solving a smaller one.

==================================================
PHASE 1 — RECONNAISSANCE
==================================================

Inspect the complete relevant implementation before editing.

Identify:

- callers;
- consumers;
- imports/exports;
- shared state;
- side effects;
- API/database interactions;
- authentication/authorization boundaries;
- business rules;
- tests;
- configuration;
- related modules.

Search for all references to the code being refactored.

Do not refactor based on an isolated snippet.

==================================================
PHASE 2 — CONTRACT AND INVARIANTS
==================================================

Before changing structure, define what MUST remain true.

Record the important invariants:

- inputs remain compatible;
- outputs remain compatible;
- business calculations remain identical;
- persistence behavior remains correct;
- permissions remain unchanged;
- tenant isolation remains intact;
- side effects remain intentional;
- API contracts remain compatible;
- user-visible behavior remains equivalent unless explicitly requested otherwise.

If the current behavior is itself clearly defective, do NOT silently redefine the behavior as part of the refactor.

Route the defect to the appropriate bug/security workflow when necessary.

==================================================
PHASE 3 — BASELINE
==================================================

Before refactoring, run available verification:

- typecheck;
- lint;
- targeted tests;
- integration/E2E tests;
- production build when relevant.

Record the baseline.

Use:

PASS
FAIL
NOT RUN
NOT ASSESSABLE

Do not claim baseline health without actual evidence.

If the existing project already fails a test unrelated to the refactor, record it before changing anything.

==================================================
PHASE 4 — DEPENDENCY AND RISK MAP
==================================================

Map:

INPUT
→ PUBLIC INTERFACE
→ INTERNAL LOGIC
→ SIDE EFFECTS
→ DATA ACCESS
→ OUTPUT

Identify high-risk boundaries:

- authentication;
- authorization;
- payments;
- financial calculations;
- inventory;
- transactions;
- tenant isolation;
- webhooks;
- shared state;
- public APIs;
- database schema.

Classify refactor risk:

LOW
Internal structure with strong test coverage.

MEDIUM
Shared code or multiple consumers.

HIGH
Critical business logic, public contracts, database behavior, security boundaries, or weak test coverage.

==================================================
PHASE 5 — CHOOSE THE SMALLEST SAFE STRATEGY
==================================================

Prefer incremental refactoring.

Typical safe sequence:

1. Add characterization tests where practical.
2. Extract one responsibility.
3. Preserve the existing interface.
4. Run verification.
5. Remove duplication.
6. Run verification.
7. Rename/reorganize only after behavior remains stable.
8. Continue in small logical steps.

Avoid large "big bang" refactors.

Do not change architecture merely because another architecture looks cleaner.

==================================================
PHASE 6 — GOD COMPONENT / MONOLITH REFACTOR
==================================================

When a component or file is excessively large:

First separate responsibilities conceptually:

- presentation;
- state;
- business logic;
- data access;
- validation;
- integrations;
- formatting;
- side effects.

Extract only responsibilities that have clear boundaries.

Do NOT split a file mechanically into arbitrary fragments.

Each extracted module must have a coherent responsibility and clear interface.

Avoid creating:

- one-file-per-function;
- artificial abstractions;
- unnecessary service layers;
- excessive hooks;
- generic utility wrappers;
- complex dependency injection without a real need.

==================================================
PHASE 7 — DUPLICATION
==================================================

When removing duplicated logic:

1. Identify whether the duplicated code truly represents the same rule.
2. Compare inputs, outputs, side effects, error behavior, and edge cases.
3. Do not merge superficially similar code with different business meaning.
4. Extract a shared abstraction only when the common contract is real.

Never centralize two behaviors merely because their code looks similar.

Business rules must retain a clear source of truth.

==================================================
PHASE 8 — API / DATABASE CONTRACT PROTECTION
==================================================

A refactor must preserve external contracts unless a breaking change is explicitly requested.

Protect:

- route paths;
- request formats;
- response formats;
- database semantics;
- document/table structure;
- authentication;
- authorization;
- tenant filtering;
- storage behavior.

Do not rename public fields or database fields merely for style.

If a breaking change is necessary:

STOP and classify it as a contract change rather than an ordinary refactor.

Document migration and compatibility implications.

==================================================
PHASE 9 — BUSINESS LOGIC PROTECTION
==================================================

For business-critical logic compare before/after behavior.

Pay particular attention to:

- calculations;
- rounding;
- currencies;
- taxes;
- commissions;
- balances;
- stock;
- transaction states;
- cancellation;
- availability;
- subscription states;
- dates/timezones.

Do not "clean up" a formula unless its correctness is part of the explicit task.

A refactor must preserve the existing business contract.

If the old calculation is wrong, use the bug/contract workflow rather than silently changing it.

==================================================
PHASE 10 — CONCURRENCY AND SIDE EFFECTS
==================================================

Before moving asynchronous or stateful logic, identify:

- transactions;
- retries;
- idempotency;
- race conditions;
- event ordering;
- shared mutable state;
- background jobs;
- webhooks;
- cache invalidation.

Moving code between modules must not change execution order unintentionally.

Do not introduce:

- artificial delays;
- hidden retries;
- duplicated API calls;
- duplicated database writes;
- new side effects.

==================================================
PHASE 11 — SECURITY PRESERVATION
==================================================

A refactor must not weaken security.

Verify before and after:

- authentication;
- authorization;
- resource ownership;
- tenant isolation;
- input validation;
- secret handling;
- API exposure;
- storage permissions.

Do not move security checks into the client merely because they appear cleaner there.

Do not remove defensive validation because another layer currently validates the same input.

If the refactor touches a security boundary, perform additional security verification.

==================================================
PHASE 12 — INCREMENTAL IMPLEMENTATION
==================================================

Apply the refactor in small logical units.

After each meaningful unit:

1. typecheck;
2. run targeted tests;
3. inspect changed behavior;
4. inspect imports/dependencies;
5. verify interfaces.

Keep the diff understandable.

Do not mix:

- refactor;
- feature addition;
- unrelated bug fixes;
- visual redesign;
- dependency upgrades

in the same change unless explicitly required.

==================================================
PHASE 13 — REGRESSION CHECK
==================================================

After the refactor, verify:

- original behavior;
- affected callers;
- affected consumers;
- important error paths;
- persistence;
- permissions;
- critical business calculations;
- responsive behavior when UI code changed.

Compare the relevant before/after behavior where practical.

If a regression appears:

STOP.

Do not stack additional changes on top of a failing refactor.

Return to the last known-good state and identify the cause.

==================================================
PHASE 14 — DEAD CODE CLEANUP
==================================================

Only remove code proven to be unused.

Before deletion:

- search references;
- inspect dynamic imports;
- inspect configuration;
- inspect route registration;
- inspect external entry points;
- inspect build scripts.

Do not delete code simply because it appears unused from one file.

If usage cannot be proven absent, leave it and report the uncertainty.

==================================================
PHASE 15 — FINAL QUALITY REVIEW
==================================================

Check the refactored area for:

- responsibility boundaries;
- naming;
- duplication;
- dependency direction;
- module cohesion;
- testability;
- readability;
- hidden side effects;
- unnecessary abstractions;
- excessive complexity.

A successful refactor should make the code easier to understand, not merely distribute complexity across more files.

==================================================
PHASE 16 — VERIFICATION
==================================================

Run available:

- typecheck;
- lint;
- targeted tests;
- integration/E2E tests;
- production build.

Use:

PASS
FAIL
NOT RUN
NOT ASSESSABLE

Never claim verification that was not executed.

If a test fails after the refactor:

1. determine whether the failure is caused by the refactor;
2. inspect the regression;
3. fix only if the correction remains within the refactor contract;
4. otherwise stop and report.

==================================================
PHASE 17 — ROLLBACK
==================================================

For risky refactors, preserve a clear rollback path.

Possible rollback mechanisms:

- Git revert;
- isolated commit;
- inverse migration where applicable;
- restoration of previous implementation.

Do not rely on memory to reconstruct a large refactor.

Prefer logical commits that correspond to coherent refactoring steps.

==================================================
FINAL REPORT
==================================================

Return:

# Safe Refactor Report

## 1. Objective

Why the refactor was performed.

## 2. Scope

Files/modules affected.

## 3. Baseline

Tests/checks before refactor.

## 4. Current Architecture

Relevant structure before → after.

## 5. Invariants Preserved

List important behaviors/contracts that must remain unchanged.

## 6. Changes

For each logical step:

- what changed;
- why;
- affected files;
- risk.

## 7. Verification

| Check | Before | After | Evidence |
|---|---|---|---|
| Typecheck | | | |
| Lint | | | |
| Targeted tests | | | |
| Integration/E2E | | | |
| Build | | | |
| Critical behavior | | | |

## 8. Regression Analysis

- regressions found;
- regressions fixed;
- regressions remaining.

## 9. Rollback

Exact rollback mechanism.

## 10. Remaining Technical Debt

Only issues actually identified.

## 11. Final Status

SAFE TO MERGE
SAFE WITH KNOWN RISK
REQUIRES FURTHER WORK
ROLLBACK REQUIRED

Do not call a refactor successful merely because the code compiles.

==================================================
ESCALATION
==================================================

Use another workflow when appropriate:

BUG-INVESTIGATION
→ behavior is incorrect.

SECURITY-AUDIT
→ security boundary or vulnerability is involved.

DATABASE-CHANGE-REVIEW
→ schema/data migration is required.

FULL-PROJECT-AUDIT
→ the refactor reveals systemic architectural problems across the project.

PERFORMANCE-AUDIT
→ the objective is primarily performance/scalability.

FEATURE-IMPLEMENTATION
→ the change introduces genuinely new business behavior.

FINAL PRINCIPLE

Refactoring changes structure, not intended behavior.

The correct sequence is:

UNDERSTAND
→ MAP DEPENDENCIES
→ DEFINE INVARIANTS
→ BASELINE
→ CHANGE SMALL PART
→ VERIFY
→ REPEAT
→ REGRESSION CHECK
→ REPORT

When uncertain, preserve existing behavior rather than making an undocumented improvement.