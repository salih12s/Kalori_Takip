import { useState } from "react";

import { PageShell } from "../../../components/layout/PageShell";
import { PageHeader } from "../../../components/shared/PageHeader";
import { FollowersList } from "../components/FollowersList";
import { FollowRequestsPanel } from "../components/FollowRequestsPanel";
import { FriendsList } from "../components/FriendsList";
import { PublicProfileDialog } from "../components/PublicProfileDialog";
import { UserSearchPanel } from "../components/UserSearchPanel";

export function FriendsPage() {
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

  return (
    <PageShell>
      <PageHeader
        title="Arkadaşlar"
        description="Arkadaşlarını takip et, istekleri yönet ve gelişimlerini gör."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <UserSearchPanel onViewProfile={setProfileUserId} />
        <FollowRequestsPanel />
        <FriendsList onViewProfile={setProfileUserId} />
        <FollowersList onViewProfile={setProfileUserId} />
      </div>

      <PublicProfileDialog userId={profileUserId} onClose={() => setProfileUserId(null)} />
    </PageShell>
  );
}
