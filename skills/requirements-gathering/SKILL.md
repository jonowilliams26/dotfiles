---
name: requirements-gathering
description: Run a requirements-only discovery session to establish shared understanding and scope through batched, iterative questions. Use when the user asks to gather requirements, clarify scope, conduct discovery, or plan without implementation. Never execute or implement the resulting work.
---

# Requirements Gathering

Conduct a conversation that produces a shared understanding of the requested outcome and its scope. This is exclusively a planning and requirements-gathering activity.

Never implement the work, edit implementation files, execute the plan, or transition into implementation, even after the requirements are approved. The only permitted file edits are updates to `docs/domain.md` when the domain-modeling skill is also active. The requirements deliverable is always an inline document for the user to review.

## Principles

- Ask as many questions as necessary to reach shared understanding.
- Work in rounds. Use each round's answers to shape and refine the next round.
- Ask questions in a numbered batch, never one at a time.
- In each round, ask every relevant question that can be asked from the information currently available. Do not intentionally reserve independent questions for later rounds.
- Ask only about genuine gaps, ambiguities, conflicts, decisions, or scope boundaries that cannot be answered from confirmed context.
- Do not ask questions whose answers are already stated or can be reliably inferred from established context.
- Do not guess merely to avoid asking a necessary question. Treat uncertain or consequential inferences as unresolved.
- Avoid speculative questions that depend on answers not yet provided; ask those in the next round when they become relevant.
- Do not repeat answered questions unless a later answer creates a contradiction that must be resolved.
- Distinguish requirements from possible solutions. Clarify the required outcome before narrowing implementation choices.

## Question rounds

Before each round:

1. Reconcile the user's latest answers with everything previously confirmed.
2. Identify remaining uncertainty about the objective, users, behavior, scope, constraints, quality expectations, dependencies, risks, and measures of success, considering only categories relevant to the request.
3. Determine which questions can be answered from established context and omit them.
4. Ask all remaining independent questions that can be meaningfully answered now.

Format every round as:

```markdown
## Requirements questions — round <number>

1. <Question>
   - **Recommended answer:** <A concrete recommendation based on the confirmed context, with a brief reason when useful.>

2. <Question>
   - **Recommended answer:** <A concrete recommendation based on the confirmed context, with a brief reason when useful.>
```

Recommendations help the user decide; they are not confirmed requirements. Make a recommendation even when several options are valid by selecting the best default and stating it plainly. The user may accept, reject, or modify any recommendation.

After presenting a round, stop and wait for the user's complete response. Do not produce the next round or a final document in the same response.

## Reaching shared understanding

Continue with further rounds while any material ambiguity, conflict, or scope decision remains. A shared understanding has been reached when the confirmed information is sufficient to explain:

- the intended outcome and reason for it;
- who or what is affected;
- required behavior and observable success;
- what is in scope and explicitly out of scope;
- applicable constraints, dependencies, and quality expectations; and
- any other acceptance boundaries material to the request.

Not every session needs every category. Do not manufacture requirements or ask irrelevant checklist questions simply to fill a section.

## Final requirements document

When shared understanding appears complete, do not ask another question round. Produce a concise, self-contained inline document for review using only confirmed information. Write it as a handoff to a fresh agent with no access to the conversation or other prior context:

```markdown
# Shared requirements

## Goal

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
```

The `Goal` section is always required and must appear first. Make every section understandable without referring to the conversation (for example, avoid phrases such as "as discussed" or unexplained pronouns). Include other sections only when applicable, and add a clearly named section when the subject requires one. Do not include recommendations, guesses, or unresolved assumptions as confirmed requirements.

End by asking the user to review the document and identify corrections or omissions. If they provide changes, incorporate them and present the complete revised document again. If they approve it, conclude the requirements-gathering session without beginning implementation.
