interface AppLogoProps {
  compact?: boolean;
}

export function AppLogo({ compact = false }: AppLogoProps) {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/branding/saydamfitness-logo.png"
        alt="Saydam Fitness"
        className={compact ? "h-9 w-9 rounded-lg object-cover" : "h-10 w-10 rounded-xl object-cover"}
      />
      {!compact ? (
        <span className="text-lg font-bold tracking-tight text-stone-900">Saydam Fitness</span>
      ) : null}
    </div>
  );
}
