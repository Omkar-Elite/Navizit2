import mysql from 'mysql2';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const port = process.env.PORT || 3001; // Use the PORT environment variable provided by Render

// Middleware
app.use(cors());
app.use(express.json());

// MySQL database connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST, // Replace with your MySQL host
  user: process.env.DB_USER, // Replace with your MySQL username
  password: process.env.DB_PASSWORD, // Replace with your MySQL password
  database: process.env.DB_NAME, // Replace with your MySQL database name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use another service if you like
  auth: {
    user: process.env.EMAIL_USER, // Replace with your email from environment variable
    pass: process.env.EMAIL_PASS, // Replace with your email password or app password from environment variable
  },
});

let otpStore = {}; // Temporary storage for OTPs

// Endpoint to fetch reviews
app.get("/api/reviews", (req, res) => {
  db.query("SELECT * FROM reviews", (error, results) => {
    if (error) {
      console.error("Error fetching reviews from MySQL:", error);
      return res.status(500).send("Error fetching reviews");
    }
    res.json(results);
  });
});

// Endpoint to submit a review
app.post('/api/reviews', (req, res) => {
  const { rating, comment, webname, username, initial } = req.body; // Include username
  db.query("INSERT INTO reviews (rating, comment, placeId, username, initial) VALUES (?, ?, ?, ?, ?)", 
           [rating, comment, webname, username, initial], 
           
           (error) => {
    if (error) {
      console.log(webname);
      console.log("Error inserting review into MySQL:", error);
      return res.status(500).send("Error inserting review");
    }
    res.status(201).send("Review added successfully");
  });
});

// Endpoint for user signup
app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  otpStore[email] = otp; // Store OTP temporarily

  const mailOptions = {
    from: process.env.EMAIL_USER, // Use email from environment variable
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("OTP sent to your email.");
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).send("Error sending OTP");
  }
});

// Endpoint for verifying OTP and signing up user
app.post("/api/verify-otp", (req, res) => {
  const { email, otp, username, password } = req.body;

  if (otpStore[email] === otp) {
    db.query(
      "INSERT INTO user (username, email, password) VALUES (?, ?, ?)",
      [username, email, password],
      (error) => {
        if (error) {
          console.log("Error signing up user:", error);
          return res.status(500).send("Error signing up user");
        }
        delete otpStore[email]; // Clear the OTP
        res.status(201).send("User signed up successfully");
      }
    );
  } else {
    res.status(400).send("Invalid OTP");
  }
});

// Endpoint for user login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM user WHERE email = ? AND password = ?",
    [email, password],
    (error, results) => {
      if (error) {
        console.log("Error logging in user:", error);
        return res.status(500).send("Error logging in user");
      }
      if (results.length > 0) {
        res.status(200).json({ user: results[0] });
      } else {
        res.status(400).send("Invalid email or password");
      }
    }
  );
});

// Listen on 0.0.0.0 to make it accessible externally
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
