import { Flame, Footprints, Trophy, X } from "lucide-react";
import type { ReactNode } from "react";

import { ErrorState } from "../../../components/shared/ErrorState";
import { usePublicProfile } from "../hooks/usePublicProfile";
import { getInitials, privacyLabels } from "../utils/social-labels";

interface PublicProfileDialogProps {
  userId: string | null;
  onClose: () => void;
}

export function PublicProfileDialog({ userId, onClose }: PublicProfileDialogProps) {
  const profileQuery = usePublicProfile(userId);

  if (!userId) return null;

  const profile = profileQuery.data;
  const hasStats =
    profile !== undefined &&
    (profile.weeklyScore !== undefined ||
      profile.todayStepTotal !== undefined ||
      profile.currentStreak !== undefined);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/30 px-4 py-6">
      <section className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-stone-900">Profil</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="grid h-8 w-8 place-items-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <X size={18} />
          </button>
        </div>

        {profileQuery.isLoading ? (
          <div className="space-y-3">
            <div className="h-16 animate-pulse rounded-lg bg-stone-100" />
            <div className="h-20 animate-pulse rounded-lg bg-stone-100" />
          </div>
        ) : profileQuery.isError || !profile ? (
          <ErrorState
            title="Profil alınamadı."
            description="Lütfen tekrar dene."
            onRetry={() => void profileQuery.refetch()}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-stone-200 text-lg font-semibold text-stone-600">
                {getInitials(profile.username)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-stone-900">
                  {profile.username}
                </p>
                <p className="truncate text-sm text-stone-500">
                  {profile.fullName ?? "İsim belirtilmemiş"}
                </p>
                <p className="mt-0.5 text-xs text-stone-400">
                  Gizlilik: {privacyLabels[profile.privacyLevel]}
                </p>
              </div>
            </div>

            {hasStats ? (
              <div className="grid grid-cols-3 gap-2">
                <StatBox icon={<Trophy size={16} />} label="Haftalık Puan" value={profile.weeklyScore ?? 0} />
                <StatBox icon={<Footprints size={16} />} label="Bugünkü Adım" value={profile.todayStepTotal ?? 0} />
                <StatBox icon={<Flame size={16} />} label="Seri" value={profile.currentStreak ?? 0} />
              </div>
            ) : (
              <p className="rounded-lg bg-stone-50 px-3 py-3 text-center text-sm text-stone-500">
                Bu kullanıcının istatistikleri gizli.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

interface StatBoxProps {
  icon: ReactNode;
  label: string;
  value: number;
}

function StatBox({ icon, label, value }: StatBoxProps) {
  return (
    <div className="rounded-lg border border-stone-200 p-3 text-center">
      <span className="mx-auto mb-1 grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
        {icon}
      </span>
      <p className="text-base font-bold text-stone-900">{value}</p>
      <p className="text-[11px] leading-tight text-stone-500">{label}</p>
    </div>
  );
}
