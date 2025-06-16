import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  // username: { type: String, ref: "User", required: true },
  transactionId: { type: String, unique: true, required: true },
  type: {
    type: String,
    enum: ["Send", "Receive"],
    required: true,
  },
  sourceName: { type: String, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: ["completed", "pending", "failed"],
  },

  description: { type: String, required: true, lowercase: true },
  wallet: { type: String, required: true },
  bank: { type: String, required: true  },

  fee: { type: Number, required: true },
  currency: { type: String, required: true },
  account: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  initiatedBy: {
    type: String, // can be "business" | "subaccount" | "individual"
    required: true,
  },
  subAccountId: { type: String }, // only used if initiatedBy is "subaccount"
  
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
