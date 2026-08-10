---
name: domain-modeling
description: Keep a repository's domain documentation current while discussing, discovering, implementing, or reviewing domain concepts, terminology, business rules, and cardinality relationships. Use whenever requirements or code changes reveal domain knowledge, or when the user's terminology differs from the documented ubiquitous language.
---

# Domain Modeling

Maintain the domain model in `docs/domain.md` as part of the conversation. Do not defer documentation until the end of a task.

## Workflow

1. Read `docs/domain.md` before discussing or changing domain behavior. If it does not exist, create it when the conversation establishes the first domain fact.
2. Treat the document as the current source of truth for domain terminology, not as an infallible specification.
3. As the user confirms a concept, term, business rule, or relationship, update `docs/domain.md` in the same turn. Also update it alongside implementation changes that add or alter domain knowledge.
4. Record only confirmed domain knowledge. Do not infer cardinalities, rules, synonyms, or definitions from implementation details alone.
5. Keep edits concise and merge them into existing entries rather than adding duplicate statements.

## Resolve language conflicts

Actively compare the user's wording with the documented ubiquitous language.

When a term is ambiguous, conflicts with an existing definition, or appears to be a different name for a documented concept, pause and ask a focused clarification question before changing the document or implementing the affected behavior. Establish whether:

- the user means the existing concept and their term is a discouraged name;
- the term is an accepted synonym;
- the existing ubiquitous language should be renamed or redefined; or
- the user is introducing a distinct concept.

Do not silently translate conflicting terminology. Once clarified, update the relevant concept immediately, including accepted synonyms or discouraged names when useful.

Likewise, challenge rules or cardinalities that contradict `docs/domain.md`. Ask which statement is authoritative, then replace the obsolete statement rather than retaining both.

## Document structure

Use one top-level section per domain concept. The concept name and definition establish the ubiquitous language; do not create separate **Concepts** or **Ubiquitous language** sections.

The following is a shape-only template. Replace every angle-bracketed placeholder with confirmed domain knowledge, omit optional or empty content, and never copy the placeholders into `docs/domain.md` as domain facts.

```markdown
# Domain

## <Concept name>

<Short definition using domain language.>

**Accepted synonyms:** <accepted term>.

**Discouraged terms:** <discouraged term>; use **<Concept name>**.

### Business rules

- <Business rule for this concept.>

### Relationships

- <Plain-language relationship with explicit cardinality.>
```

Repeat the `## <Concept name>` section for each concept. Apply these conventions:

- Use the canonical domain term as the concept heading and describe it with a short domain-focused definition.
- Record accepted synonyms or discouraged names directly in the relevant concept only when they are useful. Omit those lines otherwise.
- Keep each business rule under the concept to which it applies.
- Keep each relationship under the concept whose relationship it describes. Write it in plain language with explicit cardinality such as exactly one, zero or one, one or more, or many.
- State only the cardinality that has been confirmed; ask rather than guessing the inverse side of a relationship.
- Use domain language, not database, API, UI, or framework terminology.
- Do not add global business-rule or relationship sections, speculative sections, or implementation details.
