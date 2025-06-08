import mongoose from "mongoose";

// Define schema for admin
const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, minlength: 5, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 5, maxlength: 70 },
    status: {
      type: String,
      required: true,
      enum: ["active", "suspended"],
      default: "active", // Allowed values
    },
    profilePicture: {
      type: String,
      default:
        "https://img.icons8.com/?size=100&id=21441&format=png&color=000000",
    },
  },
  { timestamps: true }
);

// Create the admin model based on the schema
const Admin = mongoose.model("Admin", AdminSchema);

// Export the admin model
export default Admin;
