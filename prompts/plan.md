---
description: Create an implementation plan for a github issue
argument-hint: "<issue-number>"
---
Create an implementation plan for the GitHub `${1:-no issue number provided}`.

If the github issue number is absent or invalid, stop and ask for an issue number instead of inferring one from the conversation.

## Rules:
- This is a readonly planning session.
- NEVER implement the task, modify files, modify the issue in the same turn as the initial draft, infer approval from earlier messages, treat requested changes as approval or implement the plan after publication.
- The only mutation this workflow permits is publishing the plan after the explicit approval gate below.

## Strategy:
- Use the `gh` cli to read the issue context. Treat the issue as the source of confirmed requirements.
- Inspect and scout the repository for relevant code paths so the plan reflects the existing architecture, conventions.
- Draft the plan as a small, ordered sequence of foundational work and checkpoints. Write it as a handoff so another agent with no access to the conversation or other prior context can execute the plan.
- After drafting the plan, present it in full and ask the user for review and approval.
- If the user requests changes, revise the plan and present the revised plan in full to the user and ask for review and approval again. Continue this process until explicityly approved.
- Once explicitly approved, follow the publication steps to publish the plan to the github issue.

## How to build the plan:

- The plan and each checkpoint should focus on, prioritize and highlight the following:
    - Types and abstractions.
    - Module boundaries and seams.
    - Changing or new code paths and call stacks, how data flows, the input types, the output types, any side effects and any errors that can occur.
    - API design for functions/methods and abstractions. Not implementation details just what the interface looks like.
    - Tests cases which are going to be covered. Not detailed, just a broad outline of the tests to be completed.
    

- When needed, put foundational changes before Checkpoint 1. Use this only for prerequisite code or refactoring that will support multiple checkpoints or make the first vertical slice substantially clearer and safer to implement. Do not turn it into a broad horizontal layer, speculative abstraction, or unrelated cleanup. Omit foundational work when it is not justified. When proposing foundational work, justify your reasoning.

- Make Checkpoint 1 the narrowest vertical slice that proves the core happy path end to end. It may build on the foundational changes, but it must remain the first checkpoint that delivers functional end-to-end behavior. Include only the minimum feature-specific production code and validation needed to demonstrate that the approach works through all relevant layers.

- Use later checkpoints to incrementally satisfy the remaining requirements, strengthen the implementation, cover error and edge cases, and complete testing, observability, documentation, migration, or cleanup work where relevant.

- Keep the foundational work and every checkpoint independently implementable and verifiable, with the repository left in a working state after each.

- Do not put testing and verifications as the final checkpoint. Each checkpoint should be verifiable and utilize automated tests where appropiate to satisfy the goal of the checkpoint. This is an incremental process, so additional tests may need to be added or tests from previous checkpoints may need to be changed depending on the goal of the checkpoint.


## Output format:

# Implementation plan

## Goal
Summarize the intended outcome and the end-to-end behavior that will prove it works.

## Assumptions and open questions
List material assumptions, ambiguities, or decisions that could change the plan. Say `None` when applicable.

## Foundational changes (optional)
Include this section only when foundational work is justified. Include:

### Purpose
- Why these changes should precede the happy path and which checkpoints will reuse or depend on them.

### Outcome
- The observable conditions or system behavior delivered.

### Changes
- Specific files, components, symbols, or integrations to add or modify, and how they fit together

### Validation
- Focused checks that prove the foundation works without requiring later checkpoint behavior.

## Checkpoint 1: <narrow happy-path vertical slice>
For this and every later checkpoint, include:

### Outcome
- The observable conditions or system behavior delivered that make the checkpoint complete.

### Changes
- Specific files, components, symbols, or integrations to add or modify, and how they fit together

### Validation
- Focused checks that prove the checkpoint works end to end.

## Checkpoint 2: <next incremental outcome>
Continue with only as many checkpoints as the task needs. Prioritize remaining requirements and risks before polish.


## Approved Plan Publication

Once explicitly approved:

- Use the `gh` cli to edit the github issue. 
- Do not modify the issue title, requirements content. 
- Append the approved implementation plan to the issue body in a clearly delimited section.
- After successful publication, output the issue URL.

```markdown
<!-- implementation-plan:start -->

<approved plan>

<!-- implementation-plan:end -->
```