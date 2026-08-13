---
description: Create an incremental implementation plan with optional foundational work before the narrowest end-to-end happy path
argument-hint: "[task or additional context]"
---
Create a checkpointed implementation plan for the task described by the current conversation and `${ARGUMENTS:-no additional context provided}`.

Inspect the repository as needed so the plan reflects the existing architecture, conventions, and tests. Use read-only investigation only: do not implement the task, modify files, or run mutating commands.

Build the plan as a small, ordered sequence of foundational work and checkpoints:

1. When needed, put tightly scoped foundational changes before Checkpoint 1. Use this only for prerequisite code or refactoring that will support multiple checkpoints or make the first vertical slice substantially clearer and safer to implement. Explain why the work belongs up front and which checkpoints depend on it. Keep it independently verifiable, and do not turn it into a broad horizontal layer, speculative abstraction, or unrelated cleanup. Omit foundational work when it is not justified.
2. Make Checkpoint 1 the narrowest vertical slice that proves the core happy path end to end. It may build on the foundational changes, but it must remain the first checkpoint that delivers functional end-to-end behavior. Include only the minimum feature-specific production code and validation needed to demonstrate that the approach works through all relevant layers.
3. Use later checkpoints to incrementally satisfy the remaining requirements, strengthen the implementation, cover error and edge cases, and complete testing, observability, documentation, migration, or cleanup work where relevant.
4. Keep the foundational work and every checkpoint independently implementable and verifiable, with the repository left in a working state after each. Order them by dependency and risk, and avoid speculative work.

Output only the plan in Markdown using this structure:

# Implementation plan

## Goal
Summarize the intended outcome and the end-to-end behavior that will prove it works.

## Assumptions and open questions
List material assumptions, ambiguities, or decisions that could change the plan. Say `None` when applicable.

## Foundational changes (optional)
Include this section only when foundational work is justified. Include:
- **Purpose:** Why these changes should precede the happy path and which checkpoints will reuse or depend on them.
- **Changes:** Specific foundational code, refactoring, files, components, or symbols to add or modify.
- **Validation:** Focused checks that prove the foundation works without requiring later checkpoint behavior.
- **Exit criteria:** Observable conditions that make the foundation ready for Checkpoint 1.

## Checkpoint 1: <narrow happy-path vertical slice>
For this and every later checkpoint, include:
- **Outcome:** The user-visible or system behavior delivered.
- **Changes:** Specific files, components, symbols, or integrations to add or modify, and how they fit together.
- **Validation:** Focused automated or manual checks that prove the checkpoint works end to end.
- **Exit criteria:** Observable conditions that make the checkpoint complete.

## Checkpoint 2: <next incremental outcome>
Continue with only as many checkpoints as the task needs. Prioritize remaining requirements and risks before polish.

## Requirement coverage
Map each confirmed requirement to the checkpoint that satisfies it, and identify anything intentionally deferred or out of scope.

Be concrete enough that another agent can implement each checkpoint without repeating repository discovery. Clearly distinguish verified repository facts from assumptions, and do not invent paths, APIs, requirements, or validation results.