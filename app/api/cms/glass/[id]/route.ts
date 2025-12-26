import { NextResponse } from "next/server";
import { updateGlassMaster, deleteGlassMaster } from "@/lib/services/cmsService";

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const body = await req.json();
        const updated = await updateGlassMaster(params.id, body);
        return NextResponse.json(updated);
    } catch (e) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await deleteGlassMaster(params.id);
        return new NextResponse(null, { status: 204 });
    } catch (e) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
