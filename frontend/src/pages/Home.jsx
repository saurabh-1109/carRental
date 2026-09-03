import Navbar from "../components/Navbar.jsx";
import CarCard from "../components/CarCard.jsx";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

import Sco_01_white from "../assets/Sco_01_white.jpg";
import Ford_red from "../assets/Ford_red.jpg";
import Mcd_04_white from "../assets/Mcd_04_white.png";

function Home() {
  const navigate = useNavigate();
  const cars = [
    {
      name: "Scorpio",
      price: 3500,
      image: Sco_01_white,
    },
    {
      name: "Ford Mustang",
      price: 7000,
      image: Ford_red,
    },
    {
      name: "Mercedes Maybach",
      price: 5000,
      image: Mcd_04_white,
    },
  ].map((car, index) => ({
    ...car,
    id: index + 1,
  }));

  return (
    <>
      <Navbar />

      {/* ================= HERO SECTION ================= */}

      <section className="hero">
        <div className="hero-content">
          <h1>
            Rent Your Dream Car
            <br />
            <span>Anytime, Anywhere.</span>
          </h1>

          <p>
            Choose from a wide range of affordable and premium cars for your
            next journey.
          </p>

          <div className="hero-buttons">
            <a href="/cars" className="primary-btn">
              Browse Cars
            </a>
          </div>
        </div>
      </section>

      {/* ================= SEARCH SECTION ================= */}

      <section className="search-section">
        <div className="search-box">
          <div className="input-group">
            <label>Pickup Location</label>

            <input type="text" placeholder="Enter location" required />
          </div>

          <div className="input-group">
            <label>Pickup Date</label>

            <input type="date" required />
          </div>

          <div className="input-group">
            <label>Return Date</label>

            <input type="date" required />
          </div>

          <button className="search-btn" onClick={() => navigate("/Cars")}>
            Search Cars
          </button>
        </div>
      </section>

      {/* ================= POPULAR CARS ================= */}

      <section className="cars-section">
        <h2>Popular Cars</h2>

        <p className="section-description">
          Check out some of our most popular rental cars.
        </p>

        <div className="cars-container">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        <a href="/cars" className="view-all">
          View All Cars →
        </a>
      </section>

      {/* ================= WHY CHOOSE US ================= */}

      <section className="features">
        <h2>Why Choose Us?</h2>

        <p className="section-description">
          Everything you need for a smooth car rental experience.
        </p>

        <div className="feature-container">
          <div className="feature-card">
            <div className="feature-icon">🚗</div>

            <h3>Wide Range of Cars</h3>

            <p>Choose from economy cars, SUVs, sedans and luxury cars.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>

            <h3>Affordable Prices</h3>

            <p>Enjoy competitive prices with no hidden charges.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>

            <h3>Safe & Secure</h3>

            <p>Your booking and personal information are secure with us.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>

            <h3>Easy Booking</h3>

            <p>Find and book your favorite car in just a few clicks.</p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="cta">
        <h2>Ready to Start Your Journey?</h2>

        <p>Find the perfect car and hit the road today.</p>

        <a href="/cars" className="primary-btn">
          Explore Cars
        </a>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer">
        <div>
          <h2>🚗 CarRental</h2>

          <p>Your trusted partner for easy and affordable car rentals.</p>
        </div>

        <div>
          <h3>Quick Links</h3>

          <a href="/">Home</a>

          <a href="/cars">Cars</a>

          <a href="/about">About</a>

          <a href="/contact">Contact</a>
        </div>

        <div>
          <h3>Contact</h3>

          <p>📍 Mumbai, India</p>

          <p>📞 +91 98765 43210</p>

          <p>✉️ A1carrental@gmail.com</p>
        </div>
      </footer>
    </>
  );
}

export default Home;
