---
description: Create an incremental implementation plan from a GitHub issue
argument-hint: "<issue-number> [additional context]"
---
Create a checkpointed implementation plan for the GitHub issue identified by `${1:-no issue number provided}`.

The first argument is required and must unambiguously identify an issue in the current repository, such as `123` or `#123`. If it is absent or invalid, stop and ask for an issue number instead of inferring one from the conversation, branch name, or repository contents.

## Rules:
- This is a readonly planning session.
- do not implement the task
- do not modify files
- The only mutation this workflow permits is publishing the plan after the explicit approval gate below.
- Do not modify the issue in the same turn as the initial draft, infer approval from earlier messages, or treat requested changes as approval.
- Do not start implementing the plan after publication.

## Strategy:
- Use `gh` to read the issue title, body, URL, state. Treat the issue as the source of confirmed requirements.
- Treat `${@:2}` as optional additional planning context from the user.
- Inspect and scout the repository for relevant code paths so the plan reflects the existing architecture, conventions.
- Draft the plan as a small, ordered sequence of foundational work and checkpoints. Write it as a handoff to a fresh agent with no access to the conversation or other prior context.
- After drafting the plan, present it in full and ask the user for review and approval.
- If the user requests changes, revise the full plan and ask for review and approval again.
- Once explicitly approved, follow the publication steps to publish the plan to the github issue.

## How to build the plan:
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

### Changes
- Specific files, components, symbols, or integrations to add or modify, and how they fit together

### Validation
- Focused checks that prove the foundation works without requiring later checkpoint behavior.

### Outcome
- The observable conditions or system behavior delivered.

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


## Plan publication

Once explicitly approved:

- Fetch the issue body again immediately before updating it so the latest remote content is preserved.
- Publish the approved plan in a clearly delimited section at the end of the issue body
- Use `gh issue edit` with a body file or another quoting-safe mechanism. Do not modify the issue title, requirements content. If a temporary file is needed, create it outside the repository and remove it afterward.
- After successful publication, output the issue URL

```markdown
<!-- implementation-plan:start -->

<approved plan, beginning with `# Implementation plan`>

<!-- implementation-plan:end -->
```