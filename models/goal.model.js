import mongoose from "mongoose";

// Backend/models/user.model.js
const goalSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    target: { type: Number, required: true },
    saved: { type: Number, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
