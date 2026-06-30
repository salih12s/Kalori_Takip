import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  acceptRequest,
  followUser,
  getFollowers,
  getFriends,
  getPublicProfile,
  getRequests,
  rejectRequest,
  searchUsers,
  unfollowUser
} from "./social.controller.js";

export const socialRoutes = Router();

socialRoutes.get("/users/search", authMiddleware, searchUsers);
socialRoutes.get("/users/:userId/public-profile", authMiddleware, getPublicProfile);
socialRoutes.get("/follows/friends", authMiddleware, getFriends);
socialRoutes.get("/follows/followers", authMiddleware, getFollowers);
socialRoutes.get("/follows/requests", authMiddleware, getRequests);
socialRoutes.post("/follows/requests/:followId/accept", authMiddleware, acceptRequest);
socialRoutes.post("/follows/requests/:followId/reject", authMiddleware, rejectRequest);
socialRoutes.post("/follows/:userId", authMiddleware, followUser);
socialRoutes.delete("/follows/:userId", authMiddleware, unfollowUser);
