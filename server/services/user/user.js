import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const user = {
  async createUser({ email, password, username, name }) {
    const userCreated = await prisma.ch_user.create({
      data: {
        email,
        password,
        username,
        name,
      },
    });
    return userCreated;
  },
  async userLogin({ username, password }) {
    try {
      if (!username || !password) throw { message: "need credentials" };
      const userToLogin = await prisma.ch_user.findFirst({
        where: {
          username,
          password,
        },
        select: {
          username: true,
          name: true,
          email: true,
        },
      });
      return userToLogin;
    } catch (error) {
      console.log("error", error);
    }
  },
};
