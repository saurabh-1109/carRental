const express = require("express");
const bcrypt = require("bcrypt");

const Admin = require("../models/admin");

const router = express.Router();

// ==================================================
// ADMIN LOGIN
// ==================================================

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!username || !password) {
      return res.status(400).json({
        success: false,

        message: "Username and password are required",
      });
    }

    // ------------------------------------------
    // FIND ADMIN
    // ------------------------------------------

    const admin = await Admin.findOne({
      username: username.trim(),
    });

    // ------------------------------------------
    // ADMIN NOT FOUND
    // ------------------------------------------

    if (!admin) {
      return res.status(401).json({
        success: false,

        message: "Invalid admin username or password",
      });
    }

    // ------------------------------------------
    // CHECK PASSWORD
    // ------------------------------------------

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,

        message: "Invalid admin username or password",
      });
    }

    // ------------------------------------------
    // LOGIN SUCCESS
    // ------------------------------------------

    res.status(200).json({
      success: true,

      message: "Admin login successful",

      admin: {
        _id: admin._id,

        username: admin.username,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      success: false,

      message: "Admin login failed",
    });
  }
});

module.exports = router;
