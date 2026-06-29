# Code Size Limits

## Frontend limits

| File type | Target max |
|---|---:|
| Page | 350 lines |
| Feature component | 250 lines |
| Shared component | 150 lines |
| Form component | 250 lines |
| Chart component | 200 lines |
| Hook | 150 lines |
| API file | 150 lines |
| Type file | 200 lines |

## Backend limits

| File type | Target max |
|---|---:|
| Controller | 220 lines |
| Service | 300 lines |
| Repository | 300 lines |
| Routes | 150 lines |
| Validation | 220 lines |
| Mapper | 200 lines |
| Types | 200 lines |

## Alarm rule

A 700-800 line file is not acceptable.

If a file grows over 500 lines, create a refactor plan.

## Refactor strategy

If a page grows:
- extract sections
- extract dialogs
- extract forms
- extract tables
- extract charts

If a service grows:
- extract repository
- extract helpers
- extract mappers
- extract scoring service
