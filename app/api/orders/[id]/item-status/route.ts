import { NextResponse } from "next/server";
import { updateOrderItemStatus } from "@/lib/services/orderService";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        // itemId is now passed instead of index
        const { itemId, completed } = await req.json();
        const result = await updateOrderItemStatus(params.id, itemId, completed);
        return NextResponse.json(result);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
