export type ChallengeType = "STEPS" | "FOOD_LOG" | "WORKOUT" | "RUN_DISTANCE" | "WATER";

export type ChallengeStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export type ChallengeMemberStatus = "ACTIVE" | "COMPLETED";

export interface CurrentUserMembership {
  id: string;
  progress: number;
  status: ChallengeMemberStatus;
  joinedAt: string;
}

export interface Challenge {
  id: string;
  creatorId: string;
  title: string;
  description: string | null;
  type: ChallengeType;
  targetValue: number;
  unit: string;
  startsAt: string;
  endsAt: string;
  status: ChallengeStatus;
  isPublic: boolean;
  memberCount: number;
  currentUserMembership: CurrentUserMembership | null;
}

export interface ChallengeMemberSummary {
  userId: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  progress: number;
  status: ChallengeMemberStatus;
}

export interface ChallengeDetail extends Challenge {
  members: ChallengeMemberSummary[];
}

export interface CreateChallengePayload {
  title: string;
  description?: string;
  type: ChallengeType;
  targetValue: number;
  unit: string;
  startsAt: string;
  endsAt: string;
  isPublic: boolean;
}

export interface MembershipResponse {
  id: string;
  challengeId: string;
  userId: string;
  progress: number;
  status: ChallengeMemberStatus;
  joinedAt: string;
}
