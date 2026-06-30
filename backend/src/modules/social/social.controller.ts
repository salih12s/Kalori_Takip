import { successResponse } from "../../shared/responses/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { socialService } from "./social.service.js";
import { followIdParamsSchema, userIdParamsSchema, userSearchSchema } from "./social.validation.js";

export const searchUsers = asyncHandler(async (req, res) => {
  const input = userSearchSchema.parse(req.query);
  const result = await socialService.searchUsers(req.user!.id, input.q);

  return res.json(successResponse("Users retrieved successfully", result));
});

export const followUser = asyncHandler(async (req, res) => {
  const input = userIdParamsSchema.parse(req.params);
  const result = await socialService.followUser(req.user!.id, input.userId);

  return res.status(201).json(successResponse("Follow request created successfully", result));
});

export const unfollowUser = asyncHandler(async (req, res) => {
  const input = userIdParamsSchema.parse(req.params);
  const result = await socialService.unfollowUser(req.user!.id, input.userId);

  return res.json(successResponse("User unfollowed successfully", result));
});

export const getFriends = asyncHandler(async (req, res) => {
  const result = await socialService.getFriends(req.user!.id);

  return res.json(successResponse("Friends retrieved successfully", result));
});

export const getFollowers = asyncHandler(async (req, res) => {
  const result = await socialService.getFollowers(req.user!.id);

  return res.json(successResponse("Followers retrieved successfully", result));
});

export const getRequests = asyncHandler(async (req, res) => {
  const result = await socialService.getRequests(req.user!.id);

  return res.json(successResponse("Follow requests retrieved successfully", result));
});

export const acceptRequest = asyncHandler(async (req, res) => {
  const input = followIdParamsSchema.parse(req.params);
  const result = await socialService.acceptRequest(req.user!.id, input.followId);

  return res.json(successResponse("Follow request accepted successfully", result));
});

export const rejectRequest = asyncHandler(async (req, res) => {
  const input = followIdParamsSchema.parse(req.params);
  const result = await socialService.rejectRequest(req.user!.id, input.followId);

  return res.json(successResponse("Follow request rejected successfully", result));
});

export const getPublicProfile = asyncHandler(async (req, res) => {
  const input = userIdParamsSchema.parse(req.params);
  const result = await socialService.getPublicProfile(req.user!.id, input.userId);

  return res.json(successResponse("Public profile retrieved successfully", result));
});
