const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ==========================================
// IMPORT USER MODEL
// ==========================================
const UserData = require("./models/userData");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const PORT = 5000;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// USER / admin  ROUTES
// ==========================================

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
  .connect("mongodb://127.0.0.1:27017/carRental")
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// ==========================================
// CAR SCHEMA
// ==========================================

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    availability: {
      type: Boolean,
      default: true,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Car = mongoose.model("Car", carSchema);

// ==========================================
// BOOKING SCHEMA
// ==========================================

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "",
    },

    mobile: {
      type: String,
      default: "",
    },

    carId: {
      type: String,
      required: true,
    },

    carName: {
      type: String,
      required: true,
    },

    pricePerDay: {
      type: Number,
      required: true,
    },

    pickupDate: {
      type: String,
      required: true,
    },

    returnDate: {
      type: String,
      required: true,
    },

    days: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      default: "not-paid",
    },

    bookingStatus: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const Booking = mongoose.model("Booking", bookingSchema);

// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {
  res.send("Car Rental Backend is running!");
});

// ==================================================
// CAR ROUTES
// ==================================================

// ==========================================
// GET ALL CARS
// ==========================================

app.get("/api/cars", async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });

    res.json(cars);
  } catch (error) {
    console.error("Get cars error:", error);

    res.status(500).json({
      message: "Failed to fetch cars",
      error: error.message,
    });
  }
});

// ==========================================
// GET ONE CAR
// ==========================================

app.get("/api/cars/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    res.json(car);
  } catch (error) {
    console.error("Get car error:", error);

    res.status(500).json({
      message: "Failed to fetch car",
      error: error.message,
    });
  }
});

// ==========================================
// ADD CAR
// ==========================================

app.post("/api/cars", async (req, res) => {
  try {
    const { name, price, availability, image } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Name and price are required",
      });
    }

    const newCar = new Car({
      name,
      price: Number(price),

      availability: availability !== undefined ? availability : true,

      image: image || "",
    });

    const savedCar = await newCar.save();

    res.status(201).json({
      message: "Car added successfully",
      car: savedCar,
    });
  } catch (error) {
    console.error("Add car error:", error);

    res.status(500).json({
      message: "Failed to add car",
      error: error.message,
    });
  }
});

// ==========================================
// UPDATE CAR
// ==========================================

app.put("/api/cars/:id", async (req, res) => {
  try {
    const { name, price, availability, image } = req.body;

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price: Number(price),
        availability,
        image,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedCar) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    res.json({
      message: "Car updated successfully",
      car: updatedCar,
    });
  } catch (error) {
    console.error("Update car error:", error);

    res.status(500).json({
      message: "Failed to update car",
      error: error.message,
    });
  }
});

// ==========================================
// DELETE CAR
// ==========================================

app.delete("/api/cars/:id", async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);

    if (!deletedCar) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    res.json({
      message: "Car deleted successfully",
    });
  } catch (error) {
    console.error("Delete car error:", error);

    res.status(500).json({
      message: "Failed to delete car",
      error: error.message,
    });
  }
});

// ==================================================
// BOOKING ROUTES
// ==================================================

// ==========================================
// GET ALL BOOKINGS
// ==========================================

app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);

    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
});

// ==========================================
// GET ONE BOOKING
// ==========================================

app.get("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json(booking);
  } catch (error) {
    console.error("Get booking error:", error);

    res.status(500).json({
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
});

// ==========================================
// CREATE BOOKING
// ==========================================

app.post("/api/bookings", async (req, res) => {
  try {
    const {
      customerName,
      email,
      location,
      mobile,
      carId,
      carName,
      pricePerDay,
      pickupDate,
      returnDate,
      days,
      totalAmount,
      paymentStatus,
      bookingStatus,
    } = req.body;

    const newBooking = new Booking({
      customerName,
      email,
      location,
      mobile,

      carId,
      carName,

      pricePerDay: Number(pricePerDay),

      pickupDate,
      returnDate,

      days: Number(days),

      totalAmount: Number(totalAmount),

      paymentStatus: paymentStatus || "not-paid",

      bookingStatus: bookingStatus || "pending",
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",

      booking: savedBooking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    res.status(500).json({
      message: "Failed to create booking",

      error: error.message,
    });
  }
});

// ==========================================
// UPDATE BOOKING
// ==========================================

app.put("/api/bookings/:id", async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedBooking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json({
      message: "Booking updated successfully",

      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update booking error:", error);

    res.status(500).json({
      message: "Failed to update booking",

      error: error.message,
    });
  }
});

// ==========================================
// DELETE BOOKING
// ==========================================

app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

    if (!deletedBooking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Delete booking error:", error);

    res.status(500).json({
      message: "Failed to delete booking",

      error: error.message,
    });
  }
});

// ==================================================
// SIGNUP
// ==================================================

app.post("/api/signup", async (req, res) => {
  try {
    const { name, location, email, password } = req.body;

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!name || !location || !email || !password) {
      return res.status(400).json({
        success: false,

        message: "All fields are required",
      });
    }

    // ------------------------------------------
    // CHECK EXISTING USER
    // ------------------------------------------

    const existingUser = await UserData.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,

        message: "Email already registered",
      });
    }

    // ------------------------------------------
    // CREATE USER
    // ------------------------------------------

    const newUser = new UserData({
      name,

      location,

      email: email.toLowerCase(),

      password,
    });

    // ------------------------------------------
    // SAVE USER
    // ------------------------------------------

    await newUser.save();

    // ------------------------------------------
    // RESPONSE
    // ------------------------------------------

    res.status(201).json({
      success: true,

      message: "Signup successful",

      user: {
        _id: newUser._id,
        name: newUser.name,
        location: newUser.location,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      success: false,

      message: "Failed to create account",

      error: error.message,
    });
  }
});

// ==================================================
// LOGIN
// ==================================================

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,

        message: "Email and password are required",
      });
    }

    // ------------------------------------------
    // FIND USER
    // ------------------------------------------

    const user = await UserData.findOne({
      email: email.toLowerCase(),
    });

    // ------------------------------------------
    // USER NOT FOUND
    // ------------------------------------------

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "Data not found",
      });
    }

    // ------------------------------------------
    // PASSWORD CHECK
    // ------------------------------------------

    if (user.password !== password) {
      return res.status(401).json({
        success: false,

        message: "Data not found",
      });
    }

    // ------------------------------------------
    // LOGIN SUCCESS
    // ------------------------------------------

    res.status(200).json({
      success: true,

      message: "Login successful",

      user: {
        _id: user._id,

        name: user.name,

        email: user.email,

        location: user.location,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,

      message: "Login failed",

      error: error.message,
    });
  }
});
