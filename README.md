# Pi dotfiles

Personal [Pi](https://pi.dev) extensions, skills, and prompt templates distributed as a Pi package.

## Extensions

| Extension | Overview |
| --- | --- |
| Git | Provides commands for returning a repository to its updated default branch and for creating task-aware Git worktrees in adjacent Herdr panes. |
| Herdr | Reports Pi's working, blocked, and idle states to Herdr and synchronizes Pi session names with Herdr agent and pane names. |
| Smart Zone | Optionally compacts long-running sessions at 125K tokens, creates a continuation checkpoint, and resumes interrupted work. |

## Extension commands

| Command | Description |
| --- | --- |
| `/main` | Discard confirmed uncommitted changes, switch to the remote's default branch, fast-forward it, and start a new Pi session. |
| `/master` | Alias for `/main`. |
| `/smart-zone [on\|off\|status]` | Toggle session-scoped Smart Zone compaction or explicitly enable, disable, or inspect it. It is disabled by default. |
| `/worktree <task description>` | Generate task-aware Git and Herdr names, create a worktree from the latest remote default branch, and launch Pi in a new pane beside the invoking pane. |

`/worktree` must run inside a Herdr-managed Pi pane. It creates one Git worktree under Herdr's configured worktree directory, then creates exactly one sibling pane in the current tab with that worktree as its working directory. Wide panes split right; narrow or tall panes split down. The new pane receives the generated task label and starts a dedicated named Pi agent. Focus stays on the invoking pane until Herdr confirms that the new Pi agent launched successfully; no workspace or tab is created, and partial failures leave any worktree or pane in place for manual recovery.

## Skills

Once the package is installed, skills are available to Pi automatically and can also be invoked explicitly with `/skill:<name>`.

| Skill | Overview |
| --- | --- |
| `aspire` | Routes Aspire distributed-application work to the appropriate specialized Aspire workflow. |
| `aspire-init` | Creates or initializes an Aspire AppHost and hands resource wiring off to Aspireify. |
| `aspire-monitoring` | Diagnoses Aspire resources through logs, traces, metrics, dashboard telemetry, and deployed Azure diagnostics. |
| `aspire-orchestration` | Manages Aspire lifecycle operations and recovery from locks, port conflicts, and orphaned processes. |
| `aspnet-core-code-quality` | Applies the repository's ASP.NET Core API and code-quality conventions. |
| `csharp-code-quality` | Applies the repository's C# code-quality conventions. |
| `domain-modeling` | Maintains domain concepts, ubiquitous language, business rules, and cardinality relationships in `docs/domain.md`. |
| `dotnet-inspect` | Inspects local .NET packages, assemblies, APIs, dependencies, and version differences instead of guessing. |
| `ef-core-code-quality` | Applies the repository's Entity Framework Core data-access conventions. |
| `herdr` | Controls Herdr panes, tabs, workspaces, commands, and coding agents when explicitly requested. |
| `playwright-cli` | Automates browser interaction, web-page testing, and Playwright test workflows. |
| `requirements-gathering` | Establishes shared requirements and scope through iterative rounds of batched questions without beginning implementation. |
| `tanstack-start` | Guides TanStack Start routes, loaders, server functions, React components, Vite configuration, and Aspire development. |
| `typescript-code-quality` | Applies the repository's TypeScript code-quality conventions. |

## Prompt templates

| Template | Description |
| --- | --- |
| `/handover [additional context or focus]` | Produces a self-contained, zero-context handover for continuing the current task in a new session. |
| `/plan <issue-number> [additional context]` | Reads a GitHub issue, drafts an incremental implementation plan, and publishes it to the issue after explicit approval. |
| `/plan-refine <issue-number> [additional context]` | Marks an approved checkpoint complete when the remaining plan is unchanged, or drafts and publishes a substantive refinement after explicit approval. |
| `/pr [additional context]` | Commits all repository changes, pushes a descriptive branch, and creates a non-draft GitHub pull request. |
| `/requirements <context>` | Runs iterative requirements discovery, maintains confirmed domain knowledge, and creates a GitHub issue after explicit approval. |

The intended delivery flow is `/requirements`, then `/plan <issue-number>` using the issue number returned after requirements approval. Approving the plan publishes it to the issue before checkpoint implementation begins. After each approved checkpoint review, use `/plan-refine <issue-number>`. If the review does not affect the plan, it marks only that checkpoint complete and publishes the mechanical update immediately. If the review affects the remaining work, explicit approval of the substantive refinement replaces the plan published on the issue.

## Install into a project

Install the package project-locally from the target project's root:

```bash
pi install git:github.com/jonowilliams26/dotfiles -l
```

The `-l` flag records the package in that project's `.pi/settings.json`; the package is not installed globally or enabled in unrelated projects. Commit the settings change if the project should share the package with its contributors.

Update installed packages after new changes are pushed:

```bash
pi update --extensions
```

Remove the package from the project with:

```bash
pi remove git:github.com/jonowilliams26/dotfiles -l
```

Run `/reload` in an active Pi session after installing, updating, or removing the package. If the project already contains copied versions of these skills, extensions, or prompts, remove those copies before installing the package to avoid resource-name collisions.

## Development

Package resources live outside Pi's auto-discovered `.pi/` and `.agents/` project directories. Cloning this repository therefore does not enable them; Pi loads them only when the package is explicitly installed or passed temporarily with `pi -e .`.

Install development dependencies and validate the extensions and package contents:

```bash
npm install
npm run check
```

`npm run typecheck` checks all extensions using the root TypeScript configuration. `npm test` runs the automated extension coverage. `npm run pack:check` shows the files that would be included in an npm package without publishing it.

Pi packages execute with the user's full system permissions. Review package changes before installing or updating them.
