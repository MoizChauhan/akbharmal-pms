import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus, ItemStatus, Prisma } from "@prisma/client";

export const getOrders = async () => {
    return prisma.order.findMany({
        include: {
            client: true,
            items: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getOrderById = async (id: string) => {
    return prisma.order.findUnique({
        where: { id },
        include: {
            client: true,
            items: true,
        },
    });
};

export const createOrder = async (data: {
    clientId: string;
    totalAmount: number;
    items: any[];
}) => {
    // 1. Create Order
    const order = await prisma.order.create({
        data: {
            clientId: data.clientId,
            status: OrderStatus.Pending,
            totalAmount: data.totalAmount,
            paymentStatus: PaymentStatus.Unpaid,
        },
    });

    // 2. Create Order Items
    const orderItems = data.items.map((item) => ({
        orderId: order.id,
        type: item.type,
        status: ItemStatus.Pending,
        width: item.details?.width || null,
        height: item.details?.height || null,
        price: item.price,
        rate: item.details?.aluminumRate || null, // Capture overridden rate
        description: item.details?.description || null,
        specification: item.type === 'glass'
            ? `${item.details?.glassType} - ${item.details?.color} (${item.details?.mmRange})`
            : item.type === 'aluminum' ? item.details?.buildType : 'Labor',
        metadata: item.details || {}, // Store full raw details for technical specs
    }));

    await prisma.orderItem.createMany({
        data: orderItems,
    });

    return getOrderById(order.id);
};

export const updateOrder = async (id: string, data: {
    clientId?: string;
    totalAmount?: number;
    items?: any[];
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
}) => {
    // 1. Transactional Update
    return prisma.$transaction(async (tx) => {
        // Update basic order details
        const updatedOrder = await tx.order.update({
            where: { id },
            data: {
                clientId: data.clientId,
                totalAmount: data.totalAmount,
                status: data.status,
                paymentStatus: data.paymentStatus,
            },
        });

        // 2. Access control on items - Replace All strategy for editing
        if (data.items) {
            // Delete existing items
            await tx.orderItem.deleteMany({
                where: { orderId: id }
            });

            // Create new items
            const newItems = data.items.map((item) => ({
                orderId: id,
                type: item.type,
                status: (item.status === 'Completed' ? ItemStatus.Completed : ItemStatus.Pending),
                width: item.details?.width || null,
                height: item.details?.height || null,
                price: item.price,
                rate: item.details?.aluminumRate || null,
                description: item.details?.description || null,
                specification: item.type === 'glass'
                    ? `${item.details?.glassType} - ${item.details?.color} (${item.details?.mmRange})`
                    : item.type === 'aluminum' ? item.details?.buildType : 'Labor',
                metadata: item.details || {},
            }));

            await tx.orderItem.createMany({
                data: newItems
            });
        }

        return updatedOrder;
    });
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    return prisma.order.update({
        where: { id: orderId },
        data: { status },
    });
};

export const updateOrderPaymentStatus = async (orderId: string, paymentStatus: PaymentStatus) => {
    return prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus },
    });
};

export const getWorkshopOrders = async () => {
    return prisma.order.findMany({
        where: {
            status: { in: ['Pending', 'UnderProcess'] }
        },
        include: {
            client: true,
            items: true
        },
        orderBy: { createdAt: 'asc' }
    });
};

export const updateOrderItemStatus = async (orderId: string, itemId: string, completed: boolean) => {
    // 1. Update specific item
    await prisma.orderItem.update({
        where: { id: itemId },
        data: {
            status: completed ? ItemStatus.Completed : ItemStatus.Pending
        }
    });

    // 2. Check all items for this order to update Order Status
    const orderItems = await prisma.orderItem.findMany({
        where: { orderId }
    });

    const allCompleted = orderItems.every(i => i.status === 'Completed');
    const anyStarted = orderItems.some(i => i.status === 'Completed');

    let newStatus: OrderStatus | undefined;

    // Fetch current order status to see if transition is needed
    const currentOrder = await prisma.order.findUnique({ where: { id: orderId } });

    if (allCompleted) {
        newStatus = 'ReadyToDispatch';
    } else if (anyStarted && currentOrder?.status === 'Pending') {
        newStatus = 'UnderProcess';
    } else if (!anyStarted && currentOrder?.status !== 'Pending') {
        // If unchecking the last item, maybe go back to pending? Optional logic.
    }

    if (newStatus && newStatus !== currentOrder?.status) {
        await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus }
        });
    }

    return getOrderById(orderId);
};
