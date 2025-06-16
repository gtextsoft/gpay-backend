import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import Transaction from "../models/transactionModel.js";
import User from "../models/userModel.js"; // Assuming you have a User model
import { transporter } from "../config/email.js";
import {

  sendTransactionSuccess,
} from "../services/emailService.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const convertToSmallestUnit = (amount, currency) => {
  const conversionRates = {
    NGN: 100, // 1 NGN = 100 kobo
    USD: 100, // 1 USD = 100 cents
    EUR: 100, // 1 EUR = 100 cents
  };

  return amount * (conversionRates[currency] || 1);
};

const postTransaction = async (req, res) => {
  try {
    // const { amount, email, currency, paymentMethodId, username, description, method, investmentName, investmentDuration, type, roi, nextRoiDate } = req.body;
    const { amount, email, currency, paymentMethodId, username, description, method, type, roi, nextRoiDate, plot, unit, duration } = req.body;

    if (!amount || !currency || !paymentMethodId || !username || !description || !method || !email || !type) {
      // if (!amount || !currency || !paymentMethodId || !username || !description || !method || !email || !investmentName || !investmentDuration || !type) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert amount to Stripe-compatible value
    const stripeAmount = convertToSmallestUnit(amount, currency);

    // Generate unique transaction ID
    const transactionId = uuidv4();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: stripeAmount,
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      receipt_email: user.email,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      metadata: { transactionId },
    });

    // Map Stripe status to your schema enum
    const mappedStatus = paymentIntent.status === "succeeded" ? "completed" : "pending";

    // Store transaction in DB
    const newTransaction = new Transaction({
      username,
      transactionId,
      amount,
      duration,
      currency,
      description,
      method,
      status: mappedStatus,
      paymentIntentId: paymentIntent.id,
      type,
      createdBy: username, // ✅ This is the key part (user created their own transaction)
    });

    const savedTransaction = await newTransaction.save();

    // Add transaction to user's transaction history
    user.transactions.push(savedTransaction._id);

    // ✅ Add Investment History when Transaction is Successful
    if (mappedStatus === "completed") {
      if (["house", "land"].includes(type)) {
        // Property Investment
        user.propertyInvestments.push({
          investmentId: uuidv4(),  // Use transactionId as investmentId
          type,
          amountPaid: amount,
          description,
          paymentMethod: method,
          status: mappedStatus,
          currency,
          plot,
          unit,
        });
      } else
        if (["5million", "8million", "10million"].includes(type)) {
          // Investment Scheme
          user.investmentSchemes.push({
            investmentId: uuidv4(),
            type,
            roi,
            // duration,
            duration: `${duration} months`,
            currency,
            description,
            amountPaid: amount,
            nextRoiDate,
            paymentMethod: method,
            dateInvested: new Date(),
            status: mappedStatus,
          });
        }
    }


    await user.save();

    // Send Transaction Success Email
    // await sendTransactionSuccess(user.email, username, amount, currency, transactionId, investmentName, investmentDuration, type);
    await sendTransactionSuccess(user.email, username, amount, currency, transactionId, type);


    res.status(200).json({
      message: "Payment successful",
      transaction: savedTransaction,
      transactionId,
      paymentIntentId: paymentIntent.id,
      status: mappedStatus,
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: "Payment failed", error: error.message });
  }
};

const getTransaction = async (req, res) => {
  try {
    const { username } = req.params;
    const transactions = await Transaction.find({ username }).sort({
      createdAt: -1,
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    // Fetch all transactions from the database, sorted by creation date in descending order
    const transactions = await Transaction.find().sort({ createdAt: -1 });

    // Respond with the list of transactions
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const postAdminTransaction = async (req, res) => {
  try {
    const {
      amount,
      email,
      currency,
      username, // The user making the transaction
      description,
      method,
      status,
      paymentIntentId,
      type,
    } = req.body;

    const adminUsername = req.user?.username; // Assuming req.user contains the admin's details

    if (
      !amount ||
      !currency ||
      !username ||
      !description ||
      !method ||
      !email ||
      !status ||
      !paymentIntentId
    ) {
      return res.status(400).json({ message: "Missing transaction details" });
    }

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a unique transaction ID
    const transactionId = uuidv4();

    // Create a new transaction object
    const newTransaction = new Transaction({
      username, // The user who made the transaction
      transactionId,
      amount,
      currency,
      description,
      method,
      status,
      paymentIntentId,
      type,
      createdBy: adminUsername || "Unknown Admin", // Store admin username
    });

    // Save the transaction to the database
    const savedTransaction = await newTransaction.save();

    // Associate the transaction with the user
    user.transactions.push(savedTransaction._id);
    await user.save();

    // Optionally, send a confirmation email to the user
    await sendTransactionSuccess(
      user.email,
      username,
      amount,
      currency,
      transactionId
    );

    // Respond with the saved transaction details
    res.status(201).json({
      message: "Transaction recorded successfully",
      transaction: savedTransaction,
    });
  } catch (error) {
    console.error("Error recording transaction:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export { postTransaction, getTransaction, getAllTransactions, postAdminTransaction };
