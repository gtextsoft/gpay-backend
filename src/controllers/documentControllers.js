import Document from "../models/documentModel.js";
import User from "../models/userModel.js";
import { uploadDocument } from "../middlewares/upload.js";

//Admin upload Document
export const postAdminDocument = async (req, res) => {
  try {
    // uploadDocument.single("file")(req, res, async (err) => {
    //   if (err) return res.status(500).json({ message: "File upload error", error: err });

    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);

    console.log("Multer Middleware Reached!"); // Should print if multer runs
    console.log("File Uploaded:", req.file); // Should contain Cloudinary details

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Uploaded File:", req.file); // Debugging

    const { username, title, description } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Cloudinary file details
    const fileUrl = req.file.path;
    const fileName = req.file.originalname;

    const newDocument = new Document({
      username,
      title,
      description,
      fileName,
      fileUrl,
      uploadedBy: "admin",
    });

    const savedDocument = await newDocument.save();

    // Add document to user's document list
    user.documents.push(savedDocument._id);
    await user.save();

    res.status(201).json({
      message: "Document uploaded successfully",
      document: savedDocument,
    });
    // });
  } catch (error) {
    // res.status(500).json({ message: "Server error", error });
    console.error("Error uploading document:", error); // Log the error to see details
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//User upload Document
export const postUserDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { username, title, description } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Cloudinary file details
    const fileUrl = req.file.path;
    const fileName = req.file.originalname;

    const newDocument = new Document({
      username,
      title,
      description,
      fileName,
      fileUrl,
      uploadedBy: "user",
    });

    const savedDocument = await newDocument.save();

    // Add document to user's document list
    user.documents.push(savedDocument._id);
    await user.save();

    res.status(201).json({
      message: "Document uploaded successfully",
      document: savedDocument,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//Admin get All User Document
export const getAllUserDocument = async (req, res) => {
  try {
    // Fetch all documents
    const documents = await Document.find();

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//User route to get document
export const getUserDocument = async (req, res) => {
  try {
    const { username } = req.params; // Get username from URL parameter

    if (!username) {
      return res.status(400).json({ message: "Username not provided" });
    }

    console.log("Fetching documents for username:", username);

    // Fetch all documents related to the user
    const documents = await Document.find({ username });

    if (!documents.length) {
      return res.status(404).json({ message: "No documents found" });
    }

    // Separate admin-posted and user-posted documents
    const adminDocuments = documents.filter(
      (doc) => doc.uploadedBy === "admin"
    );
    const userDocuments = documents.filter((doc) => doc.uploadedBy === "user");

    res.status(200).json({
      adminDocuments, // Documents uploaded by admin
      userDocuments, // Documents uploaded by user
    });
  } catch (error) {
    console.error("Error fetching user documents:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
