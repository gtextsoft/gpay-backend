// import User from "../models/User.js";

// export const saveKycStep = async (req, res) => {
//   const { step } = req.params;
//   const userId = req.user._id; // Ensure authentication middleware adds this

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (step === "5") {
//       const { passportScan, utilityBill } = req.files;
//       user.kyc.step5 = {
//         passportScanUrl: passportScan[0]?.path,
//         utilityBillUrl: utilityBill[0]?.path,
//       };
//     } else {
//       user.kyc[`step${step}`] = req.body;
//     }

//     if (step === "6") {
//       user.kyc.status = "in_review";
//     } else {
//       user.kyc.status = "in_progress";
//     }

//     await user.save();
//     res.json({ message: `KYC step ${step} saved` });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const getKycDetailsForAdmin = async (req, res) => {
//   try {
//     const users = await User.find({ "kyc.status": { $in: ["in_progress", "in_review", "approved"] } });
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch KYC data" });
//   }
// };

import User from "../models/userModel.js";

export const saveKycStep = async (req, res) => {
  const { step } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (step === "5") {
      const passportScan = req.files?.passportScan?.[0]?.path || null;
      const utilityBill = req.files?.utilityBill?.[0]?.path || null;

      user.kyc.step5 = {
        passportScanUrl: passportScan,
        utilityBillUrl: utilityBill,
      };
    } else {
      user.kyc[`step${step}`] = req.body;
    }

    user.kyc.status = step === "6" ? "in_review" : "in_progress";
    await user.save();

    res.json({ message: `KYC step ${step} saved successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getKycDetailsForAdmin = async (req, res) => {
  try {
    const users = await User.find({
      "kyc.status": { $in: ["in_progress", "in_review", "approved"] },
    }).select("email kyc");
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch KYC data", error: err.message });
  }
};
