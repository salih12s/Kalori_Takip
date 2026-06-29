# Frontend Rules

## Language rule

Frontend user-facing text must be Turkish.

Correct:

```tsx
<Button>Yemek Ekle</Button>
<PageHeader title="Günlük Takip" />
```

Wrong:

```tsx
<Button>Add Food</Button>
<PageHeader title="Daily Tracking" />
```

Code, file names, variables and comments should be English.

## Hard rules

- Page files must stay under 350 lines.
- No huge single-page components.
- No inline styles.
- Use Tailwind CSS.
- Use shadcn/ui where suitable.
- Use Motion for animations.
- Use TanStack Query for server state.
- Use React Hook Form + Zod for forms.
- Every page needs loading, error and empty states.
- Do not break the main layout.
- Do not randomly change theme colors.

## Dashboard grid rule

```tsx
className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
```

Never place 5-6 dashboard cards in one row on desktop.

## Required UI states

Every data page must include:

- Loading state
- Error state
- Empty state
- Success toast after mutation

## Animation rules

Allowed:
- fade in
- slide up
- count up
- progress fill
- subtle hover
- soft highlight

Avoid:
- bouncing effects
- heavy neon effects
- infinite motion
- layout-shifting animation

## UI copy examples

Use Turkish labels:

- Giriş Yap
- Kayıt Ol
- Yemek Ekle
- Aktivite Ekle
- Bugünkü Kalori
- Kalan Kalori
- Protein
- Karbonhidrat
- Yağ
- Adım
- Spor Günü
- Dinlenme Günü
- Arkadaşlar
- Liderlik Tablosu
- Profil
- Ayarlar
