// ==========================================
// IMPORTS
// ==========================================

import "../styles/CarCard.css";
import { useState } from "react";
import BookingModal from "./BookingModal";


// ==========================================
// CAR CARD COMPONENT
// ==========================================

function CarCard({ car }) {

  // ==========================================
  // BOOKING MODAL STATE
  // ==========================================

  // Controls whether the BookingModal is visible
  const [showBooking, setShowBooking] = useState(false);


  // ==========================================
  // BOOKING STATUS
  // ==========================================

  // Check whether the car is already booked
  const isBooked = car.isBooked === true;


  return (
    <>
      {/* ==========================================
          MAIN CAR CARD
      ========================================== */}

      <div className="car-card">

        {/* ==========================================
            CAR IMAGE SECTION
        ========================================== */}

        <div className="car-image-container">

          {/* Display car image if available */}
          {car.image ? (

            <img
              src={car.image}
              alt={car.model || car.name || "Car"}

              // If image fails to load, hide it
              // and display the fallback icon
              onError={(e) => {

                e.currentTarget.style.display = "none";

                const fallback =
                  e.currentTarget.parentElement.querySelector(
                    ".car-image-fallback",
                  );

                if (fallback) {
                  fallback.style.display = "flex";
                }
              }}
            />

          ) : (

            // Fallback when no image URL is available
            <div className="car-image-fallback">
              🚗
            </div>

          )}


          {/* ==========================================
              IMAGE FALLBACK
          ========================================== */}

          {car.image && (
            <div
              className="car-image-fallback"
              style={{
                display: "none",
              }}
            >
              🚗
            </div>
          )}


          {/* ==========================================
              NEW CAR BADGE
          ========================================== */}

          {car.newCar && (
            <span className="new-badge">
              New
            </span>
          )}


          {/* ==========================================
              CAR RATING
          ========================================== */}

          {car.rating && (
            <span className="rating">
              ⭐ {car.rating}
            </span>
          )}

        </div>


        {/* ==========================================
            CAR INFORMATION SECTION
        ========================================== */}

        <div className="car-content">

          {/* Car model/name */}
          <h2>
            Model : {car.model || car.name}
          </h2>


          {/* ==========================================
              PRICE AND AVAILABILITY
          ========================================== */}

          <div className="car-details">

            {/* Car rental price */}
            <span>
              ₹{" "}
              {Number(
                car.price || car.pricePerDay || 0
              ).toLocaleString("en-IN")}
            </span>


            {/* Separator */}
            <span className="divider">
              |
            </span>


            {/* ==========================================
                AVAILABILITY STATUS
            ========================================== */}

            {isBooked ? (

              // Car is currently booked
              <span className="booked-status">
                ● Booked
              </span>

            ) : car.available === false ? (

              // Car has been marked unavailable
              <span className="unavailable-status">
                ● Unavailable
              </span>

            ) : (

              // Car is available for booking
              <span className="available">
                ● Available
              </span>

            )}

          </div>


          {/* ==========================================
              CAR DESCRIPTION
          ========================================== */}

          {car.description && (
            <p className="car-description">
              {car.description}
            </p>
          )}


          {/* ==========================================
              BOOKING INFORMATION
          ========================================== */}

          {isBooked && (
            <div className="booked-info">

              {/* Booking status message */}
              <strong>
                🔒 Already Booked
              </strong>


              {/* Display booking dates if available */}
              {car.bookedFrom && car.bookedUntil && (
                <p>
                  {car.bookedFrom}
                  {" → "}
                  {car.bookedUntil}
                </p>
              )}

            </div>
          )}


          {/* ==========================================
              BOOKING BUTTON
          ========================================== */}

          {isBooked ? (

            // Disable booking when car is already booked
            <button
              className="book-btn disabled"
              disabled
            >
              Already Booked
            </button>

          ) : car.available === false ? (

            // Disable booking when car is unavailable
            <button
              className="book-btn disabled"
              disabled
            >
              Currently Unavailable
            </button>

          ) : (

            // Open booking modal for available car
            <button
              className="book-btn"
              onClick={() => setShowBooking(true)}
            >
              Book Now →
            </button>

          )}

        </div>

      </div>


      {/* ==========================================
          BOOKING MODAL
      ========================================== */}

      {showBooking && (
        <BookingModal
          car={car}
          onClose={() => setShowBooking(false)}
        />
      )}

    </>
  );
}


// ==========================================
// EXPORT COMPONENT
// ==========================================

export default CarCard;