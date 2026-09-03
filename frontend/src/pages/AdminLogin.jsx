import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // ==================================================
  // ADMIN LOGIN
  // ==================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username: username.trim(),

          password,
        }),
      });

      const data = await response.json();

      // ------------------------------------------
      // LOGIN FAILED
      // ------------------------------------------

      if (!response.ok) {
        alert(data.message || "Invalid admin username or password.");

        return;
      }

      // ------------------------------------------
      // LOGIN SUCCESS
      // ------------------------------------------

      if (data.success) {
        localStorage.setItem("adminLoggedIn", "true");

        localStorage.setItem("adminUsername", data.admin.username);

        navigate("/admin");
      }
    } catch (error) {
      console.error("Admin login error:", error);

      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-icon">🔐</div>

        <h1>Admin Login</h1>

        <p>Login to access the administration panel</p>

        <form onSubmit={handleLogin}>
          {/* USERNAME */}

          <div className="admin-form-group">
            <label>Username</label>

            <input
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}

          <div className="admin-form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* LOGIN BUTTON */}

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login to Admin Panel"}
          </button>
        </form>

        {/* BACK */}

        <button className="admin-back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
