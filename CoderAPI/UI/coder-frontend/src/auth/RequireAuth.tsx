
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useUserOnboardDoneQuery } from "./authApi";

export default function RequireAuth() {
    const token = useSelector((state: any) => state.auth.token);
    const location = useLocation();

    // Always call the hook (no conditional!)
    const { data, isLoading, isError } = useUserOnboardDoneQuery(undefined, {
        skip: !token, // prevents API call, avoids error
    });

    // No token → go to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // API loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-slate-500">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400 mx-auto"></div>
                    <p>Checking onboarding status...</p>
                </div>
            </div>
        );
    }

    // API failed → allow access (fallback behavior, prevents infinite redirect loop)
    if (isError) {
        console.warn("Onboarding check failed, allowing access with fallback");
        return <Outlet />;
    }

    // If user onboarding is not done → redirect to onboarding (unless already there)
    if (data?.status === false && location.pathname !== "/onboarding") {
        return <Navigate to="/onboarding" replace />;
    }

    // Everything is fine → allow route
    return <Outlet />;
}
