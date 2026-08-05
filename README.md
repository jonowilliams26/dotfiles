# Pi dotfiles

Personal [Pi](https://pi.dev) extensions, skills, and prompt templates distributed as a Pi package.

## Extensions

| Extension | Overview |
| --- | --- |
| Git | Provides commands for returning a repository to its updated default branch and for creating task-aware Git worktrees in Herdr. |
| Herdr | Reports Pi's working, blocked, and idle states to Herdr and synchronizes Pi session names with Herdr agent and pane names. |

## Extension commands

| Command | Description |
| --- | --- |
| `/main` | Discard confirmed uncommitted changes, switch to the remote's default branch, fast-forward it, and start a new Pi session. |
| `/master` | Alias for `/main`. |
| `/worktree <task description>` | Generate task-aware Git and Herdr names, create a worktree from the latest remote default branch, and launch Pi in its Herdr pane. |

## Skills

Skills are available to Pi automatically and can also be invoked explicitly with `/skill:<name>`.

| Skill | Overview |
| --- | --- |
| `aspire` | Routes Aspire distributed-application work to the appropriate specialized Aspire workflow. |
| `aspire-init` | Creates or initializes an Aspire AppHost and hands resource wiring off to Aspireify. |
| `aspire-monitoring` | Diagnoses Aspire resources through logs, traces, metrics, dashboard telemetry, and deployed Azure diagnostics. |
| `aspire-orchestration` | Manages Aspire lifecycle operations and recovery from locks, port conflicts, and orphaned processes. |
| `aspnet-core-code-quality` | Applies the repository's ASP.NET Core API and code-quality conventions. |
| `csharp-code-quality` | Applies the repository's C# code-quality conventions. |
| `dotnet-inspect` | Inspects local .NET packages, assemblies, APIs, dependencies, and version differences instead of guessing. |
| `ef-core-code-quality` | Applies the repository's Entity Framework Core data-access conventions. |
| `herdr` | Controls Herdr panes, tabs, workspaces, commands, and coding agents when explicitly requested. |
| `playwright-cli` | Automates browser interaction, web-page testing, and Playwright test workflows. |
| `tanstack-start` | Guides TanStack Start routes, loaders, server functions, React components, Vite configuration, and Aspire development. |
| `typescript-code-quality` | Applies the repository's TypeScript code-quality conventions. |

## Prompt templates

| Template | Description |
| --- | --- |
| `/pr [additional context]` | Commits all repository changes, pushes a descriptive branch, and creates a non-draft GitHub pull request. |

## Install from GitHub

Pi installs packages globally by default, making these resources available in every project:

```bash
pi install git:github.com/jonowilliams26/dotfiles
```

Update the package after new changes are pushed:

```bash
pi update --extensions
```

Remove the package with:

```bash
pi remove git:github.com/jonowilliams26/dotfiles
```

Run `/reload` in an active Pi session after installing or updating the package.

## Development

Install development dependencies and validate the extensions and package contents:

```bash
npm install
npm run check
```

`npm run typecheck` checks all extensions using the root TypeScript configuration. `npm run pack:check` shows the files that would be included in an npm package without publishing it.

Pi packages execute with the user's full system permissions. Review package changes before installing or updating them.
