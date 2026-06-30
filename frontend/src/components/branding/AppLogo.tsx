interface AppLogoProps {
  compact?: boolean;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const imageSizeClass = {
  sm: "h-9 w-9 rounded-lg",
  md: "h-10 w-10 rounded-xl",
  lg: "h-14 w-14 rounded-2xl",
};

const textSizeClass = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
};

export function AppLogo({ compact = false, showText, size = compact ? "sm" : "md" }: AppLogoProps) {
  const shouldShowText = showText ?? !compact;

  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/branding/saydamfitness-logo.png"
        alt="Saydam Fitness"
        className={`${imageSizeClass[size]} object-cover shadow-sm`}
      />
      {shouldShowText ? (
        <span className={`${textSizeClass[size]} font-bold tracking-tight text-stone-900`}>
          Saydam Fitness
        </span>
      ) : null}
    </div>
  );
}
