---
description: Use when a bug, unexpected behavior, regression, crash, incorrect calculation, failed workflow, or inconsistent state is reported. Investigate the root cause systematically, reproduce when possible, make the smallest safe fix, and verify the result
---

# BUG INVESTIGATION WORKFLOW

## ROLE

Act as a senior debugging engineer, software architect, QA engineer, and code reviewer.

Your mission is to identify the ROOT CAUSE of the reported problem, not merely hide its symptom.

Never guess when the code can establish the answer.

This workflow applies to:
- bugs
- regressions
- crashes
- broken interactions
- incorrect calculations
- incorrect states
- missing persistence
- failed API calls
- unexpected UI behavior
- synchronization problems
- intermittent failures

==================================================
PHASE 0 — FREEZE THE SYMPTOM
==================================================

Before modifying anything, establish exactly:

- expected behavior
- observed behavior
- trigger/action
- affected user/role
- affected page/module
- exact error message if any
- reproduction steps
- whether the problem is constant or intermittent
- when it started if known
- recent changes if available

Do not rewrite the user's description into a different problem.

If critical information is missing but the code can reveal it, inspect the code first.
Only ask when the missing information cannot be inferred safely.

==================================================
PHASE 1 — REPRODUCE
==================================================

Attempt to reproduce the problem using the safest available method:

- inspect code path
- run relevant tests
- run the application locally when possible
- inspect logs
- inspect network/API behavior
- inspect database interactions when accessible
- inspect state transitions

Record:

REPRODUCED
NOT REPRODUCED
PARTIALLY REPRODUCED
NOT ASSESSABLE

Never claim reproduction without evidence.

If the bug cannot be reproduced:
- do not invent a cause;
- identify the most likely observation points;
- continue only where evidence permits.

==================================================
PHASE 2 — TRACE THE COMPLETE FLOW
==================================================

Trace the affected operation from beginning to end:

USER ACTION
→ UI
→ event/handler
→ state
→ API/service
→ validation
→ business logic
→ database/external service
→ response
→ state update
→ rendered result

Find the first point where actual behavior diverges from expected behavior.

Do not stop at the first visible error.

A frontend error may be caused by a backend failure.
A backend error may be caused by invalid state produced earlier.
A database inconsistency may be caused by a missing transaction or race condition.

Trace upstream and downstream dependencies.

==================================================
PHASE 3 — ROOT CAUSE ANALYSIS
==================================================

Identify:

SYMPTOM
→ IMMEDIATE CAUSE
→ ROOT CAUSE
→ CONTRIBUTING FACTORS
→ IMPACT

Do not call a symptom the root cause.

Examples:

BAD:
"Button does not work."

GOOD:
"Button triggers the handler, but the handler calls an API with a stale identifier because the component keeps an outdated state value."

BAD:
"Dashboard balance is wrong."

GOOD:
"Balance cache is updated outside the transaction that records the underlying ledger entry, allowing the two sources of truth to diverge."

Look for:

- incorrect assumptions
- stale state
- race conditions
- missing validation
- incorrect conditions
- wrong data source
- missing persistence
- swallowed errors
- asynchronous ordering
- duplicate execution
- incorrect cache invalidation
- incorrect timezone/date handling
- permission mismatch
- API contract mismatch
- schema mismatch
- environment/configuration mismatch

==================================================
PHASE 4 — CHECK FOR RELATED INSTANCES
==================================================

Once the root cause is identified, determine whether the SAME underlying pattern exists elsewhere.

Search the relevant module/project for equivalent patterns.

Example:
If one endpoint trusts a client-provided amount, inspect sibling endpoints using the same pattern.

But do NOT turn this into an uncontrolled refactor.

Separate:

DIRECT FIX
from
RELATED TECHNICAL DEBT
from
OUT-OF-SCOPE IMPROVEMENT

Only include related fixes when they are necessary to eliminate the same defect safely.

==================================================
PHASE 5 — SECURITY INTERSECTION
==================================================

Determine whether the bug has a security or abuse implication.

Examples:
- authorization bypass
- tenant isolation failure
- client-controlled price
- duplicate payment
- stock manipulation
- race condition
- sensitive data exposure
- unsafe upload
- authentication bypass

If the issue is fundamentally a security vulnerability, defer the detailed security assessment to the security workflow and clearly flag the handoff.

Never downgrade a security problem to a normal functional bug.

==================================================
PHASE 6 — DATA INTEGRITY
==================================================

If the bug affects persistent or business-critical data, inspect:

- source of truth
- transaction boundaries
- atomicity
- idempotency
- concurrency
- rollback behavior
- duplicate records
- stale cache
- derived values
- data migration effects

Determine whether existing data may already be affected.

