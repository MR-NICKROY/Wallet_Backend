import MoneyManager from "../models/money.model.js";

// Controller 1: Add or Initialize User's Money Data
const initializeUserMoney = async (req, res) => {
  try {
    const { userId, availableMoney, currency, symbol } = req.body;

    // Validate required fields
    if (!userId || !availableMoney || !currency || !symbol) {
      return res.status(400).json({
        message:
          "userId, availableMoney, currency, and symbol are required fields.",
      });
    }

    // Check if the user already exists
    const existingUser = await MoneyManager.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: "User already initialized." });
    }

    // Create a new user wallet
    const newUserWallet = new MoneyManager({
      userId,
      availableMoney,
      currency,
      symbol,
      transactions: [], // No transactions yet
    });

    // Save to the database
    await newUserWallet.save();

    res.status(201).json({
      message: "User wallet initialized successfully!",
      data: newUserWallet,
    });
  } catch (error) {
    console.error("Error initializing user wallet:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Controller 2: Add a New Transaction
// Controller 2: Add a New Transaction
const addTransaction = async (req, res) => {
  try {
    const { userId, category, amount, operation } = req.body;

    // Validate required fields
    if (!userId || !amount || !operation) {
      return res.status(400).json({
        message: "userId, amount, and operation are required fields.",
      });
    }

    // Find the user by userId
    const userMoney = await MoneyManager.findOne({ userId });
    if (!userMoney) {
      return res.status(404).json({ message: "User not found." });
    }

    // Handle operations
    switch (operation) {
      case "reduce": // Expense
        if (!category) {
          return res.status(400).json({
            message: "Category is required for 'reduce' operation.",
          });
        }

        // Deduct the amount and add the transaction with category
        userMoney.transactions.push({
          category,
          amount,
          operation,
        });
        userMoney.availableMoney -= amount;
        break;

      case "increase": // Income
        if (!category) {
          return res.status(400).json({
            message: "Category is required for 'increase' operation.",
          });
        }

        // Add the amount and save the category
        userMoney.transactions.push({
          category,
          amount,
          operation,
        });
        userMoney.availableMoney += amount;
        break;

      case "transfer": // Transfer
        if (!category) {
          return res.status(400).json({
            message: "Category is required for 'transfer' operation.",
          });
        }

        // Deduct the amount and save the transaction with category
        userMoney.transactions.push({
          category,
          amount,
          operation,
        });
        userMoney.availableMoney -= amount;
        break;

      default:
        return res.status(400).json({
          message:
            "Invalid operation. Allowed values are 'reduce', 'increase', or 'transfer'.",
        });
    }

    // Save the updated data
    await userMoney.save();

    res.status(200).json({
      message: "Transaction processed successfully!",
      data: {
        availableMoney: userMoney.availableMoney,
        transactions: userMoney.transactions,
        currency: userMoney.currency,
        symbol: userMoney.symbol,
      },
    });
  } catch (error) {
    console.error("Error processing transaction:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getTransaction = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required.",
      });
    }

    // Find the user wallet and transactions
    const userMoney = await MoneyManager.findOne({ userId });
    if (!userMoney) {
      return res.status(404).json({
        message: "User wallet not found.",
      });
    }

    res.status(200).json({
      message: "User wallet and transactions fetched successfully!",
      data: {
        userId: userMoney.userId,
        availableMoney: userMoney.availableMoney,
        currency: userMoney.currency,
        symbol: userMoney.symbol,
        transactions: userMoney.transactions,
      },
    });
  } catch (error) {
    console.error("Error fetching user wallet and transactions:", error);
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export { initializeUserMoney, addTransaction, getTransaction };
