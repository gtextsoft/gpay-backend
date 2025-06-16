import mongoose from "mongoose";

const SubAccountSchema = new mongoose.Schema({
    subId: { type: String, required: true },
    subName: { type: String, required: true },
    businessType: {
      type: String,
      enum: [/*...*/],
    },
    industry: String,
    idType: {
      type: String,
      enum: ["nin", "votersCard", "driver"],
    },
    idNum: String,
    idCountry: String,
    idLevel: {
      type: String,
      enum: ["primary", "secondary"],
    },
    proofOfAddress: String,
    subPhone: String,
    subEmail: String,
    address: String,
    city: String,
    state: String,
    country: String,
    postal: String,
    subPass: String,
    status: String,

      // ✅ New fields:
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
  }, { timestamps: true });
  

  export default SubAccountSchema