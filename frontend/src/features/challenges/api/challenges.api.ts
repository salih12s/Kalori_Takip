import { api, type ApiResponse } from "../../../lib/api";
import type {
  Challenge,
  ChallengeDetail,
  CreateChallengePayload,
  MembershipResponse,
} from "../types/challenge.types";

/** Challenge endpoints. Responses unwrap the `{ success, message, data }` envelope. */
export const challengesApi = {
  async list(): Promise<Challenge[]> {
    const res = await api.get<ApiResponse<{ challenges: Challenge[] }>>("/challenges");
    return res.data?.challenges ?? [];
  },
  async listMine(): Promise<Challenge[]> {
    const res = await api.get<ApiResponse<{ challenges: Challenge[] }>>("/challenges/mine");
    return res.data?.challenges ?? [];
  },
  async getById(challengeId: string): Promise<ChallengeDetail> {
    const res = await api.get<ApiResponse<{ challenge: ChallengeDetail }>>(
      `/challenges/${challengeId}`
    );
    return (res.data as { challenge: ChallengeDetail }).challenge;
  },
  async create(payload: CreateChallengePayload): Promise<Challenge> {
    const res = await api.post<ApiResponse<{ challenge: Challenge }>>("/challenges", payload);
    return (res.data as { challenge: Challenge }).challenge;
  },
  async join(challengeId: string): Promise<MembershipResponse> {
    const res = await api.post<ApiResponse<{ membership: MembershipResponse }>>(
      `/challenges/${challengeId}/join`
    );
    return (res.data as { membership: MembershipResponse }).membership;
  },
  async leave(challengeId: string): Promise<void> {
    await api.delete<ApiResponse<{ left: boolean }>>(`/challenges/${challengeId}/leave`);
  },
  async recalculate(challengeId: string): Promise<MembershipResponse> {
    const res = await api.post<ApiResponse<{ membership: MembershipResponse }>>(
      `/challenges/${challengeId}/recalculate`
    );
    return (res.data as { membership: MembershipResponse }).membership;
  },
  async recalculateAll(): Promise<MembershipResponse[]> {
    const res = await api.post<ApiResponse<{ memberships: MembershipResponse[] }>>(
      "/challenges/recalculate-all"
    );
    return res.data?.memberships ?? [];
  },
};
