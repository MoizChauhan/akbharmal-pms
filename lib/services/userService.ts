import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const getUsers = async () => {
    return prisma.user.findMany({
        orderBy: { name: 'asc' }
    });
}

export const updateUserModules = async (userId: string, modules: string[]) => {
    return prisma.user.update({
        where: { id: userId },
        data: {
            activeModules: modules as Prisma.InputJsonValue[]
        }
    });
}
