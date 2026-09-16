---
name: tanstack-start
description: Use whenever creating, modifying, debugging, or reviewing a TanStack Start web application. Covers routes, loaders, server functions, server-only code, React components, Vite configuration, project structure, and local development through Aspire.
---

<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `pnpm dlx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

## Known Gotchas

- `AddViteApp` owns the Vite HTTP endpoint and `PORT`; do not add another `.WithHttpEndpoint()` to the `web` resource.
- TanStack Start code is isomorphic by default. Use `createServerFn` or `.server.ts` modules for secrets, filesystem access, environment variables, and backend-only work.
- Keep backend-only logic used by a single server function directly inside that server function's handler in the `.functions.ts` file. Do not add unnecessary indirection by extracting it to a `.server.ts` function that merely gets called once.
- Extract backend-only logic to a `.server.ts` module when it is reused by multiple server functions or other server-only entry points.
- When using a TanStack server function in a React component, call it through the `useServerFn` hook rather than invoking the exported server function directly. Route loaders can invoke server functions directly.
- Prefer the `.server.ts` filename convention for reusable server-only modules instead of marker imports like `@tanstack/react-start/server-only`.
- Keep `tanstackStart()` before `viteReact()` in Vite config, and keep `devtools()` first while the generated TanStack Devtools plugin is enabled.
- Never run the frontend on its own. ALWAYS use Aspire to run the project.

## File / Folder Structure

Use the following folder structure to organise library code:

```
src/lib/<module>
├── <name>.functions.ts   # createServerFn definitions and single-use backend logic
├── <name>.server.ts      # Reusable server-only helpers shared by server entry points
└── <name>.ts             # Shared (client-safe)
```
