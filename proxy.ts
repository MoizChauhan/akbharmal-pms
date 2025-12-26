import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    // Assuming all routes under /[module] are protected
    const isModuleRoute = [
        "/dashboard",
        "/clients",
        "/orders",
        "/workshop",
        "/cms",
        "/uam",
        "/accounts",
    ].some((route) => nextUrl.pathname.startsWith(route));

    if (isModuleRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    if (isLoggedIn && isModuleRoute) {
        const activeModules = (req.auth?.user as any).activeModules || [];
        const requestedModule = nextUrl.pathname.split("/")[1];

        // Convert to title case for matching (e.g. "dashboard" -> "Dashboard")
        const moduleName = requestedModule.charAt(0).toUpperCase() + requestedModule.slice(1);

        if (!activeModules.includes(moduleName) && moduleName !== "Dashboard") {
            // If module is not active for user, redirect to Dashboard
            // return NextResponse.redirect(new URL("/dashboard", nextUrl));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
