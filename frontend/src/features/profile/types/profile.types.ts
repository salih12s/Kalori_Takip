export type {
  Gender,
  PrivacyLevel,
  GoalType,
  ActivityLevel,
  ProfileResponse,
  GoalResponse,
  UpdateProfilePayload,
  CreateGoalPayload,
} from "../../onboarding/types/onboarding.types";

import type { CreateGoalPayload } from "../../onboarding/types/onboarding.types";

/** PUT /goals/:goalId accepts the same shape as create (partial on the backend). */
export type UpdateGoalPayload = CreateGoalPayload;
