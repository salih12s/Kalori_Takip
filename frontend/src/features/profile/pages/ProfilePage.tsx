import { PageShell } from "../../../components/layout/PageShell";
import { ErrorState } from "../../../components/shared/ErrorState";
import { PageHeader } from "../../../components/shared/PageHeader";
import { GoalForm } from "../components/GoalForm";
import { GoalOverviewCard } from "../components/GoalOverviewCard";
import { ProfileForm } from "../components/ProfileForm";
import { ProfileOverviewCard } from "../components/ProfileOverviewCard";
import { ProfileSkeleton } from "../components/ProfileSkeleton";
import { useMyGoal } from "../hooks/useMyGoal";
import { useMyProfile } from "../hooks/useMyProfile";

export function ProfilePage() {
  const profileQuery = useMyProfile();
  const goalQuery = useMyGoal();

  if (profileQuery.isLoading || goalQuery.isLoading) {
    return (
      <PageShell>
        <ProfileSkeleton />
      </PageShell>
    );
  }

  if (profileQuery.isError || goalQuery.isError || !profileQuery.data) {
    return (
      <PageShell>
        <PageHeader
          title="Profil"
          description="Kişisel bilgilerini ve hedeflerini burada yönet."
        />
        <ErrorState
          title="Profil bilgileri alınamadı."
          description="Lütfen tekrar dene."
          onRetry={() => {
            void profileQuery.refetch();
            void goalQuery.refetch();
          }}
        />
      </PageShell>
    );
  }

  const goal = goalQuery.data ?? null;

  return (
    <PageShell>
      <PageHeader
        title="Profil"
        description="Kişisel bilgilerini ve hedeflerini burada yönet."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <ProfileOverviewCard profile={profileQuery.data} />
        <GoalOverviewCard goal={goal} />
        <ProfileForm profile={profileQuery.data} />
        <GoalForm goal={goal} />
      </div>
    </PageShell>
  );
}
