import React, { useState } from "react";
import {
    useGetPlansQuery,
    useCreateOrderMutation,
    useVerifyPaymentMutation,
} from "../planApi";
import { Toast } from "../../auth/component/Toast";
import { useDispatch } from "react-redux";
import { logout } from "../../auth/authSlice";
import { useNavigate } from "react-router-dom";

declare global {
    interface Window {
        Razorpay: any;
    }
}

const PlansPage: React.FC = () => {
    const { data, isLoading } = useGetPlansQuery();
    const [createOrder] = useCreateOrderMutation();
    const [verifyPayment] = useVerifyPaymentMutation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [toast, setToast] = useState({
        open: false,
        msg: "",
        kind: "success" as "success" | "error",
    });

    const plans = data?.items ?? [];

    const showToast = (msg: string, kind: "success" | "error") => {
        setToast({ open: true, msg, kind });
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login", { replace: true });
    };

    const handlePurchase = async (planId: number) => {
        try {
            const orderRes = await createOrder(planId).unwrap();

            const options = {
                key: orderRes.key,
                amount: orderRes.price * 100,
                currency: orderRes.currency,
                name: "Godson Ekam",
                description: "One-time Plan Purchase",
                order_id: orderRes.razorPayOrderId,
                handler: async (response: any) => {
                    try {
                        const verifyRes = await verifyPayment({
                            paymentId: response.razorpay_payment_id,
                            rayzorpayOrderId: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            userPlanId: orderRes.userPlanId,
                        }).unwrap();

                        if (verifyRes.status) {
                            showToast("Payment successful! Please login again.", "success");

                            setTimeout(() => {
                                handleLogout();
                            }, 1200);
                        } else {
                            showToast("Payment verification failed.", "error");
                        }
                    } catch (err) {
                        console.error("Verification failed:", err);
                        showToast("Error verifying payment.", "error");
                    }
                },
                theme: { color: "#2563eb" },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            console.error("Payment initiation failed:", err);
            showToast("Something went wrong while initiating payment.", "error");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg text-gray-500 animate-pulse">Loading plans...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-6">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
                Choose Your Plan
            </h1>

            <div className="flex flex-wrap justify-center gap-10 max-w-6xl mx-auto">
                {plans.map((plan) => {
                    const isFree = plan.price === 0;
                    const isCurrent = plan.isCurrentPlan;

                    return (
                        <div
                            key={plan.planId}
                            className={`relative p-8 rounded-2xl w-80 shadow-xl border transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl 
                                ${isCurrent
                                    ? "bg-white ring-2 ring-blue-500 ring-offset-2 ring-offset-blue-100"
                                    : "bg-white/90 border-gray-200"
                                }`}
                        >
                            {plan.isPopular && (
                                <span className="absolute top-3 right-3 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-full uppercase">
                                    Most Popular
                                </span>
                            )}

                            {isCurrent && (
                                <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                    🌟 Your Active Plan
                                </span>
                            )}

                            <h2 className="text-2xl font-bold mb-4 text-gray-800">{plan.name}</h2>

                            <p className="text-gray-700 mb-6 min-h-[60px]">{plan.description}</p>

                            <div className="text-5xl font-extrabold text-blue-600 mb-6">
                                {isFree ? (
                                    <span className="text-green-600 text-4xl">Free</span>
                                ) : (
                                    <>
                                        ₹{plan.price}
                                        <span className="text-lg text-gray-500 font-normal ml-1">
                                            / one-time
                                        </span>
                                    </>
                                )}
                            </div>

                            <ul className="text-left space-y-2 mb-8">
                                {plan.features.map((f: any, idx: number) => (
                                    <li
                                        key={idx}
                                        className={`flex items-center gap-2 text-gray-700 ${!f.included && "opacity-60"
                                            }`}
                                    >
                                        <span>{f.included ? "✅" : "❌"}</span>
                                        <span>{f.feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                disabled={isFree || isCurrent}
                                onClick={() => handlePurchase(plan.planId)}
                                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200
                                    ${isFree
                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                        : isCurrent
                                            ? "bg-blue-50 text-blue-700 border border-blue-600 cursor-default"
                                            : "bg-blue-600 hover:bg-blue-700 text-white"
                                    }`}
                            >
                                {isFree
                                    ? "Free Plan"
                                    : isCurrent
                                        ? "Your Current Plan"
                                        : "Upgrade Plan"}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Toast */}
            <Toast
                open={toast.open}
                title={toast.msg}
                kind={toast.kind}
                onClose={() => setToast((t) => ({ ...t, open: false }))}
            />
        </div>
    );
};

export default PlansPage;
