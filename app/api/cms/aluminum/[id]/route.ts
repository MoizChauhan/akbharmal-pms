import { NextResponse } from "next/server";
import { updateAluminumMaster, deleteAluminumMaster } from "@/lib/services/cmsService";

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const body = await req.json();
        const updated = await updateAluminumMaster(params.id, body);
        return NextResponse.json(updated);
    } catch (e) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await deleteAluminumMaster(params.id);
        return new NextResponse(null, { status: 204 });
    } catch (e) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
