import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [loginType, setLoginType] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [popup, setPopup] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // ==========================================
  // USER LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        setLoginSuccess(true);
        setPopup(true);

        // Save logged-in user
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        // Login failed
        setLoginSuccess(false);
        setPopup(true);
      }
    } catch (error) {
      console.error("Login error:", error);

      setLoginSuccess(false);
      setPopup(true);
    }
  };

  // ==========================================
  // USER LOGIN SELECTION
  // ==========================================

  const handleUserLogin = () => {
    setLoginType("user");
  };

  // ==========================================
  // ADMIN LOGIN SELECTION
  // ==========================================

  const handleAdminLogin = () => {
    navigate("/admin-login");
  };

  // ==========================================
  // BACK BUTTON
  // ==========================================

  const handleBack = () => {
    if (loginType === "user") {
      setLoginType(null);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="login-page">
      {/* ==========================================
          BACK TO HOME / BACK TO LOGIN OPTIONS
      ========================================== */}

      <button className="back-home-btn" onClick={handleBack}>
        ← {loginType === "user" ? "Back" : "Back to Home"}
      </button>

      {/* ==========================================
          LOGIN TYPE SELECTION
      ========================================== */}

      {loginType === null && (
        <div className="login-choice-overlay">
          <div className="login-choice-card">
            <div className="choice-icon">🔐</div>

            <h1>Login</h1>

            <p>Please select how you want to login</p>

            <div className="login-choice-buttons">
              {/* USER LOGIN */}

              <button className="user-login-choice" onClick={handleUserLogin}>
                <span className="choice-button-icon">👤</span>

                <span>
                  <strong>User Login</strong>
                  <small>Login to book your car</small>
                </span>

                <span className="choice-arrow">→</span>
              </button>

              {/* ADMIN LOGIN */}

              <button className="admin-login-choice" onClick={handleAdminLogin}>
                <span className="choice-button-icon">🛠️</span>

                <span>
                  <strong>Admin Login</strong>
                  <small>Access admin dashboard</small>
                </span>

                <span className="choice-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          USER LOGIN FORM
      ========================================== */}

      {loginType === "user" && (
        <div className="login-container">
          {/* LEFT SIDE */}

          <div className="login-info">
            <h1>Drive Your Way</h1>

            <p>Rent your dream car and enjoy every journey with us.</p>

            <div className="login-line"></div>

            <span>Premium Cars • Easy Booking • Great Experience</span>
          </div>

          {/* LOGIN CARD */}

          <div className="login-card">
            <h2>Welcome Back</h2>

            <p className="login-subtitle">Login to continue your journey</p>

            <form className="loginForm" onSubmit={handleLogin}>
              {/* EMAIL */}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>

                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* PASSWORD */}

              <div className="form-group">
                <label htmlFor="password">Password</label>

                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* OPTIONS */}

              <div className="login-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  Remember me
                </label>

                <a
                  href="#"
                  className="forgot-password"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </a>
              </div>

              {/* LOGIN BUTTON */}

              <button type="submit" className="btn">
                Login
              </button>
            </form>

            {/* SIGNUP */}

            <p className="signup-text">
              Don't have an account?
              <span onClick={() => navigate("/signup")}> Sign up</span>
            </p>
          </div>
        </div>
      )}

      {/* ==========================================
          LOGIN RESULT POPUP
      ========================================== */}

      {popup && (
        <div className="success-overlay">
          <div className="success-popup">
            {loginSuccess ? (
              <>
                <div className="success-icon">✓</div>

                <h2>Login Successful!</h2>

                <p>Welcome back! You have successfully logged in.</p>

                <button className="explore-btn" onClick={() => navigate("/")}>
                  Explore
                </button>
              </>
            ) : (
              <>
                <div className="error-icon">!</div>

                <h2>Data Not Found</h2>

                <p>
                  No account was found with the email and password you entered.
                </p>

                <button
                  className="signup-popup-btn"
                  onClick={() => navigate("/signup")}
                >
                  Go to Signup
                </button>

                <button
                  className="close-popup-btn"
                  onClick={() => setPopup(false)}
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
