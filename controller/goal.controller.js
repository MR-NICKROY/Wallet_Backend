// Backend/controller/goal.controller.js
import Goal from "../models/goal.model.js";

// Create a new goal
export const createGoal = async (req, res) => {
  try {
    const { userId, name, target, saved, date } = req.body;

    if (!userId || !name || !target || !date) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled" });
    }

    const newGoal = new Goal({
      userId,
      name,
      target,
      saved: saved || "0", // Default saved to 0 if not provided
      date,
      // Default note to an empty string
    });

    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Backend/controller/goal.controller.js

// Update saved amount for a specific goal
export const updateSavedAmount = async (req, res) => {
  try {
    const { goalId } = req.params; // Goal ID
    const { saved } = req.body; // New saved amount

    console.log("Received saved value from frontend:", saved); // Debug log

    if (saved === undefined || saved === null || saved === "") {
      return res.status(400).json({ error: "Saved amount is required" });
    }

    const numericSaved = Number(saved);
    if (isNaN(numericSaved)) {
      return res
        .status(400)
        .json({ error: "Saved amount must be a valid number" });
    }

    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    console.log("Current saved amount in the database:", goal.saved); // Debug log

    goal.saved = numericSaved; // Update the saved value
    const updatedGoal = await goal.save();

    console.log("Updated saved amount in the database:", updatedGoal.saved); // Debug log

    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error("Error updating saved amount:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Backend/controller/goal.controller.js
export const deleteGoal = async (req, res) => {
  try {
    const { goalId } = req.params;

    // Check if the goal ID is provided
    if (!goalId) {
      return res.status(400).json({ error: "Goal ID is required" });
    }

    // Find and delete the goal
    const deletedGoal = await Goal.findByIdAndDelete(goalId);

    // If no goal is found
    if (!deletedGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.status(200).json({ message: "Goal deleted successfully", deletedGoal });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all goals for a specific user
export const getAllGoals = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from the request parameters

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const goals = await Goal.find({ userId }); // Find all goals for the user

    if (goals.length === 0) {
      return res.status(404).json({ message: "No goals found for this user" });
    }

    res.status(200).json(goals); // Return the list of goals
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
