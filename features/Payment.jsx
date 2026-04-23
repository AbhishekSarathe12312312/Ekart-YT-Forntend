import React from "react";
import axios from "axios";

const Payment = ({ cart, total, onSuccess }) => {

  const handlePayment = async () => {
    try {
      // 1. Create order
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/orders/createOrder`,
        { items: cart, amount: total },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.razorpayOrder.amount,
        currency: "INR",
        name: "Ekart Store",
        order_id: data.razorpayOrder.id,

        handler: async function (response) {
          const verify = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/orders/verifyPayment`,
            response,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (verify.data.success) {
            onSuccess && onSuccess(); // 🔥 callback to parent
          }
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="px-6 py-3 bg-yellow-400 text-black rounded-full cursor-pointer hover:scale-105 transition font-semibold"
    >
      Checkout
    </button>
  );
};

export default Payment;