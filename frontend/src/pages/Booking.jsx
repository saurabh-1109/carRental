import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Booking.css";

function Booking() {
  const navigate = useNavigate();

  // ==========================================
  // BACKEND API URL
  // ==========================================

  const API_URL = "http://localhost:5000/api/bookings";

  // ==========================================
  // BOOKING STATES
  // ==========================================

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET LOGGED-IN USER FROM LOCAL STORAGE
  // ==========================================

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (error) {
      console.error("User loading error:", error);
      return null;
    }
  });

  // ==========================================
  // CANCEL BOOKING POPUP STATES
  // ==========================================

  const [cancelBooking, setCancelBooking] = useState(null);
  const [cancelled, setCancelled] = useState(false);

  // ==========================================
  // FETCH BOOKINGS FROM MONGODB
  // ==========================================

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();

      console.log("BOOKINGS FROM MONGODB:", data);

      // ==========================================
      // FILTER BOOKINGS FOR LOGGED-IN USER
      // ==========================================

      let userBookings = data;

      if (user) {
        userBookings = data.filter((booking) => {
          // Match using regular user ID
          if (booking.customerId && user.id) {
            return String(booking.customerId) === String(user.id);
          }

          // Match using MongoDB user ID
          if (booking.customerId && user._id) {
            return String(booking.customerId) === String(user._id);
          }

          // Fallback: Match using email address
          if (booking.email && user.email) {
            return (
              booking.email.toLowerCase() === user.email.toLowerCase()
            );
          }

          return false;
        });
      }

      setBookings(userBookings);
    } catch (err) {
      console.error("Fetch bookings error:", err);

      setError(
        "Unable to load bookings. Please make sure the backend server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD BOOKINGS WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchBookings();
  }, []);

  // ==========================================
  // CANCEL BOOKING
  // ==========================================

  const handleCancelBooking = async () => {
    if (!cancelBooking) return;

    const bookingId = cancelBooking._id;

    // Make sure booking ID exists
    if (!bookingId) {
      alert("Booking ID not found.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${bookingId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          bookingStatus: "cancelled",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking");
      }

      console.log("BOOKING CANCELLED:", data);

      // ==========================================
      // UPDATE BOOKING STATUS IN UI
      // ==========================================

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                bookingStatus: "cancelled",
              }
            : booking,
        ),
      );

      // Close confirmation popup
      setCancelBooking(null);

      // Show success popup
      setCancelled(true);
    } catch (err) {
      console.error("Cancel booking error:", err);

      alert("Failed to cancel booking. Please try again.");
    }
  };

  // ==========================================
  // REMOVE CANCELLED BOOKING FROM SCREEN
  // ==========================================

  const removeCancelledBooking = (bookingToRemove) => {
    setBookings((previousBookings) =>
      previousBookings.filter(
        (booking) => booking._id !== bookingToRemove._id,
      ),
    );
  };

  // ==========================================
  // USER NOT LOGGED IN
  // ==========================================

  if (!user && !loading) {
    return (
      <div className="booking-page">
        {/* BACK BUTTON */}
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* LOGIN REQUIRED MESSAGE */}
        <div className="booking-empty-card">
          <h2>Login Required</h2>

          <p>Please login to view your bookings.</p>

          <button
            className="explore-car-btn"
            onClick={() => navigate("/login")}
          >
            🔐 Login
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="booking-page">
        <div className="booking-empty-card">
          <h2>Loading bookings...</h2>

          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error) {
    return (
      <div className="booking-page">
        {/* BACK BUTTON */}
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* ERROR MESSAGE */}
        <div className="booking-empty-card">
          <h2>Unable to load bookings</h2>

          <p>{error}</p>

          <button className="explore-car-btn" onClick={fetchBookings}>
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // NO BOOKINGS FOUND
  // ==========================================

  if (bookings.length === 0) {
    return (
      <div className="booking-page">
        {/* BACK BUTTON */}
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* EMPTY BOOKINGS MESSAGE */}
        <div className="booking-empty-card">
          <h2>No bookings found.</h2>

          <p>You haven't booked a car yet.</p>

          <button
            className="explore-car-btn"
            onClick={() => navigate("/cars")}
          >
            🚗 Explore Cars
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN BOOKINGS PAGE
  // ==========================================

  return (
    <div className="booking-page">

      {/* ======================================
          BACK BUTTON
      ====================================== */}

      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="bookings-container">

        {/* ======================================
            PAGE HEADING
        ====================================== */}

        <h1>My Bookings</h1>

        {/* ======================================
            DISPLAY ALL BOOKINGS
        ====================================== */}

        {bookings.map((booking, index) => {

          // ==================================
          // CUSTOMER DETAILS
          // ==================================

          const customerName =
            booking.customerName || user?.name || "Not available";

          const location =
            booking.location || user?.location || "Not available";

          const email =
            booking.email || user?.email || "Not available";

          const mobile =
            booking.mobile || user?.mobile || "Not available";

          // ==================================
          // CAR DETAILS
          // ==================================

          const carName =
            booking.carName ||
            booking.car?.name ||
            booking.car?.model ||
            "Not available";

          const pricePerDay = Number(
            booking.pricePerDay ||
              booking.price ||
              booking.car?.price ||
              0,
          );

          // ==================================
          // TOTAL BOOKING AMOUNT
          // ==================================

          const totalAmount = Number(booking.totalAmount || 0);

          // ==================================
          // BOOKING & PAYMENT STATUS
          // ==================================

          const bookingStatus =
            booking.bookingStatus || "pending";

          const paymentStatus =
            booking.paymentStatus || "unpaid";

          return (
            <div
              className="booking-card"
              key={booking._id || index}
            >

              {/* ==================================
                  BOOKING HEADER
              ================================== */}

              <div className="booking-header">
                <h2>Booking #{index + 1}</h2>

                <span
                  className={
                    bookingStatus === "confirmed"
                      ? "booking-status confirmed"
                      : bookingStatus === "cancelled"
                        ? "booking-status cancelled"
                        : "booking-status pending"
                  }
                >
                  {bookingStatus === "confirmed"
                    ? "✓ Confirmed"
                    : bookingStatus === "cancelled"
                      ? "✕ Cancelled"
                      : "⏳ Pending"}
                </span>
              </div>

              {/* ==================================
                  CUSTOMER DETAILS
              ================================== */}

              <div className="booking-section">
                <h3>Customer Details</h3>

                <div className="booking-line">
                  <span>Customer Name</span>
                  <strong>{customerName}</strong>
                </div>

                <div className="booking-line">
                  <span>Location</span>
                  <strong>{location}</strong>
                </div>

                <div className="booking-line">
                  <span>Email</span>
                  <strong>{email}</strong>
                </div>

                <div className="booking-line">
                  <span>Mobile</span>
                  <strong>{mobile}</strong>
                </div>
              </div>

              {/* ==================================
                  CAR DETAILS
              ================================== */}

              <div className="booking-section">
                <h3>Car Details</h3>

                <div className="booking-line">
                  <span>Car Name</span>
                  <strong>{carName}</strong>
                </div>

                <div className="booking-line">
                  <span>Price / Day</span>

                  <strong>
                    ₹{pricePerDay.toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              {/* ==================================
                  RENTAL DETAILS
              ================================== */}

              <div className="booking-section">
                <h3>Rental Details</h3>

                <div className="booking-line">
                  <span>Pickup Date</span>

                  <strong>
                    {booking.pickupDate || "Not available"}
                  </strong>
                </div>

                <div className="booking-line">
                  <span>Return Date</span>

                  <strong>
                    {booking.returnDate || "Not available"}
                  </strong>
                </div>

                <div className="booking-line">
                  <span>Days</span>

                  <strong>{booking.days || 0}</strong>
                </div>
              </div>

              {/* ==================================
                  TOTAL AMOUNT
              ================================== */}

              <div className="booking-total">
                <span>Total Amount</span>

                <strong>
                  ₹{totalAmount.toLocaleString("en-IN")}
                </strong>
              </div>

              {/* ==================================
                  PAYMENT STATUS
              ================================== */}

              <div className="booking-payment-status">
                <span>Payment</span>

                <strong
                  className={
                    paymentStatus === "paid"
                      ? "paid-text"
                      : ""
                  }
                >
                  {paymentStatus === "paid"
                    ? "✓ Paid"
                    : "Not Paid"}
                </strong>
              </div>

              {/* ==================================
                  CANCEL BOOKING BUTTON
              ================================== */}

              {bookingStatus !== "cancelled" && (
                <button
                  className="cancel-booking-btn"
                  onClick={() => setCancelBooking(booking)}
                >
                  ✕ Cancel Booking
                </button>
              )}

              {/* ==================================
                  CANCELLED BOOKING MESSAGE
              ================================== */}

              {bookingStatus === "cancelled" && (
                <div className="already-cancelled">

                  <button
                    className="close-cancelled-btn"
                    onClick={() =>
                      removeCancelledBooking(booking)
                    }
                  >
                    ×
                  </button>

                  <strong>Booking Cancelled</strong>

                  <p>
                    Refund will be initiated on your bank A/C
                    in 3 working days.
                  </p>

                </div>
              )}

            </div>
          );
        })}

        {/* ======================================
            EXPLORE CARS BUTTON
        ====================================== */}

        <button
          className="explore-car-btn"
          onClick={() => navigate("/cars")}
        >
          🚗 Explore Cars
        </button>

      </div>

      {/* ======================================
          CANCEL CONFIRMATION POPUP
      ====================================== */}

      {cancelBooking && (
        <div className="cancel-overlay">

          <div className="cancel-popup">

            <div className="cancel-icon">
              ⚠
            </div>

            <h2>Cancel Booking?</h2>

            <p>
              Are you sure you want to cancel your booking for
            </p>

            <strong className="cancel-car-name">
              {cancelBooking.carName ||
                cancelBooking.car?.name ||
                cancelBooking.car?.model ||
                "this car"}
            </strong>

            <p className="refund-note">
              Refund will be initiated on your bank A/C
              in 3 working days.
            </p>

            <p className="thank-you">
              Thank You
            </p>

            {/* POPUP ACTION BUTTONS */}
            <div className="cancel-actions">

              <button
                className="keep-booking-btn"
                onClick={() => setCancelBooking(null)}
              >
                Keep Booking
              </button>

              <button
                className="confirm-cancel-btn"
                onClick={handleCancelBooking}
              >
                Cancel Booking
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ======================================
          BOOKING CANCELLED SUCCESS POPUP
      ====================================== */}

      {cancelled && (
        <div className="cancel-overlay">

          <div className="cancel-popup success-popup">

            <div className="success-cancel-icon">
              ✓
            </div>

            <h2>Booking Cancelled</h2>

            <p>
              Your booking has been successfully cancelled.
            </p>

            <p className="refund-note">
              Refund will be initiated on your bank A/C
              in 3 working days.
            </p>

            <p className="thank-you">
              Thank You
            </p>

            <button
              className="explore-car-btn"
              onClick={() => {
                setCancelled(false);
                navigate("/cars");
              }}
            >
              🚗 Explore Cars
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default Booking;