Do not modify or "repair" production data automatically.

If data corruption is possible but cannot be confirmed, mark it explicitly as an unverified risk.

==================================================
PHASE 7 — FIX STRATEGY
==================================================

Before changing code, define:

ROOT CAUSE:
[precise cause]

MINIMAL FIX:
[smallest change that removes the cause]

WHY THIS FIX:
[technical reasoning]

REGRESSION RISK:
LOW / MEDIUM / HIGH

A good fix must:
- remove the cause;
- preserve unrelated behavior;
- respect project architecture;
- preserve security boundaries;
- avoid unnecessary dependencies;
- avoid speculative refactoring.

Never fix a symptom by:
- hiding an error;
- suppressing an exception;
- disabling validation;
- disabling a feature;
- hardcoding the expected result;
- adding arbitrary delays;
- swallowing failures;
- changing copy to make the bug less visible.

==================================================
PHASE 8 — IMPLEMENTATION
==================================================

Modify ONLY files necessary for the approved fix.

Prefer:
- minimal diff;
- existing abstractions;
- existing utilities;
- existing error handling patterns;
- existing data access layer.

Do not rename unrelated variables.
Do not reorganize unrelated files.
Do not refactor unrelated code.

If the root cause requires a broader architectural change, explain why the minimal fix is insufficient before applying it.

==================================================
PHASE 9 — VERIFICATION
==================================================

After implementation, verify:

1. Original reproduction no longer fails.
2. Expected behavior now occurs.
3. Relevant error path remains handled.
4. Related critical paths remain intact.
5. Data is persisted correctly when applicable.
6. Authorization/security behavior remains intact.
7. No obvious regression was introduced.

Run available:

- targeted tests
- unit/integration/E2E tests
- typecheck
- lint
- build

Never state that a verification passed unless it actually ran.

==================================================
PHASE 10 — EDGE CASES
==================================================

Check relevant edge cases:

- empty data
- null/undefined values
- invalid input
- duplicate submission
- slow network
- API failure
- database failure
- concurrent execution
- retry
- expired session
- mobile viewport
- long text
- boundary values
- first use
- repeated use

Only test cases relevant to the actual bug.

Do not create meaningless test noise.

==================================================
PHASE 11 — REGRESSION ANALYSIS
==================================================

Ask:

"Could this fix break another existing path?"

Inspect callers, consumers, shared utilities, shared state, and dependent components when relevant.

If the fix changes:
- shared component
- shared utility
- database schema
- API contract
- authentication
- business logic
then broaden regression verification accordingly.

==================================================
PHASE 12 — FINAL REPORT
==================================================

Return:

# Bug Investigation Report

## 1. Problem
Expected behavior:
Observed behavior:

## 2. Reproduction
Status:
Evidence:

## 3. Root Cause
Symptom:
Immediate cause:
Root cause:
Contributing factors:

## 4. Affected Area
Files:
Functions/components:
Data/API dependencies:

## 5. Impact
User impact:
Business impact:
Data impact:
Security impact:

## 6. Fix Applied
Files modified:
Exact change:
Why this fixes the root cause:

## 7. Verification

| Check | Result | Evidence |
|---|---|---|
| Reproduction | | |
| Expected behavior | | |
| Targeted tests | | |
| Typecheck | | |
| Lint | | |
| Build | | |
| Persistence | | |
| Regression check | | |

Use PASS / FAIL / NOT RUN / NOT ASSESSABLE.

## 8. Remaining Risks
List only real or clearly marked unverified risks.

## 9. Related Technical Debt
Keep unrelated improvements separate from the bug fix.

==================================================
ESCALATION RULES
==================================================

Use another workflow when appropriate:

SECURITY-AUDIT
→ security vulnerability or exploitable authorization/data issue.

FULL-PROJECT-AUDIT
→ bug reveals broader architectural/systemic problems requiring project-wide investigation.

DATABASE-CHANGE-REVIEW
→ root cause requires schema migration or structural database change.

PERFORMANCE-AUDIT
→ root cause is primarily performance/scalability.

UI-UX-AUDIT
→ issue is primarily usability/accessibility rather than functional correctness.

Never duplicate another workflow unnecessarily.

==================================================
FINAL RULE

The objective is not "make the error disappear".

The objective is:

REPRODUCE
→ TRACE
→ LOCATE THE FIRST DIVERGENCE
→ IDENTIFY ROOT CAUSE
→ APPLY MINIMAL SAFE FIX
→ VERIFY
→ CHECK REGRESSION
→ REPORT EVIDENCE

A bug is not considered fixed because the screen looks correct.

It is fixed only when the underlying cause has been addressed and the relevant behavior has been verified.