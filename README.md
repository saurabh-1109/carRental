# 🚗 Car Rental Website

A full-stack **Car Rental Web Application** built using **React, Node.js, Express.js, and MongoDB**. Users can browse available cars, view car details, create bookings, and manage their bookings. An admin panel is also included to manage cars and bookings.

## ✨ Features

### 👤 User Features

* User Registration and Login
* Browse available cars
* Search and filter cars
* Filter cars by brand and price
* View car details
* Book a car
* Select pickup and return dates
* Automatic calculation of rental days and total amount
* View booking history
* Cancel bookings
* Responsive user interface

### 🔐 Admin Features

* Admin Login
* Admin Dashboard
* View total cars
* View available/unavailable cars
* View total bookings
* View pending and confirmed bookings
* View revenue
* Add new cars
* Edit car details
* Delete cars
* Change car availability
* Manage booking status

## 🛠️ Technologies Used

### Frontend

* React.js
* React Router
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js
* REST API

### Database

* MongoDB
* Mongoose

### Other Tools

* Git
* GitHub
* VS Code
* npm

## 📁 Project Structure

```text
carRental/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── assets/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

> The folder structure may vary depending on the final project setup.

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Go to the project directory

```bash
cd carRental
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Install backend dependencies

Open another terminal:

```bash
cd backend
npm install
```

## 🔑 Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Replace the MongoDB connection string with your own MongoDB database URL.

**Do not upload your `.env` file to GitHub.**

Add this to `.gitignore`:

```text
node_modules/
.env
```

## ▶️ Running the Project

### Start the Backend

```bash
cd backend
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### Start the Frontend

Open another terminal:

```bash
cd frontend
npm start
```

The frontend will run on the URL shown by your React development server, commonly:

```text
http://localhost:5173
```

## 🔗 API Endpoints

### Cars

| Method | Endpoint        | Description     |
| ------ | --------------- | --------------- |
| GET    | `/api/cars`     | Get all cars    |
| GET    | `/api/cars/:id` | Get a car by ID |
| POST   | `/api/cars`     | Add a new car   |
| PUT    | `/api/cars/:id` | Update a car    |
| DELETE | `/api/cars/:id` | Delete a car    |

### Bookings

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/bookings`     | Get all bookings  |
| GET    | `/api/bookings/:id` | Get booking by ID |
| POST   | `/api/bookings`     | Create a booking  |
| PUT    | `/api/bookings/:id` | Update booking    |
| DELETE | `/api/bookings/:id` | Delete booking    |

## 🗄️ Database

The application uses **MongoDB** to store:

* User information
* Car information
* Booking information

Mongoose is used to define schemas and communicate with MongoDB.

## 🔒 Security

* Environment variables are used for sensitive configuration.
* `.env` is excluded from GitHub.
* Admin and user functionality are separated.
* API requests are handled through the Express backend.

## 🚀 Future Improvements

* Online payment integration
* Email confirmation for bookings
* JWT authentication
* Password hashing
* Advanced car search
* Location-based car search
* Customer reviews and ratings
* Deployment using services such as Render, Vercel, or Railway

## 👨‍💻 Author

**Saurabh Jha**

BCA Student | Full-Stack Web Development

## 📄 License

This project is created for educational and portfolio purposes.
