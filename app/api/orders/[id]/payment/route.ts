import { NextResponse } from "next/server";
import { updatePaymentStatus } from "@/lib/services/accountService";
import { PaymentStatus } from "@prisma/client";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const { status, paidAmount } = await req.json();
        const order = await updatePaymentStatus(params.id, status as PaymentStatus, paidAmount);
        return NextResponse.json(order);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
