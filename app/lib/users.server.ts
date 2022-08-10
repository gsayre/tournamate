// app/utils/user.server.ts
import bcrypt from 'bcryptjs';
import type { RegisterForm } from '~/lib/types/types';
import { prisma } from '~/lib/db.server';

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      profile: {
        create: {
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    },
  });
  return { id: newUser.id, email: user.email };
};

export const getOtherUsers = async (userId: number) => {
  return await prisma.user.findMany({
    where: { id: { not: userId} },
    orderBy: { profile: { firstName: 'asc' } },
  });
};
