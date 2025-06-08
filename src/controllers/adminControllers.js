//import authentication dependencies
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import responseMessages from "../views/responseMessages.js";
import httpStatus from "http-status";
import { registerSchema } from "../validations/adminValidation.js";
import adminValidateSchema from "../utils/adminValidateSchema.js";


const adminReg = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate request body
  const { error } = adminValidateSchema(registerSchema, req.body);
  if (error) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  try {
    // Check for existing admin
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { username }],
    });

    if (existingAdmin) {
      const message =
        existingAdmin.email === email
          ? responseMessages.adminExists || "Email is already registered"
          : "Username is already in use";

      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        message,
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    return res.status(httpStatus.CREATED).json({
      status: "success",
      message:
        responseMessages.adminRegistered || "Admin registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occurred during registration",
    });
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    //checking if the admin exists
    let adminExists = await Admin.findOne({ email });

    // Compare password
    //  const isMatch = await bcrypt.compare(password, admin.password);
    //  if (!isMatch) {
    //    return res.status(400).json({ status: "error", message: "Invalid credentials" });
    //  }

    if (!adminExists) {
      res.status(404).json({
        message: responseMessages.invalidCredentials,
      });
    }

    //checking if password is correct
    const confirmedPassword = await bcrypt.compare(
      password,
      adminExists.password
    );

    if (!confirmedPassword) {
      res.status(401).json({
        message: responseMessages.invalidCredentials,
      });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: adminExists._id, email: adminExists.email,  username: adminExists.username,
        role: "admin",},
      
      process.env.JWT_SECRET,
      { expiresIn: "1 day" } // Token expiration time
    );

    //send success message if credentials are correct
    res.status(200).json({
      status: "success",
      message: "Login successful",
      adminData: adminExists,
      authToken: token,
    });
  } catch (error) {
    console.error(error);
  }
};

//admin controller function to get all subscribers
const getAdmins = async (req, res) => {
  try {
    //find out if all the admin is already registered

    //query the admin model to return all admins and store them in the admins variable
    let admins = await Admin.find({});

    if (admins) {
      return res.status(200).json({
        message: responseMessages.registeredadmins,
        adminData: admins,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const getAdmin = async (req, res) => {
  try {
    const { username } = req.params; // Extract username from URL
    const admin = await Admin.findOne({ username }).lean();

    if (!admin) {
      return res.status(404).json({
        status: "error",
        message: "Admin not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: admin,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch profile data.",
    });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Verify user Email Controller
// const verifyEmail = async (req, res) => {
//   const { email, verificationToken } = req.body;

//   if (!email || !verificationToken) {
//     return res
//       .status(400)
//       .json({ message: "Email and verification token are required." });
//   }

//   try {
//     // Find user by email and check if token matches
//     const user = await Admin.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or token." });
//     }

//     if (user.isVerified) {
//       return res.status(400).json({ message: "Email already verified." });
//     }

//     if (user.verificationToken !== verificationToken) {
//       return res.status(400).json({ message: "Invalid verification token." });
//     }

//     if (Date.now() > user.verificationTokenExpiresAt) {
//       return res.status(400).json({ message: "Verification token expired." });
//     }

//     // Mark user as verified
//     user.isVerified = true;
//     user.verificationToken = null;
//     user.verificationTokenExpiresAt = null;
//     await user.save();

//     // Send a welcome email
//     await sendWelcomeEmail(user.email, user.username, user.lastname);

//     res.status(200).json({ message: "Email successfully verified." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error." });
//   }
// };

// // Request user Password Reset
//  const requestPasswordReset = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await Admin.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         status: "error",
//         message: "User not found with this email.",
//       });
//     }

//     // Generate reset token
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     const resetTokenHash = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");

//     user.passwordResetToken = resetTokenHash;
//     // user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 min expiration
//     user.passwordResetExpires = Date.now() + 24 * 60 * 60 * 1000; // 1 day expiration

//     await user.save();
//     console.log("Reset token stored in DB:", user.passwordResetToken);

//     // Send password reset email
//     const resetLink = `https://www.gvestinvestmentcapital.com/reset-password?token=${resetToken}&email=${email}`;
//     // const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;
//     await sendPasswordResetEmail(user.email, resetLink);

//     res.status(200).json({
//       status: "success",
//       message: "Password reset link has been sent to your email.",
//     });
//   } catch (error) {
//     console.error("Error requesting password reset:", error);
//     res.status(500).json({ status: "error", message: "Internal server error" });
//   }
// };

// // Reset user password
//  const resetPassword = async (req, res) => {
//   const { token, email, newPassword } = req.body;

//   console.log("Received token:", token);
//   console.log("Email:", email);
//   console.log("New password:", newPassword);

//   try {
//     if (!token || !email || !newPassword) {
//       return res.status(400).json({
//         status: "error",
//         message: "All fields are required.",
//       });
//     }

//     const user = await Admin.findOne({ email });

//     // Ensure the user exists
//     if (!user) {
//       return res.status(400).json({
//         status: "error",
//         message: "User not found.",
//       });
//     }

//     // Ensure the user has reset token and expiration fields
//     if (!user.passwordResetToken || !user.passwordResetExpires) {
//       return res.status(400).json({
//         status: "error",
//         message: "Invalid or expired token.",
//       });
//     }

//     console.log("Hashed token from DB:", user.passwordResetToken);
//     console.log("Received raw token:", token);
//     console.log("Stored hashed token in DB:", user.passwordResetToken);
//     console.log(
//       "Token expiration time:",
//       new Date(user.passwordResetExpires).toISOString()
//     );
//     console.log("Current time:", new Date(Date.now()).toISOString());

//     // Hash the received token to compare with the stored hashed token
//     const resetTokenHash = crypto
//       .createHash("sha256")
//       .update(token)
//       .digest("hex");

//     console.log("Computed hash of received token:", resetTokenHash);

//     // Compare the hashes to verify the reset token
//     if (resetTokenHash !== user.passwordResetToken) {
//       return res.status(400).json({
//         status: "error",
//         message: "Invalid reset token.",
//       });
//     }

//     // Check if the token has expired
//     if (Date.now() > user.passwordResetExpires) {
//       return res.status(400).json({
//         status: "error",
//         message: "Reset token expired.",
//       });
//     }

//     // Hash new password and update user
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);

//     // Reset the password reset fields
//     user.passwordResetToken = null; // Explicitly set to null
//     user.passwordResetExpires = null; // Explicitly set to null

//     await user.save();
//     console.log("Password successfully updated for user:", email);

//     // Send password reset success email
//     await sendResetSuccessEmail(user.email);

//     res.status(200).json({
//       status: "success",
//       message:
//         "Password reset successful. You can now log in with your new password.",
//     });
//   } catch (error) {
//     console.error("Error resetting password:", error);
//     res.status(500).json({ status: "error", message: "Internal server error" });
//   }
// };

export { adminReg, adminLogin, getAdmins, deleteAdmin, updateAdmin, getAdmin };
