// importing all dependencies needed for our express server
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import fs from "fs";
import path from "path";
import httpStatus from "http-status";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swagger.js";
import bodyParser from "body-parser";
import colors from "colors";
import Userrouter from "./routes/userRoutes.js";
import Kycrouter from "./routes/kycRoutes.js";
import BusKycrouter from "./routes/busKycRoutes.js";
import Adminrouter from "./routes/adminRoutes.js";
import SubAccountrouter from "./routes/subAccountRoutes.js";
// import Contactrouter from "./routes/contactRoutes.js";
import Notificationrouter from "./routes/notificationRoutes.js";
import { dbConnection } from "./config/dbConnection.js";

// creating an instance of express
const app = express();

// load our environment variables from the .env
// 1. configure dotenv
dotenv.config();

// 2. destructure and call our environment variables from .env
const { PORT, NODE_ENV } = process.env;

// declare our servers's or express app general use
app.use(bodyParser.json());
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "https://gpay-frontend-lyart.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies if needed
  })
);

// app.use(
//   "/uploads",
//   express.static("uploads", {
//     setHeaders: (res) => {
//       res.set("Access-Control-Allow-Origin", "*"); // Allow image access
//     },
//   })
// );

app.use(helmet());

// give condition to use morgan
if (NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Swagger UI setup
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }", // Customization if needed
  })
);

// console.log(swaggerSpec)

app.get("/debug-files", (req, res) => {
  const routesPath = path.resolve("./src/routes/userRoutes.js"); // Adjust as needed
  try {
    // Log the resolved  path for debugging
    return `Resolved routes path: ${routesPath}`;
    console.log(`Resolved routes path: ${routesPath}`);
    const files = fs.readdirSync(routesPath);
    res.json({ files });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Routes folder not found", details: err.message });
  }
});

// specifying different routes for our server
app.get("/", (req, res) => {
  res.status(httpStatus.OK).json({
    status: "success",
    message: "Welcome to my organization server!",
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error", details: err.message });
});


// user base routes
app.use("/user", Userrouter);
app.use("/api/kyc", Kycrouter);
app.use("/api/kyc/bus", BusKycrouter);
app.use("/api/subaccounts", SubAccountrouter);
app.use("/admin", Adminrouter);
// app.use("/contact", Contactrouter);
app.use("/api", Notificationrouter);

//connecting to the database
dbConnection()
  .then(() => {
    console.log("Database connection established".bgMagenta);

    // setting a port for our server to listen on
    app.listen(PORT, () => {
      console.log(`Our sever is listening on ${PORT} in ${NODE_ENV}`.cyan);
      console.log(
        `Swagger docs available at http://localhost:${PORT}/api-docs`
      );
      // console.log("Swagger Spec (Live):", JSON.stringify(swaggerSpec, null, 2));
    });
  })
  .catch((error) => {
    console.error(`Database connection error: ${error}`);
  });
