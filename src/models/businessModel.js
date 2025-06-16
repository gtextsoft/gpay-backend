import mongoose from "mongoose";

const BusinessKycSchema = new mongoose.Schema({
    busName: { type: String, required: true },
    email: { type: String, required: true },
    regNum: { type: Number, required: true },
    businessType: {
      type: String,
      enum: [/*...*/],
      required: true,
    },
    industry: String,
    companySize: {
      type: String,
      enum: ["1-10", "11-50", "51-100", "101-200", "201-500", "500"],
    },
    countryReg: String,
    dateEstablished: Date,
    address: String,
    city: String,
    state: String,
    country: String,
    postal: Number,
    passportFile: String,
    purposeAcc: {
      type: String,
      enum: ["personal", "business", "freelancing"],
    },
    source: {
      type: String,
      enum: ["salary", "business-revenue", "gift", "investment"],
    },
    inflow: Number,
    certificateIncorporation: String,
    proofOfAddress: String,
    status: {
      type: String,
      enum: ["not_started", "in_progress", "in_review", "approved", "rejected"],
      default: "not_started",
    },
    rejectionReason: { type: String, default: "" },
    
  }, { timestamps: true });
  
  export default BusinessKycSchema