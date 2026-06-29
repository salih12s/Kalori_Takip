# AI Agent Rules

## Main rule

Do not act like a solo architect. Follow the docs.

## Before coding

Always read:

- docs/CURRENT_STATE.md
- docs/PROJECT_SCOPE.md
- docs/TECH_STACK.md
- docs/ARCHITECTURE.md
- docs/CODE_SIZE_LIMITS.md

Then report:

- current phase
- what exists
- what is missing
- files to change

Do not code before approval if the user asked for analysis first.

## Forbidden

- Rewriting the project from scratch
- Changing the schema without approval
- Adding out-of-phase features
- Creating huge files
- Mixing frontend and backend concerns
- Writing UI text in English
- Removing docs
- Changing layout without permission

## Required final report

After every task, report:

- files changed
- commands run
- tests performed
- known issues
- next step

Then update:

```txt
docs/CURRENT_STATE.md
```

## Prompt language

Prompts and docs are English to reduce tokens.

Frontend UI text is Turkish.
