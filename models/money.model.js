import mongoose from "mongoose";

const MoneyManagerSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    availableMoney: { type: Number, required: true },
    currency: { type: String, required: true }, // Store as a string, e.g., "INR"
    symbol: { type: String, required: true }, // Store as a string, e.g., "₹"
    transactions: [
      {
        category: {
          type: String,
          required: true, // Category is now required for all operations
        },
        amount: { type: Number, required: true },
        operation: {
          type: String,
          required: true,
          enum: ["reduce", "increase", "transfer"], // Allowed operations
        },
        createdAt: { type: Date, default: Date.now }, // Timestamp for each transaction
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt for the whole document
);

const MoneyManager = mongoose.model("MoneyManager", MoneyManagerSchema);

export default MoneyManager;
