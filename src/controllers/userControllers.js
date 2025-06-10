//import authentication dependencies
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import responseMessages from "../views/responseMessages.js";
import httpStatus from "http-status";
import { registerSchema } from "../validations/userValidation.js";
import userValidateSchema from "../utils/userValidateSchema.js";
import { response } from "express";

import crypto from "crypto";

import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../services/emailService.js";

//user registration controller
const userReg = async (req, res) => {
  req.body.role = "individual";
  const { error } = userValidateSchema(registerSchema, req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: "error", message: error.details[0].message });
  }
  const { username, lastname, email, password, phoneNumber, confirmPassword } =
    req.body;

  //check if the user is already registered
  try {
    //find out if the user is already registered
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: responseMessages.userExists,
      });
    } else {
      // Check if user username already exists
      user = await User.findOne({ username: username });
      if (user) {
        return res.status(httpStatus.CONFLICT).json({
          status: "error",
          message: "username is already in use",
        });
      }

      //create user and save details to database
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Generate verification token
      const verificationToken = (
        (parseInt(crypto.randomBytes(3).toString("hex"), 16) % 900000) +
        100000
      ).toString();

      const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      // Create a new user
      user = new User({
        role: "individual",
        username,
        lastname,
        email,
        phoneNumber,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiresAt,
        kyc: {}, 
      });
      await user.save();

      await sendVerificationEmail(user.email, verificationToken);

      // try {
      //   await sendVerificationEmail(user.email, verificationToken);
      // } catch (err) {
      //   console.error("Email sending failed:", err.message);
      // }

      res.status(201).json({
        message: responseMessages.userRegistered,
        isVerified: user.isVerified,
        email: user.email, // Include the email
        verificationToken: user.verificationToken, // Include the verificationToken
      });
    }
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occurred during registration",
    });
  }
};

const businessReg = async (req, res) => {
  req.body.role = "business";
  const { error } = userValidateSchema(registerSchema, req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: "error", message: error.details[0].message });
  }
  const {
    busName,
    busLastName,
    position,
    email,
    phoneNumber,
    password,
    confirmPassword,
    businessName,
  } = req.body;

  //check if the user is already registered
  try {
    //find out if the user is already registered
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        // message: responseMessages.userExists,
        status: "error",
        message: "Email already in use. Please use a different one.",
      });
    } else {
      // Check if user username already exists
      // user = await User.findOne({ username: busName });
      user = await User.findOne({ busName: busName });
      if (user) {
        return res.status(httpStatus.CONFLICT).json({
          status: "error",
          message: "username is already in use",
        });
      }

      //create user and save details to database
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Generate verification token
      const verificationToken = (
        (parseInt(crypto.randomBytes(3).toString("hex"), 16) % 900000) +
        100000
      ).toString();

      const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      // Create a new user
      user = new User({
        role: "business",
        busName, // maps to username field
        busLastName, // maps to lastname field
        email,
        businessName,
        position,
        phoneNumber,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiresAt,
        businesskyc: {}, 
      });
      await user.save();

      await sendVerificationEmail(user.email, verificationToken);

      // try {
      //   await sendVerificationEmail(user.email, verificationToken);
      // } catch (err) {
      //   console.error("Email sending failed:", err.message);
      // }

      res.status(201).json({
        message: responseMessages.businessRegistered,
        isVerified: user.isVerified,
        email: user.email, // Include the email
        verificationToken: user.verificationToken, // Include the verificationToken
      });
    }
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occurred during registration",
    });
  }
};

