---
workflow: w-database-change-review
commande: bdd:review
declencheurs:
  - changement de schéma BDD
  - migration base de données
  - ajout table, collection, index, contrainte
description: Use when changing database schemas, collections, tables, indexes, security rules, migrations, data structures, or persistence logic. Analyze compatibility, integrity, security, performance, migration safety, rollback, and production impact before approval.
---

# DATABASE CHANGE REVIEW WORKFLOW

## ROLE

Act as a senior database architect, backend engineer, security engineer, and reliability engineer.

Your mission is to determine whether a proposed database or persistence change is safe, coherent, compatible, and reversible.

This workflow covers:

- schema changes
- collections/tables
- fields
- relationships
- indexes
- constraints
- migrations
- data transformations
- security rules
- persistence logic
- transaction behavior
- database queries
- storage structures

Do not modify the database automatically.

==================================================
PHASE 0 — DEFINE THE CHANGE
==================================================

Determine:

- requested change
- reason
- affected database
- affected entities
- affected fields
- affected queries
- affected application modules
- expected data volume
- production status
- migration requirements
- rollback requirements

Classify:

SCHEMA CHANGE
DATA MIGRATION
QUERY/INDEX CHANGE
SECURITY RULE CHANGE
PERSISTENCE LOGIC CHANGE
COMBINED CHANGE

Do not assume the database technology.

==================================================
PHASE 1 — CURRENT STATE
==================================================

Inspect the existing persistence architecture.

Identify:

- schema/model definitions
- collections/tables
- indexes
- constraints
- migrations
- repositories/services
- database utilities
- security rules
- API consumers
- background jobs
- scheduled operations
- seed data
- tests

Search for all references to affected entities and fields.

Do not modify anything during reconnaissance.

==================================================
PHASE 2 — DATA CONTRACT
==================================================

Define the current contract:

ENTITY
→ FIELDS
→ TYPES
→ REQUIRED/OPTIONAL
→ RELATIONSHIPS
→ OWNERSHIP
→ TENANT SCOPE
→ CONSTRAINTS
→ SOURCE OF TRUTH

For each proposed change determine:

- what changes;
- what remains unchanged;
- what existing records look like;
- what new records should look like;
- whether old records remain valid.

Never assume existing data perfectly matches the intended schema.

==================================================
PHASE 3 — COMPATIBILITY
==================================================

Determine whether the change is:

BACKWARD COMPATIBLE
Existing application/data continues working.

FORWARD COMPATIBLE
New structure can coexist with the old application.

BREAKING
Existing application/data requires coordinated changes.

UNKNOWN
Compatibility cannot be established safely.

Pay particular attention to:

- renamed fields
- deleted fields
- changed types
- changed required/optional status
- changed enum/status values
- changed relationships
- changed identifiers
- changed tenant ownership
- changed API responses

A breaking change must be explicitly identified.

Do not disguise it as a normal refactor.

==================================================
PHASE 4 — MIGRATION DESIGN
==================================================

If existing data must change, define:

1. PRECONDITION
2. MIGRATION
3. APPLICATION COMPATIBILITY
4. VERIFICATION
5. CLEANUP
6. ROLLBACK

Determine whether migration should be:

- additive
- in-place
- dual-read
- dual-write
- backfill
- staged
- destructive

Prefer additive/staged migrations when they reduce production risk.

Never delete or overwrite existing production data without a verified migration strategy.

==================================================
PHASE 5 — MIGRATION SAFETY
==================================================

Check:

- partial migration
- interrupted migration
- duplicate execution
- retry
- timeout
- concurrent writes
- large datasets
- transaction limits
- rate limits
- lock/contention risks
- index build impact

A migration must be safe to retry when practical.

If it cannot be safely retried, document why and define recovery behavior.

Never assume a migration will complete successfully simply because it works on development data.

==================================================
PHASE 6 — DATA INTEGRITY
==================================================

Verify:

- source of truth
- uniqueness
- referential consistency
- required fields
- valid types
- valid status transitions
- tenant ownership
- derived values
- calculated fields
- duplicate records
- orphaned records

For financial or business-critical data verify:

- atomicity
- transaction boundaries
- rounding behavior
- balances
- totals
- historical records
- cancellation/reversal behavior

Never silently recalculate historical business data unless explicitly required.

==================================================
PHASE 7 — TRANSACTIONS AND CONCURRENCY
==================================================

Determine whether the change affects concurrent operations.

Inspect:

- transactions
- atomic updates
- optimistic concurrency
- retries
- idempotency
- race conditions
- duplicate submissions
- webhook retries
- background jobs

Ask:

"What happens if two valid operations occur at exactly the same time?"

For critical operations, the answer must be defined.

Do not rely on UI prevention to guarantee database consistency.

==================================================
PHASE 8 — SECURITY
==================================================

Review database security boundaries.

Check:

- authentication
- authorization
- tenant isolation
- ownership
- security rules
- server-side validation
- privileged operations
- admin access
- storage permissions

For multi-tenant systems verify that:

TENANT A
cannot read or modify
TENANT B

Check both:

READ
WRITE

Do not treat frontend filtering as tenant isolation.

If security rules change, review both allowed and denied scenarios.

==================================================
PHASE 9 — QUERY IMPACT
==================================================

Identify queries affected by the change.

Check:

- field names
- filters
- sorting
- joins/relationships where applicable
- indexes
- pagination
- aggregation
- ordering
- null/missing field behavior

