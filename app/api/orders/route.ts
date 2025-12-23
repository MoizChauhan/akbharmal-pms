import { NextResponse } from "next/server";
import { createOrder } from "@/lib/services/orderService";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const order = await createOrder(body);
        return NextResponse.json(order);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
