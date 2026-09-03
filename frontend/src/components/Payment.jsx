import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Payment.css";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking;

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // NO BOOKING DATA
  // ==========================================

  if (!booking) {
    return (
      <div className="payment-page">
        <div className="payment-card">
          <h2>No Payment Details Found</h2>

          <p>
            Please select a car and complete the booking form first.
          </p>

          <button onClick={() => navigate("/cars")}>
            ← Back to Cars
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // HANDLE PAYMENT
  // ==========================================

  const handlePayment = async (e) => {
    e.preventDefault();

    // ==========================================
    // GET LOGGED-IN USER
    // ==========================================

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Your login session has expired. Please login again.");

      navigate("/login");

      return;
    }

    setLoading(true);

    try {
      // ==========================================
      // CARD NUMBER VALIDATION
      // ==========================================

      const cleanCardNumber = cardNumber.replace(/\s/g, "");

      if (!/^\d{16}$/.test(cleanCardNumber)) {
        alert("Card number must be exactly 16 digits.");

        setLoading(false);

        return;
      }

      // ==========================================
      // CARD HOLDER VALIDATION
      // ==========================================

      if (cardName.trim().length < 2) {
        alert("Please enter a valid card holder name.");

        setLoading(false);

        return;
      }

      // ==========================================
      // EXPIRY VALIDATION
      // ==========================================

      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        alert("Please enter expiry in MM/YY format.");

        setLoading(false);

        return;
      }

      // ==========================================
      // CVV VALIDATION
      // ==========================================

      if (!/^\d{3}$/.test(cvv)) {
        alert("CVV must be exactly 3 digits.");

        setLoading(false);

        return;
      }

      // ==========================================
      // CHECK EXPIRY DATE
      // ==========================================

      const [month, year] = expiry.split("/");

      const currentDate = new Date();

      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;

      const expiryMonth = Number(month);
      const expiryYear = Number(year);

      if (
        expiryYear < currentYear ||
        (expiryYear === currentYear &&
          expiryMonth < currentMonth)
      ) {
        alert("Card expiry date has passed.");

        setLoading(false);

        return;
      }

      // ==========================================
      // PREPARE BOOKING DATA
      // ==========================================

      const bookingData = {
        // ========================================
        // CUSTOMER
        // ========================================

        customerId:
          booking.customerId ||
          user.id ||
          user._id ||
          null,

        customerName:
          booking.customerName ||
          user.name ||
          "",

        email:
          booking.email ||
          user.email ||
          "",

        location:
          booking.location ||
          user.location ||
          "",

        mobile:
          booking.mobile ||
          "",

        // ========================================
        // CAR
        // ========================================

        carId: String(booking.carId || ""),

        carName:
          booking.carName ||
          "",

        carImage:
          booking.carImage ||
          "",

        pricePerDay:
          Number(booking.pricePerDay || 0),

        // ========================================
        // RENTAL
        // ========================================

        pickupDate:
          booking.pickupDate ||
          "",

        returnDate:
          booking.returnDate ||
          "",

        days:
          Number(booking.days || 0),

        // ========================================
        // PAYMENT
        // ========================================

        totalAmount:
          Number(booking.totalAmount || 0),

        paymentStatus: "paid",

        // ========================================
        // BOOKING STATUS
        // ========================================

        bookingStatus: "pending",
      };

      console.log(
        "========== SAVING BOOKING =========="
      );

      console.log("Booking Data:", bookingData);

      // ==========================================
      // SAVE BOOKING TO MONGODB
      // ==========================================

      const response = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(bookingData),
        }
      );

      const data = await response.json();

      // ==========================================
      // CHECK BACKEND RESPONSE
      // ==========================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create booking"
        );
      }

      console.log(
        "BOOKING SAVED TO MONGODB:",
        data
      );

      // ==========================================
      // PAYMENT SUCCESS
      // ==========================================

      setConfirmed(true);

    } catch (error) {
      console.error(
        "Payment / Booking Error:",
        error
      );

      alert(
        "Payment could not be completed. Please make sure the backend server is running and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DISPLAY AMOUNT
  // ==========================================

  const amount = Number(
    booking.totalAmount || 0
  );

  // ==========================================
  // JSX
  // ==========================================

  return (
    <div className="payment-page">

      {/* =====================================
          BACK BUTTON
      ====================================== */}

      <button
        className="payment-back-btn"
        onClick={() => navigate("/cars")}
      >
        ← Back to Cars
      </button>

      <div className="payment-card">

        <h1>Payment</h1>

        <p className="payment-subtitle">
          Complete payment to create your booking
        </p>

        {/* =====================================
            AMOUNT
        ====================================== */}

        <div className="payment-amount">

          <span>Amount to Pay</span>

          <strong>
            ₹{amount.toLocaleString("en-IN")}
          </strong>

        </div>

        {/* =====================================
            BOOKING SUMMARY
        ====================================== */}

        <div className="payment-summary">

          <h3>Booking Summary</h3>

          <p>
            <span>Car</span>

            <strong>
              {booking.carName}
            </strong>
          </p>

          <p>
            <span>Pickup</span>

            <strong>
              {booking.pickupDate}
            </strong>
          </p>

          <p>
            <span>Return</span>

            <strong>
              {booking.returnDate}
            </strong>
          </p>

          <p>
            <span>Days</span>

            <strong>
              {booking.days}
            </strong>
          </p>

        </div>

        {/* =====================================
            CARD FORM
        ====================================== */}

        <form
          className="card-form"
          onSubmit={handlePayment}
        >

          <h3>Card Details</h3>

          {/* CARD HOLDER */}

          <div className="form-group">

            <label>
              Card Holder Name
            </label>

            <input
              type="text"
              placeholder="Enter card holder name"
              value={cardName}
              onChange={(e) =>
                setCardName(e.target.value)
              }
              required
            />

          </div>

          {/* CARD NUMBER */}

          <div className="form-group">

            <label>
              Card Number
            </label>

            <input
              type="text"
              inputMode="numeric"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              value={cardNumber}
              onChange={(e) => {

                const numbers =
                  e.target.value.replace(
                    /\D/g,
                    ""
                  );

                const limited =
                  numbers.slice(0, 16);

                const formatted =
                  limited
                    .replace(
                      /(.{4})/g,
                      "$1 "
                    )
                    .trim();

                setCardNumber(formatted);
              }}
              required
            />

          </div>

          {/* EXPIRY + CVV */}

          <div className="card-row">

            <div className="form-group">

              <label>
                Expiry
              </label>

              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/YY"
                maxLength={5}
                value={expiry}
                onChange={(e) => {

                  const numbers =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  const limited =
                    numbers.slice(0, 4);

                  let formatted =
                    limited;

                  if (
                    limited.length > 2
                  ) {
                    formatted =
                      limited.slice(0, 2) +
                      "/" +
                      limited.slice(2);
                  }

                  setExpiry(formatted);
                }}
                required
              />

            </div>

            <div className="form-group">

              <label>
                CVV
              </label>

              <input
                type="password"
                inputMode="numeric"
                placeholder="***"
                maxLength={3}
                value={cvv}
                onChange={(e) => {

                  const value =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setCvv(
                    value.slice(0, 3)
                  );
                }}
                required
              />

            </div>

          </div>

          {/* =====================================
              PAY BUTTON
          ====================================== */}

          <button
            type="submit"
            className="confirm-btn"
            disabled={loading}
          >

            {loading
              ? "Processing..."
              : `Pay ₹${amount.toLocaleString(
                  "en-IN"
                )}`}

          </button>

        </form>

      </div>

      {/* =====================================
          SUCCESS POPUP
      ====================================== */}

      {confirmed && (

        <div className="confirmation-overlay">

          <div className="confirmation-card">

            <div className="success-icon">
              ✓
            </div>

            <h2>
              Payment Successful!
            </h2>

            <p>
              Your payment for{" "}
              <strong>
                {booking.carName}
              </strong>{" "}
              was successful.
            </p>

            <p>
              Amount Paid:{" "}
              <strong>
                ₹{amount.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </p>

            <div className="pending-message">
              ⏳ Your booking is waiting for
              admin approval.
            </div>

            <button
              onClick={() =>
                navigate("/booking")
              }
              className="done-btn"
            >
              View My Booking
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Payment;

