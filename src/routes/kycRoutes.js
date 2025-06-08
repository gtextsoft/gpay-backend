import express from "express";
import { uploadKyc } from "../middlewares/upload.js";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middlewares/authenticate.js";
import User from "../models/userModel.js";
import {sendRejectionEmail } from "../services/emailService.js";

const router = express.Router();

router.post(
  "/submit",
  authenticateUser,
  uploadKyc.fields([{ name: "passportFile" }, { name: "proofOfAddress" }]),
  async (req, res) => {
    try {
      console.log("req.body:", req.body);
      console.log("req.files:", req.files);
      console.log("Content-Type:", req.headers["content-type"]);

      const userId = req.user.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const {
        number,
        dateOfBirth,
        passportNumber,
        passportCountry,
        id,
        idNum,
        idCountry,
        bvn,
        country,
        state,
        city,
        address,
        postal,
        occupation,
        employmentStatus,
        purposeAcc,
        source,
        inflow,
      } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const kycUsername =
        user.role === "individual" ? user.username : user.busName;
      const kycLastname =
        user.role === "individual" ? user.lastname : user.busLastName;

      const passportFile = req.files?.passportFile?.[0]?.path || null;
      const proofOfAddress = req.files?.proofOfAddress?.[0]?.path || null;

      if (!passportNumber || !id || !idNum) {
        return res.status(400).json({ error: "Missing required KYC fields" });
      }

      const parsedNumber = number ? Number(number) : undefined;
      const parsedDOB = dateOfBirth
        ? new Date(dateOfBirth)
        : user.kyc?.dateOfBirth;
      const parsedPostal = postal ? Number(postal) : undefined;
      const parsedBvn = bvn ? Number(bvn) : undefined;
      const parsedInflow = inflow ? Number(inflow) : undefined;

      // Validate data types
      if (number && isNaN(parsedNumber)) {
        return res.status(400).json({ error: "Invalid number field" });
      }
      if (dateOfBirth && isNaN(parsedDOB.getTime())) {
        return res.status(400).json({ error: "Invalid dateOfBirth" });
      }
      if (postal && isNaN(parsedPostal)) {
        return res.status(400).json({ error: "Invalid postal code" });
      }
      if (bvn && isNaN(parsedBvn)) {
        return res.status(400).json({ error: "Invalid BVN" });
      }
      if (inflow && isNaN(parsedInflow)) {
        return res.status(400).json({ error: "Invalid inflow amount" });
      }

      // Safely merge KYC object
      const existingKyc = user.kyc || {};
      user.kyc = {
        ...existingKyc,
        username: kycUsername,
        lastname: kycLastname,
        email: user.email,
        number: number || user.phoneNumber,
        dateOfBirth: parsedDOB,
        passportNumber,
        passportCountry,
        id,
        idNum,
        idCountry,
        bvn: parsedBvn,
        country,
        state,
        city,
        address,
        postal: parsedPostal,
        occupation,
        employmentStatus,
        purposeAcc,
        source,
        inflow: parsedInflow,
        passportFile: passportFile || existingKyc.passportFile,
        proofOfAddress: proofOfAddress || existingKyc.proofOfAddress,
        status: "in_review",
      };

      await user.save();

      res.status(200).json({ message: "KYC submitted successfully." });
    } catch (err) {
      console.error("KYC submission error:", JSON.stringify(err, null, 2));

      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({ error: "Validation error", details: err.errors });
      }
      if (err.code === 11000) {
        return res
          .status(400)
          .json({ error: "Duplicate key error", details: err.keyValue });
      }

      res.status(500).json({
        error: "Server error",
        details: err.message || err.toString(),
      });
    }
  }
);

router.get("/status", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const kyc = user.kyc || {};
    const status = kyc.status || "not_started";

    res.status(200).json({
      status,
      rejectionReason: kyc.rejectionReason || "",
      steps: kyc.steps || {},       // Include this if you track step state
      // data: kyc.data || {},         // Form data per step
      currentStep: kyc.currentStep || 1,
    });
  } catch (err) {
    console.error("Error in GET /status:", err);
    res.status(500).json({ error: "Could not fetch KYC status" });
  }
});

router.get("/review", authenticateAdmin, async (req, res) => {
  try {
    console.log("Fetching users with KYC status 'in_review'");
    const pendingUsers = await User.find({ "kyc.status": "in_review" });
    console.log("Found pendingUsers:", pendingUsers.length);
    if (pendingUsers.length === 0) {
      const allUsers = await User.find({});
      console.log(
        "Here’s a sample user’s KYC status:",
        allUsers[0]?.kyc?.status
      );
    }
    res.status(200).json(pendingUsers);
  } catch (err) {
    console.error("Error fetching KYC review users:", err);
    res.status(500).json({ error: "Failed to fetch KYC reviews" });
  }
});

router.get("/admin/:userId", authenticateAdmin, async (req, res) => {

  // console.log(req)
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.kyc)
      return res.status(404).json({ error: "User or KYC not found" });

    console.log("User and KYC found. Returning KYC data.");
    res.status(200).json(user.kyc);
  } catch (err) {
    console.error("Error fetching user KYC:", err);
    res.status(500).json({ error: "Failed to fetch KYC data" });
  }
});

router.post("/approve/:userId", authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.kyc)
      return res.status(404).json({ error: "User or KYC not found" });

    user.kyc.status = "approved";
    await user.save();

    res.status(200).json({ message: "User KYC approved" });
  } catch (err) {
    res.status(500).json({ error: "Error approving KYC" });
  }
});

// Reject user KYC
router.post("/reject/:userId", authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { rejectionReason } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.kyc.status = "rejected";
    // user.kyc.status = "not_started";
    user.kyc.rejectionReason = rejectionReason;
    await user.save();

    // Send email notification to the user
    await sendRejectionEmail(user.email, user.firstname, rejectionReason);


    res.status(200).json({ message: "KYC rejected with reason and email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// /api/kyc/admin/update/:userId
export default router;
