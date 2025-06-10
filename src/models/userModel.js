import mongoose from "mongoose";

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
    // kyc: {
    //   username: String,
    //   lastname: String,
    //   number: { type: String }, // made optional so it doesn't block form saving
    //   email: String,
    //   dateOfBirth: { type: Date },
    //   passportNumber: String,
    //   passportCountry: String,
    //   id: String,
    //   idNum: String,
    //   idCountry: String,
    //   bvn: Number,
    //   country: String,
    //   state: String,
    //   city: String,
    //   address: String,
    //   postal: Number,
    //   occupation: String,
    //   employmentStatus: {
    //     type: String,
    //     enum: ["employed", "selfEmployed", "unEmployed", "student"],
    //   },
    //   purposeAcc: {
    //     type: String,
    //     enum: ["personal", "business", "freelancing"],
    //   },
    //   source: {
    //     type: String,
    //     enum: ["salary", "business-revenue", "gift", "investment"],
    //   },
    //   inflow: Number,
    //   passportFile: String,
    //   proofOfAddress: String,
    //   status: {
    //     type: String,
    //     enum: [
    //       "not_started",
    //       "in_progress",
    //       "in_review",
    //       "approved",
    //       "rejected",
    //     ],
    //     default: "not_started",
    //   },
    //   rejectionReason: { type: String, default: "" }, // New field
    //   type: Object,
    //   required: function () {
    //     return this.role === "individual";
    //   },
    // },
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
    
    
    // businesskyc: {
    //   busName: String,
    //   email: String,
    //   regNum: Number, // made optional so it doesn't block form saving
    //   businessType: {
    //     type: String,
    //     enum: [
    //       "soleProp",
    //       "singleLLC",
    //       "llc",
    //       "genPart",
    //       "publicTrade",
    //       "unlist",
    //       "association",
    //       "nonProf",
    //       "govtOrg",
    //       "revTrust",
    //       "irevTrust",
    //       "estate",
    //       "limitedPartnership",
    //       "limLiabity",
    //     ],
    //   },
    //   industry: String,
    //   companySize: {
    //     type: String,
    //     enum: ["1-10", "11-50", "51-100", "101-200", "201-500", "500"],
    //   },
    //   countryReg: String,
    //   dateEstablished: { type: Date },
    //   address: String,
    //   city: String,
    //   state: String,
    //   country: String,
    //   postal: Number,
    //   passportFile: String,
    //   purposeAcc: {
    //     type: String,
    //     enum: ["personal", "business", "freelancing"],
    //   },
    //   source: {
    //     type: String,
    //     enum: ["salary", "business-revenue", "gift", "investment"],
    //   },
    //   inflow: Number,
    //   certificateIncorporation: String,
    //   proofOfAddress: String,
    //   status: {
    //     type: String,
    //     enum: [
    //       "not_started",
    //       "in_progress",
    //       "in_review",
    //       "approved",
    //       "rejected",
    //     ],
    //     default: "not_started",
    //   },
    //   rejectionReason: { type: String, default: "" }, // New field
    //   type: Object,
    //   required: function () {
    //     return this.role === "business";
    //   },
    // },
    businesskyc: {
      type: new mongoose.Schema({
        busName: String,
        email: String,
        regNum: Number,
        businessType: {
          type: String,
          enum: [
            "soleProp",
            "singleLLC",
            "llc",
            "genPart",
            "publicTrade",
            "unlist",
            "association",
            "nonProf",
            "govtOrg",
            "revTrust",
            "irevTrust",
            "estate",
            "limitedPartnership",
            "limLiabity",
          ],
        },
        industry: String,
        companySize: {
          type: String,
          enum: ["1-10", "11-50", "51-100", "101-200", "201-500", "500"],
        },
        countryReg: String,
        dateEstablished: { type: Date },
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
        return this.role === "business";
      },
    },
    
    
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
    transactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

// Export the user model
export default User;
