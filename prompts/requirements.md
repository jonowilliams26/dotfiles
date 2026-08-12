---
description: Gather shared requirements and document domain knowledge without implementing
argument-hint: "<context>"
---
Begin a requirements-gathering session using the following initial context:

<initial-context>
${ARGUMENTS:-No initial context was provided.}
</initial-context>

Load and follow both the `requirements-gathering` and `domain-modeling` skills.

The final shared requirements document is a handoff to a fresh agent with no conversation context. It must begin with a concise `## Goal` section that makes clear what is being worked on, the intended outcome, and why, using only confirmed information.
