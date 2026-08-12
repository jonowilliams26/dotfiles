---
description: Create an incremental implementation plan starting with the narrowest end-to-end happy path
argument-hint: "[task or additional context]"
---
Create a checkpointed implementation plan for the task described by the current conversation and `${ARGUMENTS:-no additional context provided}`.

Inspect the repository as needed so the plan reflects the existing architecture, conventions, and tests. Use read-only investigation only: do not implement the task, modify files, or run mutating commands.

Build the plan as a sequence of small, ordered checkpoints:

1. Make Checkpoint 1 the narrowest vertical slice that proves the core happy path end to end. Include only the minimum production code and validation needed to demonstrate that the approach works through all relevant layers. Do not substitute a horizontal foundation, broad refactor, or isolated component unless the task cannot be exercised end to end without it.
2. Use later checkpoints to incrementally satisfy the remaining requirements, strengthen the implementation, cover error and edge cases, and complete testing, observability, documentation, migration, or cleanup work where relevant.
3. Keep every checkpoint independently implementable and verifiable, with the repository left in a working state. Order checkpoints by dependency and risk, and avoid speculative work.

Output only the plan in Markdown using this structure:

# Implementation plan

## Goal
Summarize the intended outcome and the end-to-end behavior that will prove it works.

## Assumptions and open questions
List material assumptions, ambiguities, or decisions that could change the plan. Say `None` when applicable.

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