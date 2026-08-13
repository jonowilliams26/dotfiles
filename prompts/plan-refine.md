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
- The only mutation this workflow permits is publishing the plan as described below.
- Use the completion-only path when its conditions are met. This is a mechanical progress update, not a substantive plan refinement, and does not require a second approval after the checkpoint was explicitly approved.
- For a substantive refinement, do not infer approval of the refined plan from approval of the checkpoint review.
- For a substantive refinement, do not modify the issue in the same turn as the initial draft, infer approval from earlier messages, or treat requested changes as approval.
- Do not start implementing the plan after publication.

## Strategy:
- Use `gh` to read the issue title, body, URL, and state. Treat the issue requirements and published implementation plan as the source of scope and plan history.
- Treat `${@:2}` as optional additional refinement context from the user.
- Use the current conversation to identify the completed checkpoint, review findings, resulting design changes, validation outcomes, and explicit checkpoint approval. If the completed checkpoint or its explicit approval cannot be identified, stop and state what is missing.
- First decide whether the approved checkpoint review has any substantive impact on the published plan. Do this before broad repository scouting or redrafting.
- If the completion-only path applies, make only the mechanical completion update and publish it immediately by following the publication steps. Do not draft, rewrite, reword, reorder, or ask for approval of the otherwise unchanged plan.
- If substantive refinement is required, inspect and scout only the relevant repository code paths and changes so the refined plan reflects the approved implementation and current architecture.
- Draft the substantively refined plan as a small, ordered sequence of completed work and remaining checkpoints. Write it as a handoff to a fresh agent with no access to the conversation or other prior context.
- After drafting a substantive refinement, present it in full and ask the user for review and approval.
- If the user requests changes, revise the full plan and ask for review and approval again.
- Once explicitly approved, follow the publication steps to replace the plan on the GitHub issue.

## Completion-only path:
Use this path when all of the following are true:
- The latest completed checkpoint was explicitly approved and its review has no unresolved findings or requested changes.
- Any code review changes made before approval were confined to the completed checkpoint and do not require the published description of that checkpoint or any later checkpoint to change.
- No review decision, implementation discovery, validation outcome, requirement change, or additional user context changes the meaning, scope, order, dependencies, implementation guidance, or validation guidance of any part of the published plan.
- The published plan contains an unambiguous heading for the completed checkpoint and does not already mark it complete.

When this path applies:
- Preserve the published implementation plan byte-for-byte except for adding ` (complete)` to the heading of the checkpoint that was just approved.
- Do not update its outcome, changes, or validation text, even if they could be described more precisely from the implementation.
- Do not mark any other checkpoint complete, clean up wording, normalize formatting, or make opportunistic plan improvements.
- Publish the mechanically updated plan in the same turn and output the issue URL. Do not present the full plan for another approval round.

If any condition is uncertain or false, do not use the completion-only path. Explain the substantive impact or uncertainty and use the refinement approval flow below.

## How to substantively refine the plan:
- Preserve approved foundational work and checkpoints in their original order and mark them as complete. Describe their actual outcome, changes, and observed validation without rewriting history.
- Incorporate review decisions into every remaining checkpoint they affect. Remove work made unnecessary and add newly required work only when supported by the issue, review, or verified repository state.
- Preserve checkpoint numbers where practical. If checkpoints must be split, merged, added, or reordered, keep the revised sequence unambiguous.
- Keep every remaining checkpoint independently implementable and verifiable, with the repository left in a working state after each.
- Make the next checkpoint the smallest coherent increment that addresses the highest remaining dependency or risk.
- Do not put testing and verification in a final checkpoint. Each checkpoint should be verifiable and use automated tests where appropriate. Additional tests may be added or earlier tests changed as the implementation evolves.
- Do not expand scope beyond the issue. Surface contradictions, changed requirements, and unresolved design questions instead of silently resolving them.

## Substantive refinement output format:

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

For the completion-only path, publish immediately after confirming all of its conditions. For a substantive refinement, publish only once the refined plan is explicitly approved.

- Fetch the issue body again immediately before updating it so the latest remote content is preserved.
- Locate the section delimited by `<!-- implementation-plan:start -->` and `<!-- implementation-plan:end -->`. Stop if exactly one matched pair is not present.
- Replace only the delimited section with the mechanically updated or explicitly approved refined plan.
- Use `gh issue edit` with a body file or another quoting-safe mechanism. Do not modify the issue title or content outside the plan markers. If a temporary file is needed, create it outside the repository and remove it afterward.
- After successful publication, output the issue URL.

```markdown
<!-- implementation-plan:start -->

<mechanically updated or explicitly approved refined plan, beginning with `# Implementation plan`>

<!-- implementation-plan:end -->
```
