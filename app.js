const express = require("express");
const app = express();
const cors = require("cors");

const auth = require("./routes/auth");
const carCategories = require("./routes/carcategories");
const cars = require("./routes/cars");

const ApiError = require("./utils/apiError");

const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
// const rateLimit = require('express-rate-limit');
const xss = require("xss-clean");
const { errorConverter, errorHandler } = require("./middleware/error");
// const mongoSanitize = require('express-mongo-sanitize');
// const hpp = require('hpp');
// const helmet = require('helmet');

// const errorHandler = require('./middleware/error');

require("dotenv").config();
connectDB();
// Set security headers
// app.use(helmet());
// Prevent XSS attacks
app.use(xss());
// Rate limiting
// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 mins
//   max: 100
// });
// app.use(limiter);

// Sanitize data
// app.use(mongoSanitize());

// Prevent http param pollution
// app.use(hpp());
// app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://lmstemplates.herokuapp.com",
      "http://192.168.236.97:3000",
      "http://137.184.57.123:3000",
      "http://irsa.edu.pk",
    ],

    credentials: true,
  })
);

// Cookie parser
app.use(cookieParser());

// app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.send("server is running");
});
// Body parser
app.use(express.json());

app.use("/api/v1/auth", auth);
app.use("/api/v1/cars", cars);
app.use("/api/v1/categories", carCategories);
app.use((req, res, next) => {
  next(new ApiError(404, "Not found"));
});
// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
