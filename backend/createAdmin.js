const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Admin = require("./models/admin");

const MONGO_URI = "mongodb://127.0.0.1:27017/carRental";

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    // ==========================================
    // ADMIN DETAILS
    // ==========================================

    const username = "smj";

    const password = "smj098";

    // ==========================================
    // CHECK EXISTING ADMIN
    // ==========================================

    const existingAdmin = await Admin.findOne({
      username,
    });

    if (existingAdmin) {
      console.log("Admin already exists.");

      await mongoose.connection.close();

      return;
    }

    // ==========================================
    // HASH PASSWORD
    // ==========================================

    const hashedPassword = await bcrypt.hash(password, 10);

    // ==========================================
    // CREATE ADMIN
    // ==========================================

    const admin = new Admin({
      username,

      password: hashedPassword,
    });

    await admin.save();

    console.log("Admin created successfully!");

    console.log("Username:", username);

    console.log("Password:", password);

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error creating admin:", error);

    process.exit(1);
  }
}

createAdmin();
