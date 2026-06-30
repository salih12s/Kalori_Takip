interface AppLogoProps {
  compact?: boolean;
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  orientation?: "horizontal" | "vertical";
}

const imageSizeClass = {
  sm: "h-9 w-9 rounded-lg",
  md: "h-10 w-10 rounded-xl",
  lg: "h-14 w-14 rounded-2xl",
  xl: "h-24 w-24 rounded-3xl",
};

const textSizeClass = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
  xl: "text-3xl",
};

export function AppLogo({
  compact = false,
  showText,
  size = compact ? "sm" : "md",
  orientation = "horizontal",
}: AppLogoProps) {
  const shouldShowText = showText ?? !compact;
  const isVertical = orientation === "vertical";

  return (
    <div className={`flex items-center ${isVertical ? "flex-col gap-3 text-center" : "gap-2.5"}`}>
      <img
        src="/branding/saydamfitness-logo.png"
        alt="Saydam Fitness"
        className={`${imageSizeClass[size]} object-contain shadow-sm`}
      />
      {shouldShowText ? (
        <span className={`${textSizeClass[size]} font-bold tracking-tight text-stone-900 dark:text-stone-50`}>
          Saydam Fitness
        </span>
      ) : null}
    </div>
  );
}
