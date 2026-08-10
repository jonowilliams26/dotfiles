# Domain

## Smart zone

The smart zone is the context range in which the active model remains effective at continuing the requested work. It usually tops out between 100K and 150K tokens.

### Business rules

- Context should be compacted around 125K tokens to keep subsequent work in the smart zone.
- A compaction threshold may vary by 10% around 125K, producing a range from 112.5K through 137.5K tokens.
- A model's context-window safety limit takes precedence when it is lower than the selected threshold.

## Context checkpoint

A context checkpoint is the summary that replaces discarded conversation context after compaction and enables work to continue.

### Business rules

- A context checkpoint outlines the original goal, current state, completed work, work in progress, pending work, and next steps.
- A context checkpoint preserves the constraints, blockers, decisions, file paths, commands, function names, and errors needed to resume the work.
- When work follows an approved implementation plan, the checkpoint preserves the plan's steps and order and records each step as completed, in progress, or pending.
- Continuation resumes the in-progress plan step before proceeding through pending steps in plan order.
