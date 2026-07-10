import { prisma } from "../../database/prisma.js";

type CreateUserData = {
  username: string;
  passwordHash: string;
};

export const authRepository = {
  findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username }
    });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id }
    });
  },

  createUser(data: CreateUserData) {
    return prisma.user.create({
      data
    });
  }
};
