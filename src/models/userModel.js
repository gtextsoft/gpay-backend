// import mongoose from "mongoose";

// //Define schema for user
// const UserSchema = new mongoose.Schema(
//   {
//     role: { type: String, enum: ["individual", "business"], required: true },

//     username: {
//       type: String,
//       required: function () {
//         return this.role === "individual";
//       },
//       // unique: true,
//       // minlength: 5,
//       // maxlength: 10,
//     },
//     lastname: {
//       type: String,
//       required: function () {
//         return this.role === "individual";
//       },
//       // unique: true,
//       // minlength: 5,
//       // maxlength: 10,
//     },
//     busName: {
//       type: String,
//       required: function () {
//         return this.role === "business";
//       },
//       // unique: true,
//       // minlength: 5,
//       // maxlength: 10,
//     },
//     busLastName: {
//       type: String,
//       required: function () {
//         return this.role === "business";
//       },
//       // unique: true,
//       // minlength: 5,
//       // maxlength: 10,
//     },
//     dateOfBirth: { type: Date },
//     businessName: String,
//     email: { type: String, required: true, unique: true, lowercase: true },
//     password: { type: String, required: true, minlength: 5, maxlength: 70 },
//     isVerified: { type: Boolean, default: false },
//     profilePicture: { type: String },
//     // profilePicture: { type: String, required: false },
//     passwordResetToken: String,
//     passwordResetExpires: Date,
//     verificationToken: String,
//     verificationTokenExpiresAt: Date,

//     // New profile settings fields
//     // phoneNumber: { type: Number, required: true },
//     phoneNumber: { type: String, required: true },

//     gender: { type: String, enum: ["Male", "Female"] },
//     maritalStatus: { type: String, enum: ["Single", "Married"] },
//     employmentStatus: { type: String, enum: ["Employed", "Unemployed"] },
//     city: { type: String, default: "" },
//     state: { type: String, default: "" },
//     country: { type: String, default: "" },
//     position: {
//       type: String,
//       required: function () {
//         return this.role === "business";
//       },
//     },
//     kyc: {
//       username: String,
//       lastname: String,
//       // number: Number,
//       number: { type: String},

//       email: String,
//       dateOfBirth: { type: Date },
//       passportNumber: String,
//       passportCountry: String,
//       id: String,
//       idNum: String,
//       idCountry: String,
//       bvn: Number,
//       country: String,
//       state: String,
//       city: String,
//       address: String,
//       postal: Number,
//       occupation: String,
//       employmentStatus: {
//         type: String,
//         enum: ["employed", "selfEmployed", "unEmployed", "student"],
//       },
//       purposeAcc: {
//         type: String,
//         enum: ["personal", "business", "freelancing"],
//       },
//       source: {
//         type: String,
//         enum: ["salary", "business-revenue", "gift", "investment"],
//       },
//       inflow: Number,
//       passportFile: String,
//       proofOfAddress: String,
//       status: {
//         type: String,
//         enum: ["not_started", "in_progress", "in_review", "approved"],
//         default: "not_started",
//       },
//     },

//     documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
//     transactions: [
//       { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
//     ],
//   },
//   { timestamps: true }
// );

// // Create the user model based on the schema
// const User = mongoose.model("User", UserSchema);

// // Export the user model
// export default User;

// propertyInvestments: [
//   {
//     investmentId: { type: String, required: true },
//     type: {
//       type: String,
//       enum: ["land", "house"],
//       required: true,
//     },
//     amountPaid: { type: Number, required: true },
//     dateInvested: { type: Date, default: Date.now },
//     description: { type: String },
//     paymentMethod: {
//       type: String,
//       enum: ["Bank Transfer", "Wallet"],
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["completed", "pending"],
//       default: "pending",
//     },
//     plot: { type: Number },
//     unit: { type: Number },
//     currency: { type: String },
//   },
// ],

// investmentSchemes: [
//   {
//     investmentId: { type: String, required: true },
//     type: {
//       type: String,
//       enum: ["5million", "8million", "10million"],
//       required: true,
//     },
//     description: { type: String },
//     dateInvested: { type: Date, default: Date.now },
//     nextRoiDate: { type: Date, required: true },
//     paymentMethod: {
//       type: String,
//       enum: ["Bank Transfer", "Wallet"],
//       required: true,
//     },
//     roi: { type: Number, required: true },
//     amountPaid: { type: Number, required: true },
//     status: {
//       type: String,
//       enum: ["completed", "pending"],
//       default: "pending",
//     },
//     currency: { type: String },
//   },
// ],

// notificationInvestments: [
//   {
//     update: String,
//     title: String,
//     description: String,
//     read: { type: Boolean, default: false },
//     date: { type: Date, default: Date.now },
//   },
// ],

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
    employmentStatus: { type: String, enum: ["Employed", "Unemployed"] },

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
      username: String,
      lastname: String,
      number: { type: String }, // made optional so it doesn't block form saving
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
        enum: ["not_started", "in_progress", "in_review", "approved", "rejected"],
        default: "not_started",
      },
      rejectionReason: { type: String, default: "" }, // New field
    },

    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
    transactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

// // Export the user model
export default User;
