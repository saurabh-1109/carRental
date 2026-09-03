import { Link } from "react-router-dom";

const styles = {
  navbar: {
    backgroundColor: "#f8f9fa",
    padding: "10px 20px",
  },

  ul: {
    listStyle: "none",
  },
};

function Navbar() {
  // Check if user is logged in
  const user = localStorage.getItem("user");

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid" style={styles.navbar}>
        {/* LOGO */}

        <Link className="navbar-brand" to="/">
          Car Rental
        </Link>

        {/* MOBILE MENU BUTTON */}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAVIGATION */}

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav" style={styles.ul}>
            {/* HOME */}

            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {/* CARS */}

            <li className="nav-item">
              <Link className="nav-link" to="/cars">
                Cars
              </Link>
            </li>

            {/* BOOKINGS */}

            <li className="nav-item">
              <Link className="nav-link" to="/booking">
                Bookings
              </Link>
            </li>

            {/* PROFILE */}

            <li className="nav-item">
              <Link className="nav-link" to="/profile">
                Profile
              </Link>
            </li>

            {/* LOGIN - ONLY SHOW WHEN USER IS NOT LOGGED IN */}

            {!user && (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
