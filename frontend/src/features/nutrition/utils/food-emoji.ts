export function getFoodEmoji(name: string): string {
  const normalizedName = name.toLocaleLowerCase("tr-TR");

  if (normalizedName.includes("yumurta") || normalizedName.includes("egg")) return "🥚";
  if (normalizedName.includes("tavuk") || normalizedName.includes("chicken")) return "🍗";
  if (normalizedName.includes("pilav") || normalizedName.includes("rice")) return "🍚";
  if (normalizedName.includes("süt") || normalizedName.includes("milk")) return "🥛";
  if (normalizedName.includes("yoğurt") || normalizedName.includes("yogurt")) return "🥣";
  if (normalizedName.includes("elma") || normalizedName.includes("apple")) return "🍎";
  if (normalizedName.includes("muz") || normalizedName.includes("banana")) return "🍌";

  return "🍽️";
}
