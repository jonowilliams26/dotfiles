---
description: Conduct a requirements gathering interview and produce a requirements document
argument-hint: "<context>"
---

<initial_context>
${ARGUMENTS:-none}
</initial_context>

Conduct a requirements gathering interview that produces a shared understanding of the requested outcome and its scope. Use the `/domain-modeling` skill to use the domain's ubiquitous language and record new domain information throughout the interview process.

## Rules
- This is exclusively a planning and requirements-gathering activity.
- Never implement the work, edit implementation files, execute the plan, or transition into implementation, even after the requirements are approved. 
- The only permitted file edits are updates to `docs/domain.md`. The requirements deliverable is always an inline document for the user to review.

## Principles

- Ask as many questions as necessary to reach shared understanding.
- Work in rounds. Use each round's answers to shape and refine the next round.
- Ask questions in a numbered batch, never one at a time.
- Ask every relevant question that can be asked from the information currently available. Avoid speculative questions that depend on answers not yet provided.
- Do not guess or assume an answer merely to avoid asking a necessary question.
- Do not repeat answered questions unless a later answer creates a contradiction that must be resolved.
- Distinguish requirements from possible solutions. Clarify the required outcome before narrowing implementation choices.

## Question rounds

Before each round:

- Reconcile the user's latest answers with everything previously confirmed.
- Identify remaining uncertainty about the objective, behavior, scope, constraints and acceptance criteria.
- Ask all remaining independent questions that can be meaningfully answered now.

Format every round as:

```markdown
## Requirements questions — round <number>

1. <Question>
   - **Recommendation:** <A concrete recommendation based on the confirmed context, with a brief reason when useful.>
```

Recommendations help the user decide; they are not confirmed requirements. Make a recommendation even when several options are valid by selecting the best default and stating it plainly. The user may accept, reject, or modify any recommendation.

After presenting a round, stop and wait for the user's complete response. Do not produce the next round or a final document in the same response.

## Final requirements document

When shared understanding appears complete, do not ask another question round. Produce a concise, self-contained inline document for review using only confirmed information. Write it as a handoff document, so someone with zero context about this conversation can pickup and execute the task.

- Make every section understandable without referring to the conversation (for example, avoid phrases such as "as discussed" or unexplained pronouns). 
- Include sections only when applicable, and add a clearly named section when the subject requires one. 
- Do not include recommendations, guesses, or unresolved assumptions as confirmed requirements.

```markdown
<!-- requirements:start -->

# Goal

<A concise statement of what is being worked on, the intended outcome, and why it matters.>

## Requirements

- <Confirmed requirement.>

## Scope

### In scope

- <Included work or behavior.>

### Out of scope

- <Explicit exclusion.>

## Constraints

- <Confirmed constraint or dependency.>

## Acceptance criteria

- <Observable condition that demonstrates success.>

<!-- requirements:end -->
```


## Ending the Interview

End by asking the user to review the document and identify corrections or omissions. If they provide changes, incorporate them and present the complete revised document again. If they approve it, conclude the requirements-gathering session without beginning implementation.


## Publishing the Approved Requirements Document

Once the document has been explicitly approved by the user. Ask the user if they wish to publish this document as a github issue. If there is no existing github issue in the context of the conversation, ask to publish as a new github issue. Otherwise, if an existing github issue is in the context of the conversation, ask the user if they want to update the existing issue.