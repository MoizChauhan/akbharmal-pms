import { prisma } from "@/lib/prisma";
import { OrderStatus, Prisma } from "@prisma/client";

export const getOrders = async () => {
    return prisma.order.findMany({
        include: {
            client: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const createOrder = async (data: {
    clientId: string;
    totalAmount: number;
    items: any[];
}) => {
    // Check for new glass masters in items
    for (const item of data.items) {
        if (item.type === 'glass' && !item.details.glassMasterId) {
            // Logic to check if this glass already exists in master
            const existing = await prisma.glassMaster.findFirst({
                where: {
                    type: item.details.glassType,
                    color: item.details.color,
                    mmRange: item.details.mmRange || '4-6mm', // Default if not provided
                }
            });

            if (!existing) {
                await prisma.glassMaster.create({
                    data: {
                        type: item.details.glassType,
                        color: item.details.color,
                        mmRange: item.details.mmRange || '4-6mm',
                        pricePerSqFt: item.price / (item.details.sqFt || 1), // Calculate unit price if not provided
                    }
                });
            }
        }
    }

    return prisma.order.create({
        data: {
            clientId: data.clientId,
            status: OrderStatus.Pending,
            totalAmount: data.totalAmount,
            items: data.items as Prisma.InputJsonValue[],
        },
    });
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    return prisma.order.update({
        where: { id: orderId },
        data: { status },
    });
};

export const getWorkshopOrders = async () => {
    return prisma.order.findMany({
        where: {
            status: { in: ['Pending', 'UnderProcess'] }
        },
        include: { client: true },
        orderBy: { createdAt: 'asc' }
    });
};

export const updateOrderItemStatus = async (orderId: string, itemIndex: number, completed: boolean) => {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");

    const items = (Array.isArray(order.items) ? order.items : []) as any[];

    if (items[itemIndex]) {
        if (!items[itemIndex].status) items[itemIndex].status = 'Pending';
        items[itemIndex].status = completed ? 'Completed' : 'Pending';
    }

    const allCompleted = items.length > 0 && items.every((i: any) => i.status === 'Completed');
    let status = order.status;

    if (allCompleted) {
        status = 'ReadyToDispatch';
    } else if (order.status === 'Pending') {
        status = 'UnderProcess';
    }

    return prisma.order.update({
        where: { id: orderId },
        data: {
            items: items as Prisma.InputJsonValue[],
            status
        }
    });
};
