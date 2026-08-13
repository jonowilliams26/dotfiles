---
description: Gather requirements and create a GitHub issue after explicit approval
argument-hint: "<context>"
---
Begin a requirements-gathering session using the following initial context:

<initial-context>
${ARGUMENTS:-No initial context was provided.}
</initial-context>

Load and follow both the `requirements-gathering` and `domain-modeling` skills.

## Approval and publication gate

Rules:
- Do not create a GitHub issue in the same turn as the initial document, infer approval from earlier answers, or treat requested changes as approval.
- Continue only after the user explicitly approves the latest complete version.

Strategy:
- Present the complete requirements document and ask the user for review and approval.
- If the user requests changes, revise and present the complete document again for review and approval.
- Once the user provides explicity approval of the requirements document:
    - Create exactly one issue with `gh issue create`, with a body file or another quoting-safe mechanism. Use the approved requirements document as the issue body. If a temporary file is needed, create it outside the repository and remove it afterward.
    - Output the issue title, number, and URL
