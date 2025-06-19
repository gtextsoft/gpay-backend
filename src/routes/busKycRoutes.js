import express from "express";
import { uploadBusKyc, uploadSubBusKyc } from "../middlewares/upload.js";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middlewares/authenticate.js";
import User from "../models/userModel.js";
import { sendRejectionEmail } from "../services/emailService.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post(
  "/submit",
  authenticateUser,
  uploadBusKyc.fields([
    { name: "passportFile" },
    { name: "proofOfAddress" },
    { name: "certificateIncorporation" },
  ]),
  async (req, res) => {
    try {
      console.log("req.body:", req.body);
      console.log("req.files:", req.files);
      console.log("Content-Type:", req.headers["content-type"]);

      const userId = req.user._id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const {
        regNum,
        businessType,
        industry,
        companySize,
        countryReg,
        dateEstablished,
        address,
        city,
        state,
        country,
        postal,
        purposeAcc,
        source,
        inflow,
      } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const kycUsername =
        user.role === "business" ? user.busName : user.username;
      const kycLastname =
        user.role === "business" ? user.busLastName : user.lastname;

      const certificateIncorporation =
        req.files?.certificateIncorporation?.[0]?.path || null;
      const passportFile = req.files?.passportFile?.[0]?.path || null;
      const proofOfAddress = req.files?.proofOfAddress?.[0]?.path || null;

      const parsedNumber = regNum ? Number(regNum) : undefined;

      const parsedDOB = dateEstablished
        ? new Date(dateEstablished)
        : user.businesskyc?.dateEstablished;
      const parsedPostal = postal ? Number(postal) : undefined;
      // const parsedBvn = bvn ? Number(bvn) : undefined;
      const parsedInflow = inflow ? Number(inflow) : undefined;

      // Validate data types
      if (regNum && isNaN(parsedNumber)) {
        return res.status(400).json({ error: "Invalid number field" });
      }
      if (dateEstablished && isNaN(parsedDOB.getTime())) {
        return res.status(400).json({ error: "Invalid dateEstablished" });
      }
      if (postal && isNaN(parsedPostal)) {
        return res.status(400).json({ error: "Invalid postal code" });
      }
      if (inflow && isNaN(parsedInflow)) {
        return res.status(400).json({ error: "Invalid inflow amount" });
      }

      // Safely merge KYC object
      const existingKyc = user.businesskyc || {};
      user.businesskyc = {
        ...existingKyc,
        busName: kycUsername,
        email: user.email,
        regNum,
        businessType,
        industry,
        companySize,
        countryReg,
        dateEstablished: parsedDOB,
        address,
        city,
        country,
        state,
        postal: parsedPostal,
        passportFile: passportFile || existingKyc.passportFile,
        purposeAcc,
        source,
        inflow: parsedInflow,
        certificateIncorporation:
          certificateIncorporation || existingKyc.certificateIncorporation,
        proofOfAddress: proofOfAddress || existingKyc.proofOfAddress,
        status: "in_review",
      };

      await user.save();

      res.status(200).json({ message: "Business KYC submitted successfully." });
    } catch (err) {
      console.error(
        "Business KYC submission error:",
        JSON.stringify(err, null, 2)
      );

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
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const businesskyc = user.businesskyc || {};
    const status = businesskyc.status || "not_started";

    res.status(200).json({
      status,
      rejectionReason: businesskyc.rejectionReason || "",
      steps: businesskyc.steps || {}, // Include this if you track step state
      // data: kyc.data || {},         // Form data per step
      currentStep: businesskyc.currentStep || 1,
    });
  } catch (err) {
    console.error("Error in GET /status:", err);
    res.status(500).json({ error: "Could not fetch Business KYC status" });
  }
});

router.get("/review", authenticateAdmin, async (req, res) => {
  try {
    console.log("Fetching users with Buisness KYC status 'in_review'");
    const pendingUsers = await User.find({ "businesskyc.status": "in_review" });
    console.log("Found pendingUsers:", pendingUsers.length);
    if (pendingUsers.length === 0) {
      const allUsers = await User.find({});
      console.log(
        "Here’s a sample Business KYC status:",
        allUsers[0]?.businesskyc?.status
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
    if (!user || !user.businesskyc)
      return res.status(404).json({ error: "User or KYC not found" });

    console.log("Business and  KYC found. Returning KYC data.");
    res.status(200).json(user.businesskyc);
  } catch (err) {
    console.error("Error fetching business KYC:", err);
    res.status(500).json({ error: "Failed to fetch KYC data" });
  }
});

router.post("/approve/:userId", authenticateAdmin, async (req, res) => {
  console.log("HIT /approve/:userId", req.params.userId);
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.businesskyc)
      return res.status(404).json({ error: "Business or KYC not found" });

    console.log("User KYC status before:", user.businesskyc?.status);
    // user.businesskyc.status = "approved";
    // await user.save();

    user.businesskyc.status = "approved";
    user.markModified("businesskyc");
    await user.save();
    console.log("Saved user after approval:", user.businesskyc.status);

    res.status(200).json({ message: "Business KYC approved" });
  } catch (err) {
    res.status(500).json({ error: "Error approving business KYC" });
  }
});

// Reject user KYC
router.post("/reject/:userId", authenticateAdmin, async (req, res) => {
  console.log("HIT /reject/:userId", req.params.userId);
  try {
    const { userId } = req.params;
    const { rejectionReason } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("User KYC status before:", user.businesskyc?.status);
    // user.businesskyc.status = "rejected";
    // user.businesskyc.rejectionReason = rejectionReason;
    // await user.save();

    user.businesskyc.status = "rejected";
    user.businesskyc.rejectionReason = rejectionReason;
    user.markModified("businesskyc");
    await user.save();
    console.log("Saved user after approval:", user.businesskyc.status);

    // Send email notification to the user
    await sendRejectionEmail(user.email, user.busName, rejectionReason);

    res
      .status(200)
      .json({ message: "Business KYC rejected with reason and email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Sub accounts
router.post(
  "/sub/submit",
  authenticateUser,
  uploadSubBusKyc.fields([{ name: "proofOfAddress" }]),
  async (req, res) => {
    try {
      const businessId = req.user._id; // from auth middleware
      const {
        subName,
        businessType,
        industry,
        idType,
        idNum,
        idCountry,
        idLevel,
        subPhone,
        subEmail,
        address,
        city,
        state,
        country,
        postal,
        subPass,
      } = req.body;

      const proofOfAddress = req.files?.proofOfAddress?.[0]?.path || null;

      const hashedSubPass = await bcrypt.hash(subPass, 10); // Hash the sub account password

      const newSub = {
        subId: businessId,
        subName,
        businessType,
        industry,
        idType,
        idNum,
        idCountry,
        idLevel,
        subPhone,
        subEmail,
        subPass: hashedSubPass, // Save hashed password
        address,
        city,
        state,
        country,
        postal,
        proofOfAddress,
      };

      const user = await User.findById(businessId);
      if (!user || user.role !== "business") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      user.subAccounts.push(newSub);
      await user.save();

      res
        .status(200)
        .json({ message: "Sub account created", subAccount: newSub });
    } catch (err) {
      console.error("SubAccount Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// /api/kyc/admin/update/:userId
export default router;
