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
} from "../controllers/userControllers.js";

// import {
//   getUserInvestments,
// } from "../controllers/investmentControllers.js";

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
// router.post('/register', async (req, res) => {
//   console.log('Incoming registration data:', req.body);
//   await userReg(req, res);
// });
router.post("/login", userLogin);
router.route("/one-user/:username").get(authenticateUser, getUser);
router.route("/delete-user/:id").delete(authenticateUser, deleteUser);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.route("/update-user/:id").put(authenticateUser, updateUser);
router.route("/verify-email").post(verifyEmail);

//Document Routes
//User route to upload document
router.post("/document", uploadDocument.single("file"), postUserDocument);
//User route to get document
router.route("/document/:username").get(authenticateUser, getUserDocument);

//Investment Routes
// router.get("/user-investments/:username", getUserInvestments);

//Profile Routes
router.get("/profile/:currentUsername", getUserProfile);
router.put("/profile/:username", upload.single("profilePicture"), updateUserProfile);

// router.post("/payment", postTransaction)
// router.get("/transactions/:username", getTransaction)
// router.get("/transactions", getAllTransactions)

export default router;
