import type { ChallengeMemberStatus, ChallengeStatus, ChallengeType } from "@prisma/client";
import type { z } from "zod";

import type { createChallengeSchema } from "./challenges.validation.js";

export type CreateChallengeInput = z.infer<typeof createChallengeSchema>;

export type CurrentUserMembership = {
  id: string;
  progress: number;
  status: ChallengeMemberStatus;
  joinedAt: Date;
} | null;

export type ChallengeListItem = {
  id: string;
  creatorId: string;
  title: string;
  description: string | null;
  type: ChallengeType;
  targetValue: number;
  unit: string;
  startsAt: Date;
  endsAt: Date;
  status: ChallengeStatus;
  isPublic: boolean;
  memberCount: number;
  currentUserMembership: CurrentUserMembership;
};

export type ChallengeMemberSummary = {
  userId: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  progress: number;
  status: ChallengeMemberStatus;
};

export type ChallengeDetailResponse = ChallengeListItem & {
  members: ChallengeMemberSummary[];
};

export type MembershipResponse = {
  id: string;
  challengeId: string;
  userId: string;
  progress: number;
  status: ChallengeMemberStatus;
  joinedAt: Date;
};