//user login controller
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Checking if the user exists
    let userExists = await User.findOne({ email });

    if (!userExists) {
      return res
        .status(404)
        .json({ message: responseMessages.invalidCredentials });
    }

    // Check if the account is verified
    if (!userExists.isVerified) {
      return res.status(403).json({
        message:
          "Email not verified. Please check your email for the verification code.",
      });
    }

    // Checking if password is correct
    const confirmedPassword = await bcrypt.compare(
      password,
      userExists.password
    );

    if (!confirmedPassword) {
      return res
        .status(401)
        .json({ message: responseMessages.invalidCredentials });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: userExists._id, email: userExists.email, role: userExists.role },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "Strict",
    //   maxAge: 5 * 60 * 60 * 1000, // 5 hours
    // });

    // Send success message if credentials are correct
    res.status(200).json({
      message: responseMessages.loginSuccess,
      userData: userExists,
      authToken: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

//Verify user Email Controller
const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body;

  if (!email || !verificationToken) {
    return res
      .status(400)
      .json({ message: "Email and verification token are required." });
  }

  try {
    // Find user by email and check if token matches
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or token." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified." });
    }

    if (user.verificationToken !== verificationToken) {
      return res.status(400).json({ message: "Invalid verification token." });
    }

    if (Date.now() > user.verificationTokenExpiresAt) {
      return res.status(400).json({ message: "Verification token expired." });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;
    await user.save();

    // Send a welcome email
    await sendWelcomeEmail(user.email, user.username, user.lastname);

    res.status(200).json({ message: "Email successfully verified." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// Request user Password Reset
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found with this email.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = resetTokenHash;
    // user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 min expiration
    user.passwordResetExpires = Date.now() + 24 * 60 * 60 * 1000; // 1 day expiration

    await user.save();
    console.log("Reset token stored in DB:", user.passwordResetToken);

    // Send password reset email
    const resetLink = `https://www.gvestinvestmentcapital.com/reset-password?token=${resetToken}&email=${email}`;
    // const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;
    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({
      status: "success",
      message: "Password reset link has been sent to your email.",
    });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Reset user password
const resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;

  console.log("Received token:", token);
  console.log("Email:", email);
  console.log("New password:", newPassword);

  try {
    if (!token || !email || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required.",
      });
    }

    const user = await User.findOne({ email });

    // Ensure the user exists
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found.",
      });
    }

    // Ensure the user has reset token and expiration fields
    if (!user.passwordResetToken || !user.passwordResetExpires) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired token.",
      });
    }

    console.log("Hashed token from DB:", user.passwordResetToken);
    console.log("Received raw token:", token);
    console.log("Stored hashed token in DB:", user.passwordResetToken);
    console.log(
      "Token expiration time:",
      new Date(user.passwordResetExpires).toISOString()
    );
    console.log("Current time:", new Date(Date.now()).toISOString());

    // Hash the received token to compare with the stored hashed token
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    console.log("Computed hash of received token:", resetTokenHash);

    // Compare the hashes to verify the reset token
    if (resetTokenHash !== user.passwordResetToken) {
      return res.status(400).json({
        status: "error",
        message: "Invalid reset token.",
      });
    }

    // Check if the token has expired
    if (Date.now() > user.passwordResetExpires) {
      return res.status(400).json({
        status: "error",
        message: "Reset token expired.",
      });
    }

    // Hash new password and update user
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Reset the password reset fields
    user.passwordResetToken = null; // Explicitly set to null
    user.passwordResetExpires = null; // Explicitly set to null

    await user.save();
    console.log("Password successfully updated for user:", email);

    // Send password reset success email
    await sendResetSuccessEmail(user.email);

    res.status(200).json({
      status: "success",
      message:
        "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Update one user profile by username
// const updateUserProfile = async (req, res) => {
//   const { username } = req.params;
//   console.log("Profile update route hit for username:", username);

//   // Extract fields from the request body
//   const {
//     phoneNumber,
//     gender,
//     dateOfBirth,
//     maritalStatus,
//     employmentStatus,
//     city,
//     state,
//     country,
//   } = req.body;

//   // let profilePictureUrl = req.file
//   //   ? `http://localhost:4000/uploads/${req.file.filename}`
//   //   : undefined; // Only update if a file is uploaded

//   // Get Cloudinary URL instead of local storage
//   let profilePictureUrl = req.file ? req.file.path : undefined;

//   // Build the update object only with fields that are provided
//   const updateData = {
//     ...(phoneNumber && { phoneNumber }),
//     ...(gender && { gender }),
//     ...(dateOfBirth && { dateOfBirth }),
//     ...(maritalStatus && { maritalStatus }),
//     ...(employmentStatus && { employmentStatus }),
//     ...(city && { city }),
//     ...(state && { state }),
//     ...(country && { country }),
//     ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
//   };

//   try {
//     // Update user data in the database
//     const updatedUser = await User.findOneAndUpdate(
//       { username },
//       { $set: updateData }, // Use `$set` to update only provided fields
//       { new: true, runValidators: true }
//     );

//     if (!updatedUser) {
//       return res
//         .status(404)
//         .json({ status: "error", message: "User not found" });
//     }
//     console.log("Received File:", req.file);
//     console.log("Cloudinary Uploaded File:", req.file);

//     // console.log(
//     //   "Stored at:",
//     //   `http://localhost:4000/uploads/${req.file?.filename}`
//     // );

//     res.status(200).json({
//       status: "success",
//       message: "Profile updated successfully",
//       data: updatedUser,
//       profilePictureUrl, // Include the full profile picture URL in the response
//     });
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     res.status(500).json({ status: "error", message: "Internal server error" });
//   }
// };

// Fetch user profile by username
// const getUserProfile = async (req, res) => {
//   try {
//     const { currentUsername } = req.params;
//     const user = await User.findOne({ username: currentUsername });

//     if (!user) {
//       return res.status(httpStatus.NOT_FOUND).json({
//         status: "error",
//         message: "User not found",
//       });
//     }

//     res.status(httpStatus.OK).json({
//       status: "success",
//       data: user,
//     });
//   } catch (error) {
//     console.error("Error fetching profile:", error);
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       status: "error",
//       message: "Failed to fetch profile data.",
//     });
//   }
// };

const updateUserProfile = async (req, res) => {
  const { username } = req.params;
  console.log("Profile update route hit for username:", username);

  const { phoneNumber, gender, maritalStatus } = req.body;

  let profilePictureUrl = req.file ? req.file.path : undefined;

  const updateData = {
    ...(phoneNumber && { phoneNumber }),
    ...(gender && { gender }),
    ...(maritalStatus && { maritalStatus }),
    ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
  };

  try {
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: updatedUser,
      profilePictureUrl,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { currentUsername } = req.params;

    const user = await User.findOne({ username: currentUsername }).lean(); // Get plain object
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Merge KYC data if available
    const kycData = user.kyc || {};
    const mergedProfile = {
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      maritalStatus: user.maritalStatus,
      dateOfBirth: kycData.dateOfBirth || "", // From KYC
      employmentStatus: kycData.employmentStatus || "",
      city: kycData.city || "",
      state: kycData.state || "",
      country: kycData.country || "",
      profilePictureUrl: user.profilePicture || "",
    };

    res.status(200).json({
      status: "success",
      data: mergedProfile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch profile data.",
    });
  }
};

const updateUserBusProfile = async (req, res) => {
  const { busName } = req.params;
  console.log("Profile update route hit for username:", busName);

  const { phoneNumber, gender } = req.body;

  let profilePictureUrl = req.file ? req.file.path : undefined;

  const updateData = {
    ...(phoneNumber && { phoneNumber }),
    ...(gender && { gender }),
    ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
  };

  try {
    const updatedUser = await User.findOneAndUpdate(
      { busName },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "Business not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Profile business updated successfully",
      data: updatedUser,
      profilePictureUrl,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

const getUserBusProfile = async (req, res) => {
  try {
    const { currentUsername } = req.params;

    const user = await User.findOne({ busName: currentUsername }).lean(); // Get plain object
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Merge KYC data if available
    const kycData = user.businesskyc || {};
    const mergedProfile = {
      username: user.username || user.busName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      dateEstablished: kycData.dateEstablished || "", // From KYC
      city: kycData.city || "",
      state: kycData.state || "",
      country: kycData.country || "",
      profilePictureUrl: user.profilePicture || "",
    };

    res.status(200).json({
      status: "success",
      data: mergedProfile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch profile data.",
    });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    //find out if all the user is already registered

    //query the user model to return all users and store them in the users variable
    let users = await User.find({});

    if (users) {
      return res.status(200).json({
        message: responseMessages.registeredUsers,
        userData: users,
      });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching users",
    });
  }
};

// Fetch one user by username
// const getUser = async (req, res) => {
//   try {
//     const { username } = req.params; // Extract username from URL
//     const user = await User.findOne({ username });

//     if (!user) {
//       return res.status(404).json({
//         status: "error",
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       status: "success",
//       data: user,
//     });
//   } catch (error) {
//     console.error("Error fetching profile:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Failed to fetch profile data.",
//     });
//   }
// };

const getUser = async (req, res) => {
  try {
    const { identifier } = req.params; // can be username or busName

    const user = await User.findOne({
      $or: [{ username: identifier }, { busName: identifier }],
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      userData: user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch profile data.",
    });
  }
};


// Update one user by id
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete one user by id
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  userReg,
  businessReg,
  userLogin,
  getUsers,
  deleteUser,
  updateUser,
  getUser,
  updateUserProfile,
  verifyEmail,
  requestPasswordReset,
  getUserProfile,
  resetPassword,
  getUserBusProfile,
  updateUserBusProfile,
};
