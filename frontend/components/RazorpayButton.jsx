"use client";

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY;

// Dynamically load the Razorpay checkout script
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Convert "₹399" → 39900  (Razorpay uses paise)
function toPaise(priceStr) {
  const num = parseInt(priceStr.replace(/[^\d]/g, ""), 10);
  return num * 100;
}

export default function RazorpayButton({ courseName, price, priceNote }) {
  async function handleEnroll() {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Failed to load Razorpay. Check your internet connection.");
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: toPaise(price),          // in paise
      currency: "INR",
      name: "fitness.com",
      description: `${courseName} — ${priceNote}`,
      image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=80&h=80&fit=crop&q=80",
      handler: function (response) {
        // In production: send response.razorpay_payment_id to your backend to verify
        alert(
          `Payment successful!\nPayment ID: ${response.razorpay_payment_id}\n\nWelcome to ${courseName}!`
        );
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      notes: {
        course: courseName,
      },
      theme: {
        color: "#FF4D6D",   // matches the site's coral accent
      },
      modal: {
        ondismiss: () => {
          // user closed without paying — no action needed
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      alert(`Payment failed: ${response.error.description}`);
    });
    rzp.open();
  }

  return (
    <button
      onClick={handleEnroll}
      className="w-full bg-coral text-charcoal text-sm font-bold py-3 rounded-xl hover:bg-coral2 active:scale-95 transition duration-200 shadow-lg shadow-coral/20"
    >
      Enroll Now — {price}
    </button>
  );
}
