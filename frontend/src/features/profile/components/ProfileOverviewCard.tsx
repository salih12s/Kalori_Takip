import { useAuth } from "../../auth/hooks/useAuth";
import type { ProfileResponse } from "../types/profile.types";
import { genderLabels, privacyLabels } from "../utils/profile-labels";

interface ProfileOverviewCardProps {
  profile: ProfileResponse;
}

interface Row {
  label: string;
  value: string;
}

export function ProfileOverviewCard({ profile }: ProfileOverviewCardProps) {
  const { user } = useAuth();

  const rows: Row[] = [
    { label: "Ad Soyad", value: profile.fullName ?? "—" },
    { label: "Kullanıcı adı", value: user?.username ?? "—" },
    { label: "Boy", value: profile.heightCm != null ? `${profile.heightCm} cm` : "—" },
    {
      label: "Kilo",
      value: profile.currentWeightKg != null ? `${profile.currentWeightKg} kg` : "—",
    },
    { label: "Cinsiyet", value: profile.gender ? genderLabels[profile.gender] : "—" },
    { label: "Gizlilik", value: privacyLabels[profile.privacyLevel] },
  ];

  return (
    <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-stone-900">Profil Özeti</h2>

      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 border-b border-stone-100 pb-2">
            <dt className="text-sm text-stone-500">{row.label}</dt>
            <dd className="text-sm font-medium text-stone-900">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
