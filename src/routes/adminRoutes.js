import express from "express";
import { authenticateAdmin } from "../middlewares/authenticate.js";

import {
  adminReg,
  adminLogin,
  getAdmins,
  deleteAdmin,
  updateAdmin,
  getAdmin,
} from "../controllers/adminControllers.js";

const router = express.Router();

//Admins Routes
router.post("/register", adminReg);
router.post("/login", adminLogin);
router.route("/all-admins").get(authenticateAdmin, getAdmins);
router.route("/one-admin/:username").get(authenticateAdmin, getAdmin);
router.route("/delete-admin/:id").delete(authenticateAdmin, deleteAdmin);
router.route("/admin/:id").put(authenticateAdmin, updateAdmin);

//Users Routes
// router.route("/all-users").get(authenticateAdmin, getUsers);
// router.route("/delete-user/:id").delete(authenticateAdmin, deleteUser);

// //Document Routes
// router.post("/document", uploadDocument.single("file"), postAdminDocument);
// router.route("/all-documents").get(getAllUserDocument);
// router.route("/one-document/:username").get(getUserDocument);

// //Investment Scheme Routes
// router.post("/investmentscheme", createInvestmentScheme);
// router.get("/all-investmentscheme", getAllInvestmentSchemes);
// router.get("/one-investmentscheme/:id", getInvestmentSchemeById);
// router.put("/update-invesmentscheme/:id", updateInvestmentScheme);
// router.delete("/delete-invesmentscheme/:id", deleteInvestmentScheme);

// //Property Routes
// router.post("/properties", uploadProperty.array("images", 5), addProperty);
// router.get("/all-properties", getAllProperties);
// router.get("/property/:id", getPropertyById);
// router.put("/update-property/:id", updateProperty);
// router.delete("/delete-property/:id", deleteProperty);

// //Email Routes
// router.post("/forgot-password", requestPasswordReset);
// router.post("/reset-password", resetPassword);
// router.route("/verify-email").post(verifyEmail);

// // Investment Routes
// router.post("/add-property-investment", addPropertyInvestment);
// router.post("/add-investment-scheme", addInvestmentScheme);
// router.get("/all-investments", getAllInvestments);

// // Transaction Routes
// router.post("/admin-transaction", authenticateAdmin, postAdminTransaction);

// //Notification Routes

// router.post("/admin-notification",  postNotification);
// router.get("/notification/:username",  getNotification);
// router.get("/notification",  getNotifications);



export default router;
