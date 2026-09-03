import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

function Admin() {
  const navigate = useNavigate();

  // =========================================================
  // STATE MANAGEMENT
  // =========================================================

  // Stores the currently selected admin dashboard tab
  const [activeTab, setActiveTab] = useState("dashboard");

  // Stores all cars fetched from MongoDB
  const [cars, setCars] = useState([]);

  // Stores all bookings fetched from MongoDB
  const [bookings, setBookings] = useState([]);

  // Controls the visibility of the Add Car form
  const [showAddCar, setShowAddCar] = useState(false);

  // Stores the car currently being edited
  const [editingCar, setEditingCar] = useState(null);

  // Loading states for cars and bookings
  const [loadingCars, setLoadingCars] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // =========================================================
  // BACKEND API URL
  // =========================================================

  const API_URL = "http://localhost:5000/api";

  // =========================================================
  // NEW CAR FORM STATE
  // =========================================================

  const [newCar, setNewCar] = useState({
    name: "",
    price: "",
    image: "",
    available: true,
  });

  // =========================================================
  // EDIT CAR FORM STATE
  // =========================================================

  const [editCar, setEditCar] = useState({
    price: "",
    image: "",
    available: true,
  });

  // =========================================================
  // ADMIN AUTHENTICATION
  // =========================================================

  useEffect(() => {
    // Check whether the admin is logged in
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");

    // Redirect unauthorized users to the admin login page
    if (adminLoggedIn !== "true") {
      navigate("/admin-login");
      return;
    }

    // Load cars and bookings after authentication
    loadData();
  }, [navigate]);

  // =========================================================
  // LOAD CARS AND BOOKINGS FROM BACKEND
  // =========================================================

  const loadData = async () => {
    try {
      setLoadingCars(true);
      setLoadingBookings(true);

      // -------------------------------------------------------
      // LOAD CARS
      // -------------------------------------------------------

      const carsResponse = await fetch(`${API_URL}/cars`);

      if (!carsResponse.ok) {
        throw new Error("Failed to fetch cars");
      }

      const mongoCars = await carsResponse.json();

      console.log("Cars from MongoDB:", mongoCars);

      setCars(mongoCars);

      // -------------------------------------------------------
      // LOAD BOOKINGS
      // -------------------------------------------------------

      const bookingsResponse = await fetch(`${API_URL}/bookings`);

      if (!bookingsResponse.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const mongoBookings = await bookingsResponse.json();

      console.log("Bookings from MongoDB:", mongoBookings);

      setBookings(mongoBookings);
    } catch (error) {
      console.error("Error loading admin data:", error);

      alert("Failed to load admin data. Make sure the backend is running.");
    } finally {
      setLoadingCars(false);
      setLoadingBookings(false);
    }
  };

  // =========================================================
  // FIND CAR ASSOCIATED WITH A BOOKING
  // =========================================================

  const getBookedCar = (booking) => {
    // Return null if no booking is provided
    if (!booking) {
      return null;
    }

    // Find the car using either MongoDB _id or regular id
    return cars.find(
      (car) =>
        String(car._id) === String(booking.carId) ||
        String(car.id) === String(booking.carId),
    );
  };

  // =========================================================
  // ADMIN LOGOUT
  // =========================================================

  const handleLogout = () => {
    // Remove admin login information from localStorage
    localStorage.removeItem("adminLoggedIn");

    // Redirect to admin login
    navigate("/admin-login");
  };

  // =========================================================
  // ADD NEW CAR
  // =========================================================

  const handleAddCar = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!newCar.name.trim() || !newCar.price) {
      alert("Please enter car name and price.");
      return;
    }

    try {
      // Send new car data to the backend
      const response = await fetch(`${API_URL}/cars`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: newCar.name.trim(),
          price: Number(newCar.price),
          availability: newCar.available,
          image: newCar.image.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add car");
      }

      // Add newly created car to the existing list
      setCars((prevCars) => [...prevCars, data.car]);

      // Reset the form
      setNewCar({
        name: "",
        price: "",
        image: "",
        available: true,
      });

      // Close the Add Car form
      setShowAddCar(false);

      alert("Car added successfully.");
    } catch (error) {
      console.error("Error adding car:", error);

      alert("Failed to add car. Make sure the backend is running.");
    }
  };

  // =========================================================
  // DELETE CAR
  // =========================================================

  const deleteCar = async (id) => {
    // Ask the admin for confirmation
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this car?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      // Delete car from backend
      const response = await fetch(`${API_URL}/cars/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete car");
      }

      // Remove deleted car from the frontend state
      setCars((prevCars) => prevCars.filter((car) => car._id !== id));

      alert("Car deleted successfully.");
    } catch (error) {
      console.error("Error deleting car:", error);

      alert("Failed to delete car.");
    }
  };

  // =========================================================
  // OPEN EDIT CAR MODAL
  // =========================================================

  const handleEditCar = (car) => {
    // Store the selected car
    setEditingCar(car);

    // Populate the edit form with existing car information
    setEditCar({
      price: car.price || "",
      image: car.image || "",
      available: car.availability !== false,
    });
  };

  // =========================================================
  // UPDATE CAR
  // =========================================================

  const handleUpdateCar = async (e) => {
    e.preventDefault();

    // Make sure a car is selected
    if (!editingCar) {
      return;
    }

    // Validate price
    if (!editCar.price || Number(editCar.price) <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    try {
      // Update car information in the backend
      const response = await fetch(`${API_URL}/cars/${editingCar._id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: editingCar.name,
          price: Number(editCar.price),
          availability: editCar.available,
          image: editCar.image.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update car");
      }

      // Replace the old car with the updated car
      setCars((prevCars) =>
        prevCars.map((car) => (car._id === editingCar._id ? data.car : car)),
      );

      // Close the edit modal
      setEditingCar(null);

      alert("Car updated successfully.");
    } catch (error) {
      console.error("Error updating car:", error);

      alert("Failed to update car.");
    }
  };

  // =========================================================
  // TOGGLE CAR AVAILABILITY
  // =========================================================

  const toggleAvailability = async (id) => {
    // Find the selected car
    const car = cars.find((car) => car._id === id);

    if (!car) {
      return;
    }

    try {
      // Update availability in the backend
      const response = await fetch(`${API_URL}/cars/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: car.name,
          price: car.price,
          availability: !car.availability,
          image: car.image,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update availability");
      }

      // Update the car in frontend state
      setCars((prevCars) =>
        prevCars.map((item) => (item._id === id ? data.car : item)),
      );
    } catch (error) {
      console.error("Error updating availability:", error);

      alert("Failed to update availability.");
    }
  };

  // =========================================================
  // UPDATE BOOKING STATUS
  // =========================================================

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      // Send the new booking status to the backend
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          bookingStatus: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update booking");
      }

      // Update the booking in frontend state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? data.booking : booking,
        ),
      );
    } catch (error) {
      console.error("Update booking error:", error);

      alert("Failed to update booking status.");
    }
  };

  // =========================================================
  // DELETE BOOKING
  // =========================================================

  const deleteBooking = async (bookingId) => {
    // Ask for confirmation before deleting
    const confirmDelete = window.confirm("Delete this booking?");

    if (!confirmDelete) {
      return;
    }

    try {
      // Delete booking from backend
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete booking");
      }

      // Remove deleted booking from frontend state
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId),
      );

      alert("Booking deleted successfully.");
    } catch (error) {
      console.error("Delete booking error:", error);

      alert("Failed to delete booking.");
    }
  };

  // =========================================================
  // DASHBOARD CALCULATIONS
  // =========================================================

  // Total number of cars
  const totalCars = cars.length;

  // Number of available cars
  const availableCars = cars.filter((car) => car.availability !== false).length;

  // Number of unavailable cars
  const unavailableCars = cars.filter(
    (car) => car.availability === false,
  ).length;

  // Total number of bookings
  const totalBookings = bookings.length;

  // Number of pending bookings
  const pendingBookings = bookings.filter(
    (booking) => booking.bookingStatus === "pending",
  ).length;

  // Number of confirmed bookings
  const confirmedBookings = bookings.filter(
    (booking) => booking.bookingStatus === "confirmed",
  ).length;

  // Calculate revenue from confirmed and paid bookings
  const totalAmount = bookings
    .filter(
      (booking) =>
        booking.paymentStatus === "paid" &&
        booking.bookingStatus === "confirmed",
    )
    .reduce((total, booking) => total + Number(booking.totalAmount || 0), 0);

  // =========================================================
  // ADMIN PAGE UI
  // =========================================================

  return (
    <div className="admin-page">
      {/* =====================================================
      SIDEBAR
  ===================================================== */}

      <aside className="admin-sidebar">
        {/* Admin logo */}
        <div className="admin-logo">
          <span>🚗</span>
          <h2>CarRental</h2>
        </div>

        {/* Admin profile */}
        <div className="admin-profile">
          <div className="admin-avatar">SM</div>

          <div>
            <strong>Admin</strong>
            <small>Administrator</small>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="admin-nav">
          {/* Dashboard tab */}
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </button>

          {/* Cars tab */}
          <button
            className={activeTab === "cars" ? "active" : ""}
            onClick={() => setActiveTab("cars")}
          >
            🚗 Manage Cars
          </button>

          {/* Bookings tab */}
          <button
            className={activeTab === "bookings" ? "active" : ""}
            onClick={() => setActiveTab("bookings")}
          >
            📋 Manage Bookings
          </button>
        </nav>

        {/* Logout button */}
        <button className="admin-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* =====================================================
      MAIN CONTENT
  ===================================================== */}

      <main className="admin-main">
        {/* ===================================================
        PAGE HEADER
    =================================================== */}

        <header className="admin-header">
          <div>
            <h1>
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "cars" && "Manage Cars"}
              {activeTab === "bookings" && "Manage Bookings"}
            </h1>

            <p>Car Rental Administration</p>
          </div>
        </header>

        {/* ===================================================
        DASHBOARD TAB
    =================================================== */}

        {activeTab === "dashboard" && (
          <section className="dashboard">
            {/* Dashboard statistics */}
            <div className="stats-grid">
              {/* Total cars */}
              <div className="stat-card">
                <div className="stat-icon">🚗</div>

                <div>
                  <span>Total Cars</span>
                  <strong>{totalCars}</strong>
                </div>
              </div>

              {/* Available cars */}
              <div className="stat-card">
                <div className="stat-icon">✅</div>

                <div>
                  <span>Available Cars</span>
                  <strong>{availableCars}</strong>
                </div>
              </div>

              {/* Unavailable cars */}
              <div className="stat-card">
                <div className="stat-icon">❌</div>

                <div>
                  <span>Unavailable Cars</span>
                  <strong>{unavailableCars}</strong>
                </div>
              </div>

              {/* Total bookings */}
              <div className="stat-card">
                <div className="stat-icon">📋</div>

                <div>
                  <span>Total Bookings</span>
                  <strong>{totalBookings}</strong>
                </div>
              </div>

              {/* Pending bookings */}
              <div className="stat-card">
                <div className="stat-icon">⏳</div>

                <div>
                  <span>Pending</span>
                  <strong>{pendingBookings}</strong>
                </div>
              </div>

              {/* Confirmed bookings */}
              <div className="stat-card">
                <div className="stat-icon">✓</div>

                <div>
                  <span>Confirmed</span>
                  <strong>{confirmedBookings}</strong>
                </div>
              </div>

              {/* Revenue */}
              <div className="stat-card revenue-card">
                <div className="stat-icon">₹</div>

                <div>
                  <span>Revenue</span>
                  <strong>₹{totalAmount.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            </div>

            {/* =================================================
            RECENT BOOKINGS
        ================================================= */}

            <div className="admin-section">
              <div className="section-header">
                <h2>Recent Bookings</h2>

                <button onClick={() => setActiveTab("bookings")}>
                  View All
                </button>
              </div>

              {/* Loading state */}
              {loadingBookings ? (
                <p className="empty-text">Loading bookings...</p>
              ) : /* Empty state */
              bookings.length === 0 ? (
                <p className="empty-text">No bookings yet.</p>
              ) : (
                /* Display latest five bookings */
                <div className="recent-bookings">
                  {bookings.slice(0, 5).map((booking) => (
                    <div className="recent-booking" key={booking._id}>
                      <div>
                        <strong>{booking.carName || "Unknown Car"}</strong>

                        <span>
                          {booking.customerName || "Unknown Customer"}
                        </span>
                      </div>

                      <strong>
                        ₹
                        {Number(booking.totalAmount || 0).toLocaleString(
                          "en-IN",
                        )}
                      </strong>

                      {/* Booking status badge */}
                      <span
                        className={
                          booking.bookingStatus === "confirmed"
                            ? "badge confirmed"
                            : booking.bookingStatus === "cancelled"
                              ? "badge cancelled"
                              : "badge pending"
                        }
                      >
                        {booking.bookingStatus || "pending"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ===================================================
        MANAGE CARS TAB
    =================================================== */}

        {activeTab === "cars" && (
          <section className="admin-section">
            {/* Cars section header */}
            <div className="section-header">
              <div>
                <h2>Manage Cars</h2>
                <p>Add, edit, delete and control car availability.</p>
              </div>

              {/* Toggle Add Car form */}
              <button
                className="add-car-btn"
                onClick={() => setShowAddCar(!showAddCar)}
              >
                + Add Car
              </button>
            </div>

            {/* =================================================
            ADD CAR FORM
        ================================================= */}

            {showAddCar && (
              <form className="add-car-form" onSubmit={handleAddCar}>
                <h3>Add New Car</h3>

                <div className="add-car-grid">
                  {/* Car name */}
                  <input
                    type="text"
                    placeholder="Car Name"
                    value={newCar.name}
                    onChange={(e) =>
                      setNewCar({
                        ...newCar,
                        name: e.target.value,
                      })
                    }
                    required
                  />

                  {/* Car price */}
                  <input
                    type="number"
                    placeholder="Price / Day"
                    value={newCar.price}
                    onChange={(e) =>
                      setNewCar({
                        ...newCar,
                        price: e.target.value,
                      })
                    }
                    required
                  />

                  {/* Car image URL */}
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={newCar.image}
                    onChange={(e) =>
                      setNewCar({
                        ...newCar,
                        image: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Save car */}
                <button type="submit" className="save-car-btn">
                  💾 Save Car
                </button>
              </form>
            )}

            {/* =================================================
            CARS TABLE
        ================================================= */}

            <div className="admin-table-container">
              <table className="admin-table">
                {/* Table headings */}
                <thead>
                  <tr>
                    <th>Car</th>
                    <th>Price / Day</th>
                    <th>Availability</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {/* Loading state */}
                  {loadingCars ? (
                    <tr>
                      <td colSpan="4" className="empty-text">
                        Loading cars...
                      </td>
                    </tr>
                  ) : /* Empty state */
                  cars.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-text">
                        No cars available.
                      </td>
                    </tr>
                  ) : (
                    /* Display cars */
                    cars.map((car) => (
                      <tr key={car._id}>
                        {/* Car information */}
                        <td>
                          <div className="car-admin-info">
                            {car.image ? (
                              <img
                                src={car.image}
                                alt={car.name}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="no-car-image">🚗</div>
                            )}

                            <strong>{car.name}</strong>
                          </div>
                        </td>

                        {/* Price */}
                        <td>
                          <strong>
                            ₹{Number(car.price || 0).toLocaleString("en-IN")}
                          </strong>
                        </td>

                        {/* Availability */}
                        <td>
                          <button
                            className={
                              car.availability
                                ? "availability available"
                                : "availability unavailable"
                            }
                            onClick={() => toggleAvailability(car._id)}
                          >
                            {car.availability ? "✓ Available" : "✕ Unavailable"}
                          </button>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="action-buttons">
                            {/* Edit */}
                            <button
                              className="edit-btn"
                              onClick={() => handleEditCar(car)}
                            >
                              ✏️ Edit
                            </button>

                            {/* Delete */}
                            <button
                              className="delete-btn"
                              onClick={() => deleteCar(car._id)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ===================================================
        MANAGE BOOKINGS TAB
    =================================================== */}

        {activeTab === "bookings" && (
          <>
            {/* =================================================
            BOOKINGS TABLE
        ================================================= */}

            <section className="admin-section">
              {/* Section heading */}
              <div className="section-header">
                <div>
                  <h2>Manage Bookings</h2>

                  <p>Review payments and update booking status.</p>
                </div>
              </div>

              {/* Bookings table */}
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Car</th>
                      <th>Dates</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {/* Loading state */}
                    {loadingBookings ? (
                      <tr>
                        <td colSpan="7" className="empty-text">
                          Loading bookings...
                        </td>
                      </tr>
                    ) : /* Empty state */
                    bookings.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="empty-text">
                          No bookings found.
                        </td>
                      </tr>
                    ) : (
                      /* Display bookings */
                      bookings.map((booking) => {
                        // Find matching car information
                        const bookedCar = getBookedCar(booking);

                        return (
                          <tr key={booking._id}>
                            {/* CUSTOMER INFORMATION */}
                            <td>
                              <strong>
                                {booking.customerName || "Unknown"}
                              </strong>

                              <small>{booking.email || "No email"}</small>

                              {booking.mobile && (
                                <small>📱 {booking.mobile}</small>
                              )}
                            </td>

                            {/* CAR INFORMATION */}
                            <td>
                              <div className="booking-car-info">
                                {/* Car image */}
                                {booking.carImage || bookedCar?.image ? (
                                  <img
                                    src={booking.carImage || bookedCar?.image}
                                    alt={
                                      booking.carName ||
                                      bookedCar?.name ||
                                      "Booked Car"
                                    }
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div className="booked-car-placeholder">
                                    🚗
                                  </div>
                                )}

                                {/* Car details */}
                                <div className="booking-car-details">
                                  <strong>
                                    {booking.carName ||
                                      bookedCar?.name ||
                                      "Unknown Car"}
                                  </strong>

                                  <small>
                                    ₹
                                    {Number(
                                      booking.pricePerDay ||
                                        bookedCar?.price ||
                                        0,
                                    ).toLocaleString("en-IN")}
                                    /day
                                  </small>
                                </div>
                              </div>
                            </td>

                            {/* BOOKING DATES */}
                            <td>
                              <small>{booking.pickupDate || "N/A"}</small>

                              <br />

                              <small>→ {booking.returnDate || "N/A"}</small>

                              <br />

                              <small>{booking.days || 0} day(s)</small>
                            </td>

                            {/* TOTAL AMOUNT */}
                            <td>
                              <strong>
                                ₹
                                {Number(
                                  booking.totalAmount || 0,
                                ).toLocaleString("en-IN")}
                              </strong>
                            </td>

                            {/* PAYMENT STATUS */}
                            <td>
                              <span
                                className={
                                  booking.paymentStatus === "paid"
                                    ? "badge paid"
                                    : "badge pending"
                                }
                              >
                                {booking.paymentStatus === "paid"
                                  ? "✓ Paid"
                                  : "Not Paid"}
                              </span>
                            </td>

                            {/* BOOKING STATUS */}
                            <td>
                              <span
                                className={
                                  booking.bookingStatus === "confirmed"
                                    ? "badge confirmed"
                                    : booking.bookingStatus === "cancelled"
                                      ? "badge cancelled"
                                      : "badge pending"
                                }
                              >
                                {booking.bookingStatus || "pending"}
                              </span>
                            </td>

                            {/* BOOKING ACTIONS */}
                            <td>
                              {/* Change booking status */}
                              <select
                                value={booking.bookingStatus || "pending"}
                                onChange={(e) =>
                                  updateBookingStatus(
                                    booking._id,
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="pending">Pending</option>

                                <option value="confirmed">Confirmed</option>

                                <option value="cancelled">Cancelled</option>
                              </select>

                              {/* Delete booking */}
                              <button
                                className="delete-btn booking-delete-btn"
                                onClick={() => deleteBooking(booking._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* =================================================
            BOOKED CARS SECTION
        ================================================= */}

            <section className="admin-section booked-cars-section">
              {/* Section heading */}
              <div className="section-header">
                <div>
                  <h2>🚗 Booked Cars</h2>

                  <p>View details of cars currently booked by customers.</p>
                </div>
              </div>

              {/* Check whether any active bookings exist */}
              {bookings.filter(
                (booking) => booking.bookingStatus !== "cancelled",
              ).length === 0 ? (
                /* No booked cars */
                <div className="no-booked-cars">
                  <p>No cars have been booked yet.</p>
                </div>
              ) : (
                /* Display booked cars */
                <div className="booked-cars-grid">
                  {bookings
                    .filter((booking) => booking.bookingStatus !== "cancelled")
                    .map((booking) => {
                      // Find associated car
                      const bookedCar = getBookedCar(booking);

                      return (
                        <div
                          className="booked-car-card"
                          key={`booked-${booking._id}`}
                        >
                          {/* BOOKED CAR IMAGE */}
                          <div className="booked-car-image">
                            {bookedCar?.image ? (
                              <img
                                src={bookedCar.image}
                                alt={booking.carName || "Booked Car"}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="booked-car-placeholder">🚗</div>
                            )}
                          </div>

                          {/* BOOKED CAR CONTENT */}
                          <div className="booked-car-content">
                            {/* Car name and price */}
                            <div className="booked-car-header">
                              <h3>
                                {booking.carName ||
                                  bookedCar?.name ||
                                  "Unknown Car"}
                              </h3>

                              <span className="booked-car-price">
                                ₹
                                {Number(
                                  booking.pricePerDay || bookedCar?.price || 0,
                                ).toLocaleString("en-IN")}
                                /day
                              </span>
                            </div>

                            {/* Booking details */}
                            <div className="booked-car-details">
                              {/* Customer */}
                              <div className="booked-detail">
                                <span className="booked-detail-label">
                                  Customer
                                </span>

                                <span className="booked-detail-value">
                                  {booking.customerName || "Unknown"}
                                </span>
                              </div>

                              {/* Mobile */}
                              <div className="booked-detail">
                                <span className="booked-detail-label">
                                  Mobile
                                </span>

                                <span className="booked-detail-value">
                                  {booking.mobile
                                    ? `📱 ${booking.mobile}`
                                    : "Not provided"}
                                </span>
                              </div>

                              {/* Total amount */}
                              <div className="booked-detail">
                                <span className="booked-detail-label">
                                  Total Amount
                                </span>

                                <span className="booked-detail-value">
                                  ₹
                                  {Number(
                                    booking.totalAmount || 0,
                                  ).toLocaleString("en-IN")}
                                </span>
                              </div>

                              {/* Payment */}
                              <div className="booked-detail">
                                <span className="booked-detail-label">
                                  Payment
                                </span>

                                {booking.paymentStatus === "paid" ? (
                                  <span className="booked-payment-paid">
                                    ✓ Paid
                                  </span>
                                ) : (
                                  <span className="booked-payment-unpaid">
                                    Not Paid
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Booking status */}
                            <div className="booked-status">
                              <span className="booked-detail-label">
                                Booking Status
                              </span>

                              <span
                                className={
                                  booking.bookingStatus === "confirmed"
                                    ? "badge confirmed"
                                    : "badge pending"
                                }
                              >
                                {booking.bookingStatus || "pending"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </section>
          </>
        )}

        {/* ===================================================
        EDIT CAR MODAL
    =================================================== */}

        {editingCar && (
          <div className="edit-car-overlay">
            {/* Modal container */}
            <div className="edit-car-modal">
              {/* Close modal */}
              <button
                className="close-edit-btn"
                onClick={() => setEditingCar(null)}
              >
                ×
              </button>

              <h2>Edit Car</h2>

              {/* Current car name */}
              <p className="edit-car-name">{editingCar.name}</p>

              {/* Edit car form */}
              <form onSubmit={handleUpdateCar}>
                {/* Price */}
                <label>Price / Day</label>

                <input
                  type="number"
                  value={editCar.price}
                  onChange={(e) =>
                    setEditCar({
                      ...editCar,
                      price: e.target.value,
                    })
                  }
                  required
                />

                {/* Image URL */}
                <label>Image URL</label>

                <input
                  type="text"
                  value={editCar.image}
                  onChange={(e) =>
                    setEditCar({
                      ...editCar,
                      image: e.target.value,
                    })
                  }
                  placeholder="https://example.com/car.jpg"
                />

                {/* Image preview */}
                {editCar.image && (
                  <div className="edit-image-preview">
                    <img
                      src={editCar.image}
                      alt="Preview"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Availability */}
                <label>Availability</label>

                <select
                  value={editCar.available ? "available" : "unavailable"}
                  onChange={(e) =>
                    setEditCar({
                      ...editCar,
                      available: e.target.value === "available",
                    })
                  }
                >
                  <option value="available">✓ Available</option>

                  <option value="unavailable">✕ Unavailable</option>
                </select>

                {/* Modal action buttons */}
                <div className="edit-modal-actions">
                  {/* Cancel */}
                  <button
                    type="button"
                    className="cancel-edit-btn"
                    onClick={() => setEditingCar(null)}
                  >
                    Cancel
                  </button>

                  {/* Save changes */}
                  <button type="submit" className="save-edit-btn">
                    💾 Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;
