---
description: Produce a zero-context handover for continuing the current task in a new session
argument-hint: "[additional context or focus]"
---
Produce a self-contained handover that enables a fresh agent with no access to this conversation to continue the current task accurately and efficiently.

Use the current conversation, tool results, and repository state as evidence. If repository details matter and are not current, use read-only inspection (for example, status, diff, log, or file reads) to verify them. Do not continue implementing the task, run mutating commands, create or modify files, commit changes, or push anything. Do not include secrets, credentials, hidden reasoning, or unsupported assumptions.

Treat `${ARGUMENTS:-no additional context provided}` as optional guidance about what to emphasize.

Output only the handover in the TUI as Markdown, with no preface or follow-up commentary. Use this structure:

# Handover

## Task
State the user's objective, expected outcome, and relevant success criteria.

## Current status
State the current phase, what was being worked on immediately before this handover, and the overall condition of the work.

## Completed
List completed work and important findings. Include exact file paths, symbols, commands, or decisions where they help continuation.

## In progress
Describe any partially completed work, including its current state and where to resume. Say `None` when applicable.

## Remaining work
Provide an ordered, actionable checklist of everything still required, including validation or cleanup.

## Key decisions and context
Record important requirements, constraints, architectural decisions, rejected approaches, and the reasons behind them.

## Files and repository state
Summarize relevant changed, added, deleted, or untracked files; the active branch; and commit or worktree state. Distinguish changes made for this task from pre-existing changes. Say when a fact was not verified.

## Validation
List checks already run and their outcomes, then checks still needed. Preserve useful error messages or failing test names exactly enough to diagnose them.

## Blockers and risks
List unresolved questions, blockers, fragile areas, and assumptions that require verification. Say `None` when applicable.

## Recommended next step
Give the fresh agent a specific first action, followed by any concise continuation instructions needed to avoid repeating work.

Be concise but complete. Prefer verified facts over narrative. Clearly label anything uncertain or unverified, and do not claim that work or validation occurred unless the session evidence shows it did.
