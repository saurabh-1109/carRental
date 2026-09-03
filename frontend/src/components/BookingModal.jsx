import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BookingModal.css";

function BookingModal({ car, onClose }) {
  const navigate = useNavigate();

  // ==========================================
  // GET TODAY'S DATE
  // ==========================================

  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = getToday();

  // ==========================================
  // STATES
  // ==========================================

  const [pickupDate, setPickupDate] = useState(today);

  const [returnDate, setReturnDate] = useState("");

  const [mobile, setMobile] = useState("");

  // ==========================================
  // HANDLE BOOKING
  // ==========================================
const handleBooking = async (e) => {
  e.preventDefault();

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const user = JSON.parse(localStorage.getItem("user"));

  // ==========================================
  // CHECK LOGIN
  // ==========================================

  if (!user) {
    alert("Please login or create an account before booking.");

    navigate("/login");

    return;
  }

  // ==========================================
  // MOBILE VALIDATION
  // ==========================================

  if (!/^\d{10}$/.test(mobile)) {
    alert("Please enter a valid 10 digit mobile number.");

    return;
  }

  // ==========================================
  // RETURN DATE VALIDATION
  // ==========================================

  if (!returnDate) {
    alert("Please select a return date.");

    return;
  }

  // ==========================================
  // CALCULATE RENTAL DAYS
  // ==========================================

  const start = new Date(`${pickupDate}T00:00:00`);
  const end = new Date(`${returnDate}T00:00:00`);

  const difference = end - start;

  const days = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

  if (days <= 0) {
    alert("Return date must be after pickup date.");

    return;
  }

  // ==========================================
  // CAR DETAILS
  // ==========================================

  const carId = car._id || car.id;

  const carName = car.name || car.model || "Car";

  const carImage = car.image || "";

  const pricePerDay = Number(car.price || 0);

  // ==========================================
  // CHECK MONGODB BOOKINGS
  // ==========================================

  try {
    const response = await fetch(
      "http://localhost:5000/api/bookings"
    );

    if (!response.ok) {
      throw new Error("Failed to check bookings");
    }

    const existingBookings = await response.json();

    // ==========================================
    // FIND CONFLICT
    // ==========================================

    const conflictingBooking = existingBookings.find(
      (existingBooking) => {

        // Different car
        if (
          String(existingBooking.carId) !==
          String(carId)
        ) {
          return false;
        }

        // Cancelled booking doesn't block dates
        if (
          existingBooking.bookingStatus ===
          "cancelled"
        ) {
          return false;
        }

        // Existing booking dates
        const existingPickup = new Date(
          `${existingBooking.pickupDate}T00:00:00`
        );

        const existingReturn = new Date(
          `${existingBooking.returnDate}T00:00:00`
        );

        // New booking dates
        const newPickup = new Date(
          `${pickupDate}T00:00:00`
        );

        const newReturn = new Date(
          `${returnDate}T00:00:00`
        );

        // ======================================
        // DATE OVERLAP CHECK
        // ======================================

        return (
          newPickup < existingReturn &&
          newReturn > existingPickup
        );
      }
    );

    // ==========================================
    // BOOKING CONFLICT
    // ==========================================

    if (conflictingBooking) {

      alert(
        `This car is already booked from ${
          conflictingBooking.pickupDate
        } to ${
          conflictingBooking.returnDate
        }. Please select different dates or another car.`
      );

      return;
    }

    // ==========================================
    // TOTAL AMOUNT
    // ==========================================

    const totalAmount =
      pricePerDay * days;

    // ==========================================
    // CREATE BOOKING OBJECT
    // ==========================================

    const booking = {

      // CUSTOMER
      customerId:
        user.id ||
        user._id ||
        null,

      customerName:
        user.name ||
        "",

      email:
        user.email ||
        "",

      location:
        user.location ||
        "",

      // CAR
      carId: carId,

      carName: carName,

      carImage: carImage,

      pricePerDay: pricePerDay,

      // RENTAL
      pickupDate: pickupDate,

      returnDate: returnDate,

      mobile: mobile,

      days: days,

      // PAYMENT
      totalAmount: totalAmount,

      paymentStatus: "unpaid",

      // BOOKING
      bookingStatus: "pending",
    };

    // ==========================================
    // DEBUG
    // ==========================================

    console.log(
      "========== BOOKING READY FOR PAYMENT =========="
    );

    console.log("Booking:", booking);

    // ==========================================
    // GO TO PAYMENT
    // ==========================================

    navigate("/payment", {
      state: {
        booking: booking,
      },
    });

  } catch (error) {

    console.error(
      "Booking availability check error:",
      error
    );

    alert(
      "Unable to check car availability. Please make sure the backend server is running."
    );
  }
};
  // ==========================================
  // CAR DISPLAY VALUES
  // ==========================================

  const displayCarName = car.name || car.model || "Car";

  const displayPrice = Number(car.price || 0);

  // ==========================================
  // JSX
  // ==========================================

  return (
    <div className="modal-overlay">
      <div className="booking-modal">
        {/* =====================================
            CLOSE BUTTON
        ====================================== */}

        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        {/* =====================================
            TITLE
        ====================================== */}

        <h2>Book {displayCarName}</h2>

        <form onSubmit={handleBooking}>
          {/* ===================================
              CAR NAME
          ==================================== */}

          <div className="modal-group">
            <label>Car Name</label>

            <input type="text" value={displayCarName} readOnly />
          </div>

          {/* ===================================
              PRICE
          ==================================== */}

          <div className="modal-group">
            <label>Price / Day</label>

            <input
              type="text"
              value={`₹${displayPrice.toLocaleString("en-IN")}`}
              readOnly
            />
          </div>

          {/* ===================================
              PICKUP DATE
          ==================================== */}

          <div className="modal-group">
            <label>Pickup Date</label>

            <input
              type="date"
              value={pickupDate}
              min={today}
              onChange={(e) => {
                const newPickupDate = e.target.value;

                setPickupDate(newPickupDate);

                // Reset invalid return date
                if (returnDate && newPickupDate >= returnDate) {
                  setReturnDate("");
                }
              }}
              required
            />
          </div>

          {/* ===================================
              RETURN DATE
          ==================================== */}

          <div className="modal-group">
            <label>Return Date</label>

            <input
              type="date"
              value={returnDate}
              min={pickupDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
            />
          </div>

          {/* ===================================
              MOBILE
          ==================================== */}

          <div className="modal-group">
            <label>Mobile Number</label>

            <input
              type="tel"
              value={mobile}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                if (value.length <= 10) {
                  setMobile(value);
                }
              }}
              placeholder="Enter 10 digit mobile number"
              maxLength={10}
              pattern="[0-9]{10}"
              required
            />

            {mobile.length > 0 && mobile.length !== 10 && (
              <small
                style={{
                  color: "red",
                }}
              >
                Mobile number must be exactly 10 digits
              </small>
            )}
          </div>

          {/* ===================================
              PAYMENT BUTTON
          ==================================== */}

          <button type="submit" className="payment-btn">
            Proceed to Payment →
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;
