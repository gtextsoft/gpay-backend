import mongoose from "mongoose";
import BusinessKycSchema from "./businessModel.js";
import SubAccountSchema from "./subAccountModel.js";

// Define schema for user
const UserSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["individual", "business"], required: true },
    username: {
      type: String,
      required: function () {
        return this.role === "individual";
      },
    },
    lastname: {
      type: String,
      required: function () {
        return this.role === "individual";
      },
    },
    busName: {
      type: String,
      required: function () {
        return this.role === "business";
      },
    },
    busLastName: {
      type: String,
      required: function () {
        return this.role === "business";
      },
    },

    dateOfBirth: { type: Date },
    businessName: String,
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 5, maxlength: 70 },
    isVerified: { type: Boolean, default: false },
    profilePicture: { type: String },

    passwordResetToken: String,
    passwordResetExpires: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,

    phoneNumber: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"] },
    maritalStatus: { type: String, enum: ["Single", "Married"] },
    employmentStatus: {
      type: String,
      enum: ["employed", "selfEmployed", "unEmployed", "student"],
    },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    position: {
      type: String,
      required: function () {
        return this.role === "business";
      },
    },

    kyc: {
      type: new mongoose.Schema({
        username: String,
        lastname: String,
        number: { type: String },
        email: String,
        dateOfBirth: { type: Date },
        passportNumber: String,
        passportCountry: String,
        id: String,
        idNum: String,
        idCountry: String,
        bvn: Number,
        country: String,
        state: String,
        city: String,
        address: String,
        postal: Number,
        occupation: String,
        employmentStatus: {
          type: String,
          enum: ["employed", "selfEmployed", "unEmployed", "student"],
        },
        purposeAcc: {
          type: String,
          enum: ["personal", "business", "freelancing"],
        },
        source: {
          type: String,
          enum: ["salary", "business-revenue", "gift", "investment"],
        },
        inflow: Number,
        passportFile: String,
        proofOfAddress: String,
        status: {
          type: String,
          enum: [
            "not_started",
            "in_progress",
            "in_review",
            "approved",
            "rejected",
          ],
          default: "not_started",
        },
        rejectionReason: { type: String, default: "" },
      }),
      required: function () {
        return this.role === "individual";
      },
    },

    businesskyc: {
      type: BusinessKycSchema,
      required: function () {
        return this.role === "business";
      },
    },

    subAccounts: {
      type: [SubAccountSchema],
      default: [],
    },

    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
    transactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    ],
    notificationInvestments: [
      {
        update: String,
        title: String,
        description: String,
        read: { type: Boolean, default: false }, 
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("validate", function (next) {
  if (this.role !== "business" && this.subAccounts?.length > 0) {
    return next(new Error("Only business users can have subaccounts."));
  }
  next();
});

const User = mongoose.model("User", UserSchema);

// Export the user model
export default User;

// businesskyc: {
//   type: new mongoose.Schema({
//     busName: String,
//     email: String,
//     regNum: Number,
//     businessType: {
//       type: String,
//       enum: [
//         "soleProp",
//         "singleLLC",
//         "llc",
//         "genPart",
//         "publicTrade",
//         "unlist",
//         "association",
//         "nonProf",
//         "govtOrg",
//         "revTrust",
//         "irevTrust",
//         "estate",
//         "limitedPartnership",
//         "limLiabity",
//       ],
//     },
//     industry: String,
//     companySize: {
//       type: String,
//       enum: ["1-10", "11-50", "51-100", "101-200", "201-500", "500"],
//     },
//     countryReg: String,
//     dateEstablished: { type: Date },
//     address: String,
//     city: String,
//     state: String,
//     country: String,
//     postal: Number,
//     passportFile: String,
//     purposeAcc: {
//       type: String,
//       enum: ["personal", "business", "freelancing"],
//     },
//     source: {
//       type: String,
//       enum: ["salary", "business-revenue", "gift", "investment"],
//     },
//     inflow: Number,
//     certificateIncorporation: String,
//     proofOfAddress: String,
//     status: {
//       type: String,
//       enum: [
//         "not_started",
//         "in_progress",
//         "in_review",
//         "approved",
//         "rejected",
//       ],
//       default: "not_started",
//     },
//     rejectionReason: { type: String, default: "" },
//     subAccount: {
//       subId: { type: String, default: "" },
//       subName: { type: String, default: "" },
//       businessType: {
//         type: String,
//         enum: [
//           "soleProp",
//           "singleLLC",
//           "llc",
//           "genPart",
//           "publicTrade",
//           "unlist",
//           "association",
//           "nonProf",
//           "govtOrg",
//           "revTrust",
//           "irevTrust",
//           "estate",
//           "limitedPartnership",
//           "limLiabity",
//         ],
//       },
//       industry: String,
//       idType: {
//         type: String,
//         enum: ["nin", "votersCard", "driver"],
//       },
//       idNum: { type: String, default: "" },
//       idCountry: String,
//       idLevel: {
//         type: String,
//         enum: ["primary", "secondary"],
//       },
//       proofOfAddress: { type: String },
//       subPhone: { type: String, default: "" },
//       subEmail: { type: String, default: "" },
//       address: { type: String, default: "" },
//       city: { type: String, default: "" },
//       state: { type: String, default: "" },
//       country: String,
//       postal: { type: String, default: "" },
//     },
//   }),
//   required: function () {
//     return this.role === "business";
//   },
// },
