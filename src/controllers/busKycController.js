import User from "../models/userModel.js";

export const saveKycStep = async (req, res) => {
  const { step } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (step === "4") {
      const certificateIncorporation =
        req.files?.certificateIncorporation?.[0]?.path || null;
      const passportScan = req.files?.passportScan?.[0]?.path || null;
      const proofAddress = req.files?.proofAddress?.[0]?.path || null;

      user.businesskyc.step4 = {
        certificateIncorporationUrl: certificateIncorporation,
        passportScanUrl: passportScan,
        proofAddressUrl: proofAddress,
      };
    } else {
      user.businesskyc[`step${step}`] = req.body;
    }

    user.businesskyc.status = step === "5" ? "in_review" : "in_progress";
    // user.businesskyc[`step${step}`] = Object.fromEntries(
    //   Object.entries(req.body).map(([key, val]) => [key, val?.trim?.() || val])
    // );
    
    await user.save();

    res.json({ message: `Business KYC step ${step} saved successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getKycDetailsForAdmin = async (req, res) => {
  try {
    const users = await User.find({
      "businesskyc.status": { $in: ["in_progress", "in_review", "approved"] },
    }).select("email businesskyc");

    // const users = await User.find({
    //   "businesskyc.status": { $in: ["in_progress", "in_review", "approved"] },
    // }).select("email businesskyc").lean();
    

    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch KYC data", error: err.message });
  }
};

