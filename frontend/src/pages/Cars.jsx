import "../styles/Cars.css";
import CarCard from "../components/CarCard.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// ==================================================
// LOAD ALL IMAGES FROM ASSETS
// ==================================================

const carImages = import.meta.glob("../assets/*", {
  eager: true,
  query: "?url",
  import: "default",
});

// ==================================================
// FIND IMAGE FROM MONGODB VALUE
// ==================================================

const getCarImage = (image) => {
  if (!image) {
    return "";
  }

  // ------------------------------------------
  // FULL URL
  // ------------------------------------------

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  // ------------------------------------------
  // CLEAN FILE NAME
  // ------------------------------------------

  const cleanImage = image.replace(/\\/g, "/").split("/").pop();

  // ------------------------------------------
  // FIND IMAGE IN VITE ASSETS
  // ------------------------------------------

  const assetEntry = Object.entries(carImages).find(([path]) =>
    path.endsWith(`/${cleanImage}`),
  );

  if (assetEntry) {
    return assetEntry[1];
  }

  // ------------------------------------------
  // IF IMAGE IS ALREADY A PATH
  // ------------------------------------------

  if (image.startsWith("/")) {
    return image;
  }

  // ------------------------------------------
  // FALLBACK
  // ------------------------------------------

  return image;
};

