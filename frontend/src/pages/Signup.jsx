import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const user = {
      name,
      location,
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Signup successful!");

        // ==========================================
        // SAVE USER RETURNED FROM DATABASE
        // INCLUDING MONGODB _id
        // ==========================================

        localStorage.setItem("user", JSON.stringify(data.user));

        // Go to login
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);

      setError("Unable to connect to server");
    }
  };

  return (
    <div className="maindiv">
      <h1>Signup</h1>

      <form className="signupForm" onSubmit={handleSignup}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <a
          href="/login"
          id="loginLink"
          onClick={(e) => {
            e.preventDefault();
            navigate("/login");
          }}
        >
          Already have an account? Login
        </a>

        <button type="submit" className="btn">
          Signup
        </button>

        {message && <p className="signup-success">{message}</p>}

        {error && <p className="signup-error">{error}</p>}
      </form>
    </div>
  );
}

export default Signup;