Look for:

- full collection/table scans
- unbounded reads
- expensive aggregations
- N+1 queries
- missing indexes
- inefficient pagination

Do not create indexes blindly.

Only add indexes justified by actual query patterns.

==================================================
PHASE 10 — PERFORMANCE AND SCALE
==================================================

Estimate impact according to actual expected data volume.

Consider:

- current dataset size
- growth rate
- read/write frequency
- migration workload
- query frequency
- peak traffic
- storage growth

Do not invent traffic or data-volume numbers.

If volume is unknown, state that limitation.

A migration safe for 1,000 records may not be safe for millions.

==================================================
PHASE 11 — APPLICATION COMPATIBILITY
==================================================

Trace affected consumers:

DATABASE
→ SERVICE
→ API
→ STATE
→ UI
→ REPORTS
→ EXPORTS
→ JOBS
→ INTEGRATIONS

Verify that every important consumer understands the new structure.

Pay particular attention to:

- dashboards
- reports
- exports
- analytics
- scheduled tasks
- background jobs
- webhooks
- third-party integrations

Do not stop after checking the main UI.

==================================================
PHASE 12 — NULL / MISSING / LEGACY DATA
==================================================

Explicitly consider:

- existing records without the new field
- null values
- malformed legacy values
- old enum values
- deleted references
- partial migration
- mixed old/new records

Application logic must safely handle the transition period.

Do not assume every record can immediately use the new structure.

==================================================
PHASE 13 — TEST STRATEGY
==================================================

Define appropriate tests.

At minimum, consider:

- schema validation
- migration test
- rollback test
- existing-record compatibility
- new-record behavior
- query behavior
- authorization
- tenant isolation
- concurrency
- critical business logic

Use representative data.

For migrations, test:

BEFORE
→ MIGRATION
→ AFTER

and, when possible:

BEFORE
→ MIGRATION FAILURE
→ RECOVERY

Never claim migration safety without verification.

==================================================
PHASE 14 — ROLLBACK
==================================================

Define:

- rollback trigger
- rollback procedure
- data recovery procedure
- application rollback
- schema rollback
- compatibility requirements

Important:

A database rollback is NOT always the same as a code rollback.

If data has been transformed destructively, reverting application code may not restore the previous state.

Explicitly identify irreversible operations.

==================================================
PHASE 15 — PRODUCTION READINESS
==================================================

Before approving production use, verify:

[ ] Migration tested
[ ] Existing data considered
[ ] Compatibility verified
[ ] Security reviewed
[ ] Tenant isolation preserved
[ ] Queries verified
[ ] Indexes considered
[ ] Concurrency considered
[ ] Backup/recovery available
[ ] Rollback defined
[ ] Production volume considered
[ ] Application consumers updated

Any unresolved critical integrity or security issue blocks approval.

==================================================
PHASE 16 — IMPLEMENTATION GATE
==================================================

Do NOT implement the database change automatically.

First produce the review.

If the user explicitly authorizes implementation:

1. Apply the smallest safe change.
2. Preserve existing data.
3. Execute migrations safely.
4. Verify results.
5. Run application tests.
6. Check security rules.
7. Check affected queries.
8. Verify rollback/recovery where practical.

Never hide migration failures.

==================================================
FINAL REPORT
==================================================

Return:

# Database Change Review

## 1. Proposed Change

Change:
Reason:
Type:

## 2. Affected Areas

Entities:
Fields:
Queries:
Indexes:
Security:
Application modules:

## 3. Compatibility

Backward:
Forward:
Breaking:
Migration requirement:

## 4. Data Integrity

Source of truth:
Constraints:
Legacy data:
Duplicates:
Concurrency:
Transactions:

## 5. Security

Authentication:
Authorization:
Tenant isolation:
Read access:
Write access:

## 6. Performance

Expected volume:
Read impact:
Write impact:
Migration impact:
Indexes:
Known bottlenecks:

Never invent volume figures.

## 7. Migration Plan

Precondition:
Migration:
Verification:
Cleanup:
Rollback:

## 8. Testing Plan

| Test | Status | Evidence |
|---|---|---|
| Existing data | | |
| New data | | |
| Migration | | |
| Rollback | | |
| Queries | | |
| Security | | |
| Tenant isolation | | |
| Concurrency | | |
| Application | | |

Use:

PASS
FAIL
NOT RUN
NOT ASSESSABLE

## 9. Risks

BLOCKER
HIGH
MEDIUM
LOW
INFO

Separate real blockers from recommendations.

## 10. Decision

APPROVED
APPROVED WITH CONDITIONS
REQUIRES CHANGES
BLOCKED

Explain the decision.

==================================================
ESCALATION
==================================================

BUG-INVESTIGATION
→ database behavior is already incorrect.

SECURITY-AUDIT
→ database change creates or exposes a security vulnerability.

SAFE-REFACTOR
→ only persistence structure is being reorganized without intended data-contract change.

PERFORMANCE-AUDIT
→ primary concern is query or database scalability.

PRODUCTION-READINESS
→ final release approval is required after the database review.

FINAL PRINCIPLE

Database changes are data-contract changes.

Never evaluate them only by asking:

"Does the application still compile?"

Ask:

"Does existing data remain valid, secure, accessible, consistent, recoverable, and correctly interpreted before, during, and after the change?"