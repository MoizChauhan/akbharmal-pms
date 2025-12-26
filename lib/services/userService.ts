import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

export const getUsers = async () => {
    return prisma.user.findMany({
        orderBy: { name: 'asc' }
    });
}

export const updateUser = async (userId: string, data: { name?: string, email?: string, password?: string, modules?: string[] }) => {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);
    if (data.modules) updateData.activeModules = data.modules as Prisma.InputJsonValue[];


    return prisma.user.update({
        where: { id: userId },
        data: updateData
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


export const createUser = async (data: { name: string, email: string, password?: string }) => {
    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : null;
    return prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            activeModules: ["Workshop"] // Default access
        }
    });
}
