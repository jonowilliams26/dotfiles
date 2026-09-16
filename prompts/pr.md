---
description: Commit all changes and create a GitHub pull request
argument-hint: "[additional context]"
---

Create a GitHub pull request containing all changes in the current repository.

Use the current conversation and task context when choosing the branch name, commit message, pull request title, and pull request body.

Commit all changes with a concise commit message, including tracked and untracked changes in the pull request.

If the current conversation context and/or task context contains an unambiguous GitHub issue number. Include `Closes #<issue-number>` in the pull request body.

Create a descriptive non-default branch if currently on the repository's default branch. User `<prefix>/<short-description>` naming convention. Choose the most appropriate prefix from this list:
   - `feature/`
   - `bugfix/`
   - `hotfix/`
   - `chore/`
   - `docs/`
   - `refactor/`
   - `test/`
   - `ci/`
   - `build/`
   - `perf/`
   - `security/`


Create a non draft pull request using the `gh` cli.

Report the pull request url back to the user.
