/**
 * Profile and goal forms reuse the onboarding validation, which already matches
 * the backend ranges and enum values exactly.
 */
export {
  profileStepSchema as profileFormSchema,
  goalStepSchema as goalFormSchema,
} from "../../onboarding/schemas/onboarding.schema";

export type {
  ProfileStepValues as ProfileFormValues,
  GoalStepValues as GoalFormValues,
} from "../../onboarding/schemas/onboarding.schema";
