import { NextResponse } from "next/server";
import { updateOrder, getOrderById } from "@/lib/services/orderService";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const order = await getOrderById(params.id);
        if (!order) return new NextResponse("Not Found", { status: 404 });
        return NextResponse.json(order);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const body = await req.json();
        const order = await updateOrder(params.id, body);
        return NextResponse.json(order);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
