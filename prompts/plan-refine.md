---
description: Refine an implementation plan after an approved checkpoint review
argument-hint: "<issue-number>"
---
Refine the checkpointed implementation plan for the GitHub issue `${1:-no issue number provided}` after a checkpoint has been completed, reviewed and approved.

If the github issue number is absent or invalid, stop and ask for an issue number instead of inferring one from the conversation.

## Rules:
- This is a readonly planning session.
- NEVER implement the task, modify files, modify the issue in the same turn as the initial draft, infer approval from earlier messages, treat requested changes as approval or implement the plan after publication.
- The only mutation this workflow permits is publishing the refined plan after the explicit approval gate below.

## Strategy:
- Use `gh` to read the issue context.
- Use the current conversation to identify the completed checkpoint, review findings, resulting design changes, validation outcomes, and explicit checkpoint approval. If the completed checkpoint or its explicit approval cannot be identified, stop and state what is missing.
- First decide whether the approved checkpoint review has any substantive impact on the published plan. Do this before broad repository scouting or redrafting.
- If the completion-only path applies, make only the mechanical completion update and publish it immediately by following the publication steps. Do not draft, rewrite, reword, reorder, or ask for approval of the otherwise unchanged plan.
- If substantive refinement is required, follow the instructions in the section below.
- After drafting a substantive refinement, present it in full and ask the user for review and approval.
- If the user requests changes, revise the plan and present the revised plan in full to the user and ask for review and approval again. Continue this process until explicit approval is received.
- Once explicitly approved, follow the publication steps to replace the plan on the GitHub issue.


## How to substantively refine the plan:
- Preserve approved foundational work and checkpoints in their original order and mark them as complete. Describe their actual outcome, changes, and observed validation without rewriting history.
- Incorporate review decisions into every remaining checkpoint they affect. Remove work made unnecessary and add newly required work only when supported by the issue, review, or verified repository state.
- Preserve checkpoint numbers where practical. If checkpoints must be split, merged, added, or reordered, keep the revised sequence unambiguous.
- Keep every remaining checkpoint independently implementable and verifiable, with the repository left in a working state after each.
- Make the next checkpoint the smallest coherent increment that addresses the highest remaining dependency or risk.
- Do not put testing and verification in a final checkpoint. Each checkpoint should be verifiable and use automated tests where appropriate. Additional tests may be added or earlier tests changed as the implementation evolves.
- Do not expand scope beyond the issue. Surface contradictions, changed requirements, and unresolved design questions instead of silently resolving them.


## Approved Refined Plan Publication

- Use the `gh` cli to edit the github issue. 
- Do not modify the issue title or requirements content.
- Locate the section delimited by `<!-- implementation-plan:start -->` and `<!-- implementation-plan:end -->` and replace the contents with the refined plan.
- After successful publication, output the issue URL.

```markdown
<!-- implementation-plan:start -->

<approved refined plan>

<!-- implementation-plan:end -->
```
