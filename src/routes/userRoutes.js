import express from "express";
import {
  userReg,
  userLogin,
  getUsers,
  deleteUser,
  requestPasswordReset,
  resetPassword,
  updateUser,
  updateUserProfile,
  getUser,
  verifyEmail,
  getUserProfile,
  businessReg,
  updateUserBusProfile,
  getUserBusProfile
} from "../controllers/userControllers.js";

import { authenticateUser } from "../middlewares/authenticate.js";
import { upload, uploadDocument } from "../middlewares/upload.js"; // Import Cloudinary setup

import {
  postUserDocument,
  getUserDocument,
} from "../controllers/documentControllers.js";

// import {
//   postTransaction,
//   getTransaction,
//   postAdminTransaction,
//   getAllTransactions
// } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/register", userReg);
router.post("/business-register", businessReg);
router.post("/login", userLogin);
// router.route("/one-user/:username").get(authenticateUser, getUser);
router.route("/one-user/:identifier").get(authenticateUser, getUser);
router.route("/delete-user/:id").delete(authenticateUser, deleteUser);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.route("/update-user/:id").put(authenticateUser, updateUser);
router.route("/verify-email").post(verifyEmail);

//Profile Routes
router.get("/profile/:currentUsername", getUserProfile);
router.put("/profile/:username", upload.single("profilePicture"), updateUserProfile);
router.get("/bus/profile/:currentUsername", getUserBusProfile);
router.put("/bus/profile/:busName", upload.single("profilePicture"), updateUserBusProfile);


//Document Routes
//User route to upload document
router.post("/document", uploadDocument.single("file"), postUserDocument);
//User route to get document
router.route("/document/:username").get(authenticateUser, getUserDocument);

//Transaction Routes
// router.post("/payment", postTransaction)
// router.get("/transactions/:username", getTransaction)
// router.get("/transactions", getAllTransactions)

export default router;
