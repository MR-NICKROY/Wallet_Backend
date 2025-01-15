import express from "express";
import {
  createGoal,
  updateSavedAmount,
  deleteGoal,
  getAllGoals,
} from "../controller/goal.controller.js";

const router = express.Router();

// Route to create a new goal
router.post("/goals", createGoal);

// Route to update the saved amount of a goal
router.delete("/goals/:goalId", deleteGoal);
router.patch("/goals/:goalId", updateSavedAmount);
// get all the goals of user
router.get("/goals/:userId", getAllGoals);

export default router;
