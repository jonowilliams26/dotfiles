---
name: typescript-code-quality
description: Apply repository TypeScript code-quality conventions when writing, modifying, refactoring, or reviewing TypeScript code.
---

# TypeScript Code Quality

Apply these conventions to all TypeScript code in scope.

## Type safety

Do not use `any` unless it is absolutely necessary. Preserve concrete types and narrow uncertain values instead of bypassing type checking.

Before using an external API, inspect its declarations in `node_modules` to determine the actual exported types and signatures. Do not guess external API types.

## Imports

Use top-level imports only. Do not use inline or dynamic imports, including:

- `await import("package")`
- `import("package").Type`
- Dynamic type imports

Use top-level value or type imports instead:

```typescript
import { createClient } from "package";
import type { ClientOptions } from "package";
```

## Conditional statements

Always use braces for `if` statement bodies, including single statements and early returns. Format opening braces on the same line as the condition.

```typescript
// Bad
if (condition) return;

// Good
if (condition) {
  return;
}
```

## Function parameters

- When a function is simple and has one or two parameters, use positional parameters.
- When a function has more than two parameters, use a single object parameter to make each argument's purpose explicit at the call site.
- Inline the object parameter type when it is not reused. Do not create a single-use type or interface solely for the parameter object.

```typescript

function getUserById(id: string): User {
  // Function implementation.
}


function createUser({
  firstName,
  lastName,
  dateOfBirth,
  emailAddress,
}: {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  emailAddress: string;
}): User {
  // Function implementation.
}

const user = createUser({
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: new Date("1990-01-01"),
  emailAddress: "..."
});
```