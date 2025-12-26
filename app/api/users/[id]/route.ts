import { NextResponse } from "next/server";
import { updateUser } from "@/lib/services/userService";

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const body = await req.json();
        const user = await updateUser(params.id, body);
        return NextResponse.json(user);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
