import { NextResponse } from "next/server";
import { createClient } from "@/lib/services/clientService";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // Validate body if needed, currently assumes valid
        const client = await createClient(body);
        return NextResponse.json(client);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
