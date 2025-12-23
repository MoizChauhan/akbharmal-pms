import { NextResponse } from "next/server";
import { updateUserModules } from "@/lib/services/userService";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const { modules } = await req.json();
        const user = await updateUserModules(params.id, modules);
        return NextResponse.json(user);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
