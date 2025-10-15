import {
    useCreateCourseOrderMutation,
    useVerifyCoursePaymentMutation,
    useCreateBundleOrderMutation,
    useVerifyBundlePaymentMutation
} from '../Courses/courseApi';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export const handleRazorpayCoursePayment = async (
    courseId: number,
    createCourseOrder: ReturnType<typeof useCreateCourseOrderMutation>[0],
    verifyCoursePayment: ReturnType<typeof useVerifyCoursePaymentMutation>[0]
) => {
    try {
        const { data } = await createCourseOrder(courseId);
        if (!data) throw new Error("Failed to create order");

        const options = {
            key: data.key,
            amount: data.price * 100,
            currency: data.currency,
            name: "Godson एकं",
            description: "Course Purchase",
            order_id: data.razorPayOrderId,
            handler: async function (response: any) {
                await verifyCoursePayment({
                    paymentId: response.razorpay_payment_id,
                    rayzorpayOrderId: response.razorpay_order_id,
                    userPlanId: data.userPlanId,
                    userCourseId: data.userCourseId,
                    signature: response.razorpay_signature
                });
                window.location.href = "/my-courses";
            },
            prefill: {
                name: "Vibhu Godson",
                email: "example@gmail.com",
                contact: "9999999999"
            },
            theme: { color: "#4f46e5" }
        };

        new window.Razorpay(options).open();
    } catch (err) {
        console.error(err);
        alert("Payment failed. Try again!");
    }
};

export const handleRazorpayBundlePayment = async (
    bundleId: number,
    createBundleOrder: ReturnType<typeof useCreateBundleOrderMutation>[0],
    verifyBundlePayment: ReturnType<typeof useVerifyBundlePaymentMutation>[0]
) => {
    try {
        const { data } = await createBundleOrder(bundleId);
        if (!data) throw new Error("Failed to create order");

        const options = {
            key: data.key,
            amount: data.price * 100,
            currency: data.currency,
            name: "Godson एकं",
            description: "Bundle Purchase",
            order_id: data.razorPayOrderId,
            handler: async function (response: any) {
                await verifyBundlePayment({
                    paymentId: response.razorpay_payment_id,
                    rayzorpayOrderId: response.razorpay_order_id,
                    userPlanId: data.userPlanId,
                    userCourseId: data.userCourseId,
                    userBundleId: bundleId,
                    signature: response.razorpay_signature
                });
                window.location.href = "/my-courses";
            },
            prefill: {
                name: "Vibhu Godson",
                email: "example@gmail.com",
                contact: "9999999999"
            },
            theme: { color: "#4f46e5" }
        };

        new window.Razorpay(options).open();
    } catch (err) {
        console.error(err);
        alert("Payment failed. Try again!");
    }
};
