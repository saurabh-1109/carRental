import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // FETCH USER FROM MONGODB
  // ==========================================

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || !storedUser._id) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/users/${storedUser._id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("User not found");
        }

        return response.json();
      })
      .then((data) => {
        setUser(data);

        setName(data.name);
        setEmail(data.email);
        setLocation(data.location);

        // Keep localStorage updated
        localStorage.setItem("user", JSON.stringify(data));

        setLoading(false);
      })
      .catch((error) => {
        console.error("Profile fetch error:", error);

        setError("Unable to fetch profile");

        setLoading(false);
      });
  }, []);

  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  const handleUpdate = async () => {
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            location,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update profile");

        return;
      }

      setUser(data.user);

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      setName(data.user.name);
      setEmail(data.user.email);
      setLocation(data.user.location);

      setEditing(false);

      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);

      setError("Unable to connect to server");
    }
  };

  // ==========================================
  // DELETE ACCOUNT
  // ==========================================

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user._id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete account");

        return;
      }

      // Remove user from browser
      localStorage.removeItem("user");

      alert("Your account has been deleted successfully.");

      navigate("/signup");
    } catch (error) {
      console.error("Delete account error:", error);

      setError("Unable to connect to server");
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h2>Loading Profile...</h2>
        </div>
      </div>
    );
  }

  // ==========================================
  // NO USER
  // ==========================================

  if (!user) {
    return (
      <div className="profile-page">
        <button className="profile-back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>

        <div className="profile-card no-account">
          <div className="profile-icon">👤</div>

          <h1>Welcome!</h1>

          <p>You don't have an account yet.</p>

          <p className="profile-subtext">
            Create an account or login to view your profile.
          </p>

          <div className="profile-actions">
            <button className="signup-btn" onClick={() => navigate("/signup")}>
              Create Account
            </button>

            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PROFILE PAGE
  // ==========================================

  return (
    <div className="profile-page">
      <button className="profile-back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <div className="profile-card">
        <div className="profile-icon">👤</div>

        <h1>My Profile</h1>

        <p className="profile-subtitle">Your account information</p>

        {message && <p className="profile-success">{message}</p>}

        {error && <p className="profile-error">{error}</p>}

        <div className="profile-details">
          {/* NAME */}

          <div className="profile-row">
            <span>Name</span>

            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <strong>{user.name}</strong>
            )}
          </div>

          {/* EMAIL */}

          <div className="profile-row">
            <span>Email</span>

            {editing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <strong>{user.email}</strong>
            )}
          </div>

          {/* LOCATION */}

          <div className="profile-row">
            <span>Location</span>

            {editing ? (
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            ) : (
              <strong>{user.location}</strong>
            )}
          </div>

          {/* PASSWORD */}

          <div className="profile-row">
            <span>Password</span>

            <strong>••••••••</strong>
          </div>
        </div>

        {/* ACTION BUTTONS */}

        <div className="profile-buttons">
          {editing ? (
            <>
              <button className="save-profile-btn" onClick={handleUpdate}>
                Save Changes
              </button>

              <button
                className="cancel-profile-btn"
                onClick={() => {
                  setEditing(false);

                  setName(user.name);
                  setEmail(user.email);
                  setLocation(user.location);

                  setMessage("");
                  setError("");
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="update-profile-btn"
              onClick={() => {
                setEditing(true);
                setMessage("");
                setError("");
              }}
            >
              Update Profile
            </button>
          )}

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>

          <button className="delete-account-btn" onClick={handleDelete}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
