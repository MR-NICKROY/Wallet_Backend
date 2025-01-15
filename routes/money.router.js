import express from "express";
import {
  initializeUserMoney,
  addTransaction,
  getTransaction,
} from "../controller/money.controller.js";

const router = express.Router();

// Initialize User Wallet
router.post("/initialize", initializeUserMoney);

// Add a New Transaction
router.post("/transaction", addTransaction);

// Get All Wallet and Transaction Info
router.get("/transaction/:userId", getTransaction);

export default router;
