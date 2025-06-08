import mongoose from "mongoose";

// Define schema for the document
// const DocumentSchema = new mongoose.Schema({
  // title: { type: String, required: true }, 
  // description: { type: String }, 
//   docUrl: { type: String, required: true }, 
//   filesize: { type: Number },
//   doctype: {
//     type: String,
//     required: true,
//     enum: ["user", "company"], 
//   },
//   createdAt: { type: Date, default: Date.now }, 
// });

// const DocumentSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   title: { type: String, required: true }, 
//   description: { type: String }, 
//   fileName: { type: String, required: true },
//   fileUrl: { type: String, required: true },
//   uploadedBy: { type: String, enum: ["user", "admin"], required: true },
//   sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   createdAt: { type: Date, default: Date.now },
// });

// // Create and export the model
// const Document = mongoose.model("Document", DocumentSchema);
// export default Document;


// Document Schema
const DocumentSchema = new mongoose.Schema({
  username: { type: String, ref: "User", required: true }, // Store username instead of userId
  title: { type: String, required: true },
  description: { type: String },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: String, enum: ["user", "admin"], required: true },
  sharedWith: [{ type: String, ref: "User" }], // Store usernames of shared users
  createdAt: { type: Date, default: Date.now },
});

// Create Document Model
const Document = mongoose.model("Document", DocumentSchema);
export default Document;
