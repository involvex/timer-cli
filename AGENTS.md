# AGENTS.md

This file provides guidance for AI agents working in this repository.

## Project Overview

- **Project name**: timer-cli
- **Type**: CLI tool (Bun + TypeScript)
- **Purpose**: A terminal timer with progress bar, notifications, and loop functionality
- **Entry point**: `index.ts`

## Commands

### Running the project

```bash
# Run the timer CLI
bun run index.ts
bun start

# Run with custom minutes
bun start 25
bun start --loop 45
```

### Type checking

```bash
# Type-check all TypeScript files
npx tsc --noEmit

# Or with bun (if installed)
bun x tsc --noEmit
```

### Testing

No test framework is currently configured. When adding tests:

```bash
# Run all tests (using Bun's test runner)
bun test

# Run a single test file
bun test path/to/test.test.ts

# Run tests matching a pattern
bun test --grep "timer"
```

## Code Style Guidelines

### TypeScript Configuration

The project uses strict TypeScript (`tsconfig.json`). Key settings:

- `strict: true` - full type checking enabled
- `noUncheckedIndexedAccess: true` - array access returns `T | undefined`
- `noImplicitOverride: true` - must use `override` keyword for inherited methods

### Imports

- Use ESM import syntax (`import { foo } from "./bar"`)
- Use `.ts` extensions for relative imports when required by `verbatimModuleSyntax`
- Group imports: external libraries first, then internal modules

```typescript
// Good
import { parseInt } from "node:querystring";
import { formatTime } from "./utils.ts";
```

### Naming Conventions

- **Variables/functions**: camelCase (`formatTime`, `totalSeconds`)
- **Types/interfaces**: PascalCase (`TimerConfig`, `TimerState`)
- **Constants**: SCREAMING_SNAKE_CASE for true constants (`MAX_MINUTES`)
- **Files**: kebab-case (`timer-utils.ts`, `types.ts`)

### Types

- Prefer explicit return types for exported functions
- Use `interface` for object shapes, `type` for unions/aliases
- Avoid `any` - use `unknown` when type is truly unknown

```typescript
// Good
interface TimerConfig {
  minutes: number;
  loop: boolean;
}

function formatTime(seconds: number): string {
  // ...
}
```

### Error Handling

- Use try/catch for operations that may fail
- Provide meaningful error messages
- Use `console.error` for user-facing errors
- Exit with appropriate exit codes (`process.exit(1)` for errors)

```typescript
// Good
if (minutes <= 0) {
  console.error("Please provide a valid number of minutes");
  process.exit(1);
}
```

### Formatting

- Use 2 spaces for indentation
- Use double quotes for strings
- Use semicolons at statement ends
- Max line length: 100 characters (soft limit)
- Use template literals for string interpolation

```typescript
// Good
const bar = "█".repeat(Math.min(Math.floor(progress), 30)).padEnd(30, "░");
process.stdout.write(`\r${formatTime(remaining)} [${bar}]`);
```

### Best Practices

- Prefer `const` over `let` - only use `let` when reassignment is needed
- Use early returns to avoid nested conditionals
- Keep functions small and focused (single responsibility)
- Use descriptive variable names (`remainingSeconds` vs `n`)
- Add type annotations for function parameters

### CLI Arguments

- Use descriptive argument names (`--loop`, `-l`)
- Validate input early and provide helpful error messages
- Support both short and long form flags

```typescript
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--loop" || args[i] === "-l") {
    loop = true;
  }
}
```

### Bun-Specific

- Use `Bun.spawnSync` for spawning subprocesses
- Use top-level await where appropriate
- Prefer Bun's built-in APIs over Node equivalents when available
- Shebang: `#!/usr/bin/env bun` for executable files

## Adding New Features

When adding functionality:

1. Keep `index.ts` as the main entry point
2. Extract reusable logic into separate files in the project root
3. Update this AGENTS.md if adding new commands or conventions
4. Run type checking before committing: `npx tsc --noEmit`
