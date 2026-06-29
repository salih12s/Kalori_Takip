# Development Workflow

## AI handoff

This project may be edited by Codex, Claude or another AI tool.

To avoid confusion:

1. Read `CLAUDE.md`.
2. Read `docs/CURRENT_STATE.md`.
3. Work only on the current phase.
4. Update `docs/CURRENT_STATE.md` after finishing.

## Git workflow

Commit after every phase or stable step.

Examples:

```txt
feat: initialize project structure
feat: add auth module
feat: add profile module
feat: add nutrition logging
feat: add dashboard summary
```

## Safe task prompt

Use this pattern:

```txt
Read CLAUDE.md and docs/CURRENT_STATE.md.
We are in Phase X.
Do only this task: ...
Before coding, list the files you will change.
Do not change unrelated files.
After finishing, update docs/CURRENT_STATE.md.
```

## Never prompt like this

```txt
Build the whole project.
```

That causes large uncontrolled changes.
