import User from "../models/userModel.js";

export const getSubAccountsByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    // Look for business user by busName
    const user = await User.findOne({ busName: username, role: "business" });

    if (!user) {
      return res.status(404).json({ message: "Business user not found" });
    }

    const subAccounts = user.subAccounts || [];

    const businessKycStatus = user.businesskyc?.status || "not_started";

    const response = subAccounts.map((account) => ({
      subaccountId: account._id,
      subName: account.subName,
      businessType: account.businessType,
      industry: account.industry,
      subEmail: account.subEmail,
      subPass: account.subPass,
      // kycStatus: account.status,
      busKycStatus: businessKycStatus,
      method: "Wallet",
      type: "Business",
      amount: "₦0", // Placeholder — update if you have actual balances
      description: `Subaccount for ${account.subName}`,
      createdAt: account.createdAt,
      status: account.status,
    }));

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching subaccounts:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateSubAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { subName, subPass } = req.body;

    const user = await User.findOneAndUpdate(
      { "subAccounts._id": id },
      {
        $set: {
          "subAccounts.$.subName": subName,
          "subAccounts.$.subPass": subPass,
        },
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "Subaccount not found" });
    res.status(200).json({ message: "Subaccount updated successfully" });
  } catch (error) {
    console.error("Update failed", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
