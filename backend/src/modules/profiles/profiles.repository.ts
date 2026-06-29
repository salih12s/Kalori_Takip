import { prisma } from "../../database/prisma.js";
import type { UpdateProfileInput } from "./profiles.types.js";

export const profilesRepository = {
  findByUserId(userId: string) {
    return prisma.profile.findUnique({
      where: { userId }
    });
  },

  createDefault(userId: string) {
    return prisma.profile.create({
      data: { userId }
    });
  },

  updateByUserId(userId: string, data: UpdateProfileInput) {
    return prisma.profile.update({
      where: { userId },
      data
    });
  }
};
