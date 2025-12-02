import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useUserOnboardDoneQuery } from "./authApi";

export default function RequireAuth() {
    const token = useSelector((state: any) => state.auth.token);

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
                Checking onboarding...
            </div>
        );
    }

    // API failed → treat as not onboarded
    if (isError) {
        return <Navigate to="/onboarding" replace />;
    }

    // If user onboarding is not done
    if (data?.status === false) {
        return <Navigate to="/onboarding" replace />;
    }

    // Everything is fine → allow route
    return <Outlet />;
}
