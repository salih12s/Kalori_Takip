import { prisma } from "../../database/prisma.js";

type CreateUserData = {
  email: string;
  username: string;
  passwordHash: string;
};

export const authRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  },

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
