import mongoose from "mongoose";

// Backend/models/user.model.js
const userSchema = mongoose.Schema(
  {
    fullname: { type: String, minLength: 3, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minLength: 6 },
    gender: { type: String, enum: ["male", "female"] },
    // Add this field
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
