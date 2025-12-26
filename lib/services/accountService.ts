import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

export const getReadyOrders = async () => {
    return prisma.order.findMany({
        where: {
            status: "ReadyToDispatch",
        },
        include: {
            client: true,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
};

export const updatePaymentStatus = async (orderId: string, status: PaymentStatus, paidAmount?: number) => {
    const data: any = { paymentStatus: status };
    if (paidAmount !== undefined) {
        data.paidAmount = paidAmount;
    }

    // Auto-set paidAmount for Paid/Unpaid if not specified
    if (status === 'Paid' && paidAmount === undefined) {
        // We need to fetch totalAmount first to set full payment
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (order) data.paidAmount = order.totalAmount;
    } else if (status === 'Unpaid') {
        data.paidAmount = 0;
    }

    return prisma.order.update({
        where: { id: orderId },
        data,
    });
};
