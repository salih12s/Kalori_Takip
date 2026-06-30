import { api, type ApiResponse } from "../../../lib/api";
import type {
  FollowRequest,
  FollowResponse,
  FriendSummary,
  PublicProfile,
  SafeUserSummary,
} from "../types/social.types";

/** Social/follow endpoints. Responses unwrap the `{ success, message, data }` envelope. */
export const socialApi = {
  async searchUsers(query: string): Promise<SafeUserSummary[]> {
    const res = await api.get<ApiResponse<{ users: SafeUserSummary[] }>>("/users/search", {
      q: query,
    });
    return res.data?.users ?? [];
  },
  async followUser(userId: string): Promise<FollowResponse> {
    const res = await api.post<ApiResponse<{ follow: FollowResponse }>>(`/follows/${userId}`);
    return (res.data as { follow: FollowResponse }).follow;
  },
  async unfollowUser(userId: string): Promise<void> {
    await api.delete<ApiResponse<{ unfollowed: boolean }>>(`/follows/${userId}`);
  },
  async getFriends(): Promise<FriendSummary[]> {
    const res = await api.get<ApiResponse<{ friends: FriendSummary[] }>>("/follows/friends");
    return res.data?.friends ?? [];
  },
  async getFollowers(): Promise<FriendSummary[]> {
    const res = await api.get<ApiResponse<{ followers: FriendSummary[] }>>("/follows/followers");
    return res.data?.followers ?? [];
  },
  async getRequests(): Promise<FollowRequest[]> {
    const res = await api.get<ApiResponse<{ requests: FollowRequest[] }>>("/follows/requests");
    return res.data?.requests ?? [];
  },
  async acceptRequest(followId: string): Promise<FollowResponse> {
    const res = await api.post<ApiResponse<{ follow: FollowResponse }>>(
      `/follows/requests/${followId}/accept`
    );
    return (res.data as { follow: FollowResponse }).follow;
  },
  async rejectRequest(followId: string): Promise<void> {
    await api.post<ApiResponse<{ rejected: boolean }>>(`/follows/requests/${followId}/reject`);
  },
  async getPublicProfile(userId: string): Promise<PublicProfile> {
    const res = await api.get<ApiResponse<{ profile: PublicProfile }>>(
      `/users/${userId}/public-profile`
    );
    return (res.data as { profile: PublicProfile }).profile;
  },
};
