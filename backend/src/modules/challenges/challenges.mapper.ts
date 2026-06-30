import type { Challenge, ChallengeMember, Profile, User } from "@prisma/client";

import type {
  ChallengeDetailResponse,
  ChallengeListItem,
  ChallengeMemberSummary,
  CurrentUserMembership,
  MembershipResponse
} from "./challenges.types.js";

type ChallengeWithMine = Challenge & {
  _count: { members: number };
  members: ChallengeMember[];
};

type MemberWithUser = ChallengeMember & {
  user: Pick<User, "id" | "username"> & { profile: Profile | null };
};

type ChallengeWithMembers = Challenge & {
  _count: { members: number };
  members: MemberWithUser[];
};

function toCurrentUserMembership(member?: ChallengeMember | null): CurrentUserMembership {
  if (!member) {
    return null;
  }

  return {
    id: member.id,
    progress: Number(member.progress),
    status: member.status,
    joinedAt: member.joinedAt
  };
}

function toBase(challenge: Challenge, memberCount: number, mine: CurrentUserMembership): ChallengeListItem {
  return {
    id: challenge.id,
    creatorId: challenge.creatorId,
    title: challenge.title,
    description: challenge.description,
    type: challenge.type,
    targetValue: Number(challenge.targetValue),
    unit: challenge.unit,
    startsAt: challenge.startsAt,
    endsAt: challenge.endsAt,
    status: challenge.status,
    isPublic: challenge.isPublic,
    memberCount,
    currentUserMembership: mine
  };
}

function toMemberSummary(member: MemberWithUser): ChallengeMemberSummary {
  return {
    userId: member.userId,
    username: member.user.username,
    fullName: member.user.profile?.fullName ?? null,
    avatarUrl: member.user.profile?.avatarUrl ?? null,
    progress: Number(member.progress),
    status: member.status
  };
}

export function toChallengeListItem(challenge: ChallengeWithMine): ChallengeListItem {
  return toBase(challenge, challenge._count.members, toCurrentUserMembership(challenge.members[0]));
}

export function toChallengeDetailResponse(
  challenge: ChallengeWithMembers,
  currentUserId: string
): ChallengeDetailResponse {
  const mine = challenge.members.find((member) => member.userId === currentUserId);

  return {
    ...toBase(challenge, challenge._count.members, toCurrentUserMembership(mine)),
    members: challenge.members.map(toMemberSummary)
  };
}

export function toMembershipResponse(member: ChallengeMember): MembershipResponse {
  return {
    id: member.id,
    challengeId: member.challengeId,
    userId: member.userId,
    progress: Number(member.progress),
    status: member.status,
    joinedAt: member.joinedAt
  };
}
