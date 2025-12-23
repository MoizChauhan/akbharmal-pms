import { prisma } from "@/lib/prisma";

export const getDashboardStats = async () => {
    const [statusCounts, revenueResult, totalOrders] = await Promise.all([
        prisma.order.groupBy({
            by: ["status"],
            _count: {
                id: true,
            },
        }),
        prisma.order.aggregate({
            _sum: {
                totalAmount: true,
            },
        }),
        prisma.order.count(),
    ]);

    // Mock trend data for charts as we don't have historical seeding
    const revenueTrend = [
        { name: "Jan", total: 1200 },
        { name: "Feb", total: 2100 },
        { name: "Mar", total: 800 },
        { name: "Apr", total: 1600 },
        { name: "May", total: 900 },
        { name: "Jun", total: 1700 },
    ];

    return {
        statusCounts,
        totalRevenue: revenueResult._sum.totalAmount || 0,
        totalOrders,
        revenueTrend
    };
};
