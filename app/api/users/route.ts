import { NextResponse } from "next/server";
import { createUser } from "@/lib/services/userService";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const user = await createUser(body);
        return NextResponse.json(user);
    } catch (e) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
