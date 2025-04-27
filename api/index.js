console.log("Welcome to BlogTales");
const dotenv = require("dotenv");
dotenv.config(); 
const express = require("express");
const cors = require("cors");
const path=require('path')
const { connectDB } = require("./db/connect");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const authenticate = require("./middlewares/auth");
const authorizeRole = require("./middlewares/authorize");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");



const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./tmp", "../tmp")));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/user', authenticate, userRouter);
app.use('/api/admin', authenticate, authorizeRole("admin"), adminRouter);

// 404 and Error Middlewares
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
};

start();