function Cars() {
  const navigate = useNavigate();

  // ==================================================
  // STATES
  // ==================================================

  const [currentPage, setCurrentPage] = useState(1);

  const [backendCars, setBackendCars] = useState([]);

  const [bookings, setBookings] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState("All");

  const [minPrice, setMinPrice] = useState("");

  const [maxPrice, setMaxPrice] = useState("");

  const [loading, setLoading] = useState(true);

  const carsPerPage = 12;

  const API_URL = "http://localhost:5000/api";

  // ==================================================
  // FETCH CARS + BOOKINGS
  // ==================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // ------------------------------------------
        // GET CARS
        // ------------------------------------------

        const carsResponse = await fetch(`${API_URL}/cars`);

        if (!carsResponse.ok) {
          throw new Error("Failed to fetch cars");
        }

        const carsData = await carsResponse.json();

        console.log("Cars from MongoDB:", carsData);

        setBackendCars(carsData);

        // ------------------------------------------
        // GET BOOKINGS
        // ------------------------------------------

        const bookingsResponse = await fetch(`${API_URL}/bookings`);

        if (!bookingsResponse.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const bookingsData = await bookingsResponse.json();

        console.log("Bookings from MongoDB:", bookingsData);

        setBookings(bookingsData);
      } catch (error) {
        console.error("Error loading cars:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const d = new Date(date);

    if (isNaN(d.getTime())) {
      return date;
    }

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // ==================================================
  // GET ACTIVE BOOKING
  // ==================================================

  const getActiveBooking = (car) => {
    const now = new Date();

    return bookings.find((booking) => {
      // ------------------------------------------
      // ONLY CONFIRMED BOOKINGS
      // ------------------------------------------

      if (booking.bookingStatus !== "confirmed") {
        return false;
      }

      // ------------------------------------------
      // MATCH CAR BY ID
      // ------------------------------------------

      if (booking.carId && String(booking.carId) === String(car._id)) {
        const pickup = new Date(booking.pickupDate);

        const returnDate = new Date(booking.returnDate);

        return now >= pickup && now < returnDate;
      }

      // ------------------------------------------
      // FALLBACK MATCH BY NAME
      // ------------------------------------------

      if (!booking.carId && booking.carName && car.name) {
        if (booking.carName.toLowerCase() !== car.name.toLowerCase()) {
          return false;
        }

        const pickup = new Date(booking.pickupDate);

        const returnDate = new Date(booking.returnDate);

        return now >= pickup && now < returnDate;
      }

      return false;
    });
  };

  // ==================================================
  // CONVERT MONGODB CARS
  // ==================================================

  const cars = backendCars.map((car) => {
    const activeBooking = getActiveBooking(car);

    return {
      ...car,

      // ----------------------------------------
      // ID
      // ----------------------------------------

      id: car._id,

      // ----------------------------------------
      // MODEL
      // ----------------------------------------

      model: car.name || "Car",

      // ----------------------------------------
      // PRICE
      // ----------------------------------------

      price: Number(car.price || 0),

      // ----------------------------------------
      // IMAGE
      // ----------------------------------------

      image: getCarImage(car.image),

      // ----------------------------------------
      // AVAILABILITY
      // ----------------------------------------

      available: car.availability !== false,

      // ----------------------------------------
      // DESCRIPTION
      // ----------------------------------------

      description:
        "Premium luxury, dynamic performance, and an unforgettable driving experience.",

      // ----------------------------------------
      // RATING
      // ----------------------------------------

      rating: "4.5",

      // ========================================
      // BOOKING STATUS
      // ========================================

      isBooked: !!activeBooking,

      // ----------------------------------------
      // BOOKED FROM
      // ----------------------------------------

      bookedFrom: activeBooking ? formatDate(activeBooking.pickupDate) : null,

      // ----------------------------------------
      // BOOKED UNTIL
      // ----------------------------------------

      bookedUntil: activeBooking ? formatDate(activeBooking.returnDate) : null,
    };
  });

  // ==================================================
  // FILTER CARS
  // ==================================================

  const filteredCars = cars.filter((car) => {
    // ------------------------------------------
    // BRAND
    // ------------------------------------------

    const brandMatch =
      selectedBrand === "All" ||
      car.model.toLowerCase().includes(selectedBrand.toLowerCase());

    // ------------------------------------------
    // MIN PRICE
    // ------------------------------------------

    const minPriceMatch = minPrice === "" || car.price >= Number(minPrice);

    // ------------------------------------------
    // MAX PRICE
    // ------------------------------------------

    const maxPriceMatch = maxPrice === "" || car.price <= Number(maxPrice);

    return brandMatch && minPriceMatch && maxPriceMatch;
  });

  // ==================================================
  // RESET PAGE WHEN FILTER CHANGES
  // ==================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrand, minPrice, maxPrice]);

  // ==================================================
  // PAGINATION
  // ==================================================

  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const startIndex = (currentPage - 1) * carsPerPage;

  const currentCars = filteredCars.slice(startIndex, startIndex + carsPerPage);

  // ==================================================
  // CLEAR FILTERS
  // ==================================================

  const clearFilters = () => {
    setSelectedBrand("All");

    setMinPrice("");

    setMaxPrice("");

    setCurrentPage(1);
  };

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div className="cars-page">
      {/* ==================================================
          BACK BUTTON
      ================================================== */}

      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      {/* ==================================================
          HEADING
      ================================================== */}

      <div className="cars-heading">
        <h1>Our Premium Cars</h1>

        <p>Explore our wide range of luxury and performance cars</p>

        <div className="heading-line"></div>
      </div>

      {/* ==================================================
          FILTER SECTION
      ================================================== */}

      <div className="filter-section">
        <div className="filter-title">
          <h2>Filter Cars</h2>

          <button className="clear-filter-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>

        <div className="filter-container">
          {/* =========================
              BRAND
          ========================= */}

          <div className="filter-group">
            <label>Car Brand</label>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="All">All Brands</option>

              <option value="BMW">BMW</option>

              <option value="Mercidies">Mercedes</option>

              <option value="Audi">Audi</option>

              <option value="Ford">Ford</option>

              <option value="Toyota">Toyota</option>

              <option value="Maruti">Maruti</option>

              <option value="MG">MG</option>

              <option value="Porsche">Porsche</option>

              <option value="Mahindra">Mahindra</option>
            </select>
          </div>

          {/* =========================
              MINIMUM PRICE
          ========================= */}

          <div className="filter-group">
            <label>Minimum Price</label>

            <input
              type="number"
              placeholder="₹ Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          {/* =========================
              MAXIMUM PRICE
          ========================= */}

          <div className="filter-group">
            <label>Maximum Price</label>

            <input
              type="number"
              placeholder="₹ Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        {/* =========================
            RESULT COUNT
        ========================= */}

        <div className="filter-result">
          Showing <strong>{filteredCars.length}</strong> cars
        </div>
      </div>

      {/* ==================================================
          LOADING
      ================================================== */}

      {loading ? (
        <div className="no-cars">
          <h2>Loading Cars...</h2>
        </div>
      ) : filteredCars.length === 0 ? (
        /* ==================================================
           NO RESULTS
        ================================================== */

        <div className="no-cars">
          <h2>No Cars Found</h2>

          <p>Try changing your brand or price filters.</p>

          <button onClick={clearFilters}>Clear Filters</button>
        </div>
      ) : (
        <>
          {/* ==================================================
              CAR GRID
          ================================================== */}

          <div className="car-container">
            {currentCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          {/* ==================================================
              PAGINATION
          ================================================== */}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                ← Previous
              </button>

              <div className="page-numbers">
                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) => (
                    <button
                      key={index}
                      className={
                        currentPage === index + 1
                          ? "page-number active"
                          : "page-number"
                      }
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ),
                )}
              </div>

              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Cars;
