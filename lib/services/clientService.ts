import { prisma } from "@/lib/prisma";
import { Client } from "@prisma/client";

export const getClients = async (query?: string) => {
    return prisma.client.findMany({
        where: query ? {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { phone: { contains: query, mode: 'insensitive' } },
            ]
        } : undefined,
        include: {
            _count: {
                select: { orders: true }
            }
        },
        orderBy: {
            name: 'asc'
        }
    });
};

export const createClient = async (data: Pick<Client, "name" | "phone" | "address">) => {
    return prisma.client.create({
        data
    });
};
