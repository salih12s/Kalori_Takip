import { prisma } from "../../database/prisma.js";
import type { CreateGoalInput, UpdateGoalInput } from "./goals.types.js";

export const goalsRepository = {
  findActiveByUserId(userId: string) {
    return prisma.userGoal.findFirst({
      where: { userId, isActive: true },
      orderBy: { createdAt: "desc" }
    });
  },

  findById(goalId: string) {
    return prisma.userGoal.findUnique({
      where: { id: goalId }
    });
  },

  createActiveGoal(userId: string, data: CreateGoalInput) {
    return prisma.$transaction(async (tx) => {
      await tx.userGoal.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false }
      });

      return tx.userGoal.create({
        data: {
          ...data,
          userId,
          isActive: true
        }
      });
    });
  },

  updateOwnedGoal(goalId: string, userId: string, data: UpdateGoalInput) {
    return prisma.$transaction(async (tx) => {
      if (data.isActive === true) {
        await tx.userGoal.updateMany({
          where: {
            userId,
            isActive: true,
            id: { not: goalId }
          },
          data: { isActive: false }
        });
      }

      return tx.userGoal.update({
        where: {
          id: goalId,
          userId
        },
        data
      });
    });
  }
};
