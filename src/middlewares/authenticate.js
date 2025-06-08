
// import jwt from "jsonwebtoken";
// import httpStatus from "http-status";
// // import Admin from "../models/adminModel.js";

// export const authenticate = async (req, res, next) => {
//   try {
//     // Extract the token from the Authorization header
//     const token = req.header("Authorization")?.replace("Bearer ", "");
    
//     if (!token) {
//       return res.status(httpStatus.UNAUTHORIZED).json({
//         status: "error",
//         message: "No token provided!",
//       });
//     }

//     // Verify the token and decode the payload
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Find the admin in the database
//     // const admin = await Admin.findOne({ email: decoded.email });

//     // if (!admin) {
//     //   return res.status(httpStatus.FORBIDDEN).json({
//     //     status: "error",
//     //     message: "Admin not found",
//     //   });
//     // }

//     // // Attach admin details to req.user
//     // req.user = { username: admin.username, email: admin.email };

//     next(); // ✅ Proceed to the next middleware
//   } catch (error) {
//     return res.status(httpStatus.UNAUTHORIZED).json({
//       status: "error",
//       message: "Invalid or expired token",
//     });
//   }
// };


import jwt from "jsonwebtoken";
import httpStatus from "http-status";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        status: "error",
        message: "No token provided!",
      });
    }

    // Decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to the request
    // req.user = decoded;

    next();
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
};

export const authenticateUser = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        status: "error",
        message: "No token provided!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded payload (should include user ID and role)

    next();
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
};

export const authenticateAdmin = (req, res, next) => {
  try {
    console.log("Admin auth middleware hit");
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Received token:", token); // Log this

    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        status: "error",
        message: "No token provided!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Log this

    if (decoded.role !== "admin") {
      return res.status(httpStatus.FORBIDDEN).json({
        status: "error",
        message: "Access denied. Admins only.",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(httpStatus.UNAUTHORIZED).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
};


// export const authenticateAdmin = (req, res, next) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//       return res.status(httpStatus.UNAUTHORIZED).json({
//         status: "error",
//         message: "No token provided!",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (decoded.role !== "admin") {
//       return res.status(httpStatus.FORBIDDEN).json({
//         status: "error",
//         message: "Access denied. Admins only.",
//       });
//     }

//     req.user = decoded;

//     next();
//   } catch (error) {
//     return res.status(httpStatus.UNAUTHORIZED).json({
//       status: "error",
//       message: "Invalid or expired token",
//     });
//   }
// };
