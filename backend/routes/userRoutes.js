const express = require("express");
const router = express.Router();

const UserData = require("../models/userData");

// =====================================================
// GET USER BY ID
// =====================================================

router.get("/:id", async (req, res) => {
  try {
    console.log("Fetching user ID:", req.params.id);

    const user = await UserData.findById(req.params.id).select("-password");

    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Fetch user error:", error);

    res.status(500).json({
      message: "Server error while fetching user",
      error: error.message,
    });
  }
});

// =====================================================
// UPDATE USER
// =====================================================

router.put("/:id", async (req, res) => {
  try {
    const { name, email, location } = req.body;

    if (!name || !email || !location) {
      return res.status(400).json({
        message: "Name, email and location are required",
      });
    }

    const existingUser = await UserData.findOne({
      email: email.toLowerCase().trim(),
      _id: {
        $ne: req.params.id,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered",
      });
    }

    const updatedUser = await UserData.findByIdAndUpdate(
      req.params.id,

      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        location: location.trim(),
      },

      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",

      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);

    res.status(500).json({
      message: "Server error while updating profile",

      error: error.message,
    });
  }
});

// =====================================================
// DELETE USER
// =====================================================

router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await UserData.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    res.status(500).json({
      message: "Server error while deleting account",

      error: error.message,
    });
  }
});

module.exports = router;
