---
description: Refine an implementation plan after an approved checkpoint review
argument-hint: "<issue-number> [additional context]"
---
Refine the checkpointed implementation plan for the GitHub issue identified by `${1:-no issue number provided}` after the latest checkpoint has been reviewed and approved.

The first argument is required and must unambiguously identify an issue in the current repository, such as `123` or `#123`. If it is absent or invalid, stop and ask for an issue number instead of inferring one from the conversation, branch name, or repository contents.

## Rules:
- This is a readonly planning session.
- Do not implement the task.
- Do not modify files.
- The only mutation this workflow permits is publishing the refined plan after the explicit approval gate below.
- Do not infer approval of the refined plan from approval of the checkpoint review.
- Do not modify the issue in the same turn as the initial draft, infer approval from earlier messages, or treat requested changes as approval.
- Do not start implementing the plan after publication.

## Strategy:
- Use `gh` to read the issue title, body, URL, and state. Treat the issue requirements and published implementation plan as the source of scope and plan history.
- Treat `${@:2}` as optional additional refinement context from the user.
- Use the current conversation to identify the completed checkpoint, review findings, resulting design changes, validation outcomes, and explicit checkpoint approval. If these cannot be identified, stop and state what is missing.
- Inspect and scout the repository for relevant code paths and changes so the refined plan reflects the approved implementation and current architecture.
- Draft the refined plan as a small, ordered sequence of completed work and remaining checkpoints. Write it as a handoff to a fresh agent with no access to the conversation or other prior context.
- After drafting the plan, present it in full and ask the user for review and approval.
- If the user requests changes, revise the full plan and ask for review and approval again.
- Once explicitly approved, follow the publication steps to replace the plan on the GitHub issue.

## How to refine the plan:
- Preserve approved foundational work and checkpoints in their original order and mark them as complete. Describe their actual outcome, changes, and observed validation without rewriting history.
- Incorporate review decisions into every remaining checkpoint they affect. Remove work made unnecessary and add newly required work only when supported by the issue, review, or verified repository state.
- Preserve checkpoint numbers where practical. If checkpoints must be split, merged, added, or reordered, keep the revised sequence unambiguous.
- Keep every remaining checkpoint independently implementable and verifiable, with the repository left in a working state after each.
- Make the next checkpoint the smallest coherent increment that addresses the highest remaining dependency or risk.
- Do not put testing and verification in a final checkpoint. Each checkpoint should be verifiable and use automated tests where appropriate. Additional tests may be added or earlier tests changed as the implementation evolves.
- Do not expand scope beyond the issue. Surface contradictions, changed requirements, and unresolved design questions instead of silently resolving them.

## Output format:

# Implementation plan

## Goal
Summarize the intended outcome and the end-to-end behavior that will prove it works.

## Assumptions and open questions
List material assumptions, ambiguities, or decisions that could change the plan. Say `None` when applicable.

## Foundational changes (optional)
Include this section only when foundational work exists. Add `(complete)` to the heading when it has been approved and completed. Include:

### Purpose
- Why these changes precede the happy path and which checkpoints reuse or depend on them.

### Changes
- Specific files, components, symbols, or integrations changed or still to change, and how they fit together.

### Validation
- Observed validation for completed work or focused checks for remaining work.

### Outcome
- The observable conditions or system behavior delivered.

## Checkpoint 1: <checkpoint outcome> <(complete) when approved and completed>
For this and every later checkpoint, include:

### Outcome
- The observable conditions or system behavior delivered that make the checkpoint complete.

### Changes
- Specific files, components, symbols, or integrations changed or still to change, and how they fit together.

### Validation
- Observed validation for completed checkpoints or focused checks that prove remaining checkpoints work end to end.

## Checkpoint 2: <next incremental outcome>
Continue with only as many checkpoints as the task needs. Prioritize remaining requirements and risks before polish. If no work remains, state that explicitly instead of creating another checkpoint.

## Plan publication

Once explicitly approved:

- Fetch the issue body again immediately before updating it so the latest remote content is preserved.
- Locate the section delimited by `<!-- implementation-plan:start -->` and `<!-- implementation-plan:end -->`. Stop if exactly one matched pair is not present.
- Replace only the delimited section with the approved refined plan.
- Use `gh issue edit` with a body file or another quoting-safe mechanism. Do not modify the issue title or content outside the plan markers. If a temporary file is needed, create it outside the repository and remove it afterward.
- After successful publication, output the issue URL.

```markdown
<!-- implementation-plan:start -->

<approved refined plan, beginning with `# Implementation plan`>

<!-- implementation-plan:end -->
```
