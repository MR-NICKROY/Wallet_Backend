import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookie from "../jwt/generateToken.js";
// Backend/controller/user.controller.js - signup function
export const signup = async (req, res) => {
  try {
    const { fullname, email, password, gender } = req.body;

    if (!fullname || !email || !password || !gender) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashPassword,
      gender,
    });

    await newUser.save();

    try {
      const token = createTokenAndSaveCookie(newUser._id, res);

      res.status(201).json({
        message: "User created successfully",
        user: {
          _id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
          gender: newUser.gender,
        },
        token,
      });
    } catch (tokenError) {
      console.error("Token generation error:", tokenError);
      return res
        .status(500)
        .json({ error: "Error generating authentication token" });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Backend/controller/user.controller.js - login function
// In user.controller.js - login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = createTokenAndSaveCookie(user._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        gender: user.gender,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(201).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Backend/controller/user.controller.js
// Backend/controller/user.controller.js - changePassword function
// Backend/controller/user.controller.js - changePassword function (using email)
export const changePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Both email and new password are required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    // Update the user's password
    user.password = hashedpassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Backend/controller/user.controller.js
export const allUsers = async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    // Add logging to debug
    console.log("Logged in user ID:", loggedInUser);

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");

    // Add logging to debug
    console.log("Found users:", filteredUsers.length);
  } catch (error) {
    console.log("Error in getAllUsers: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Backend/controller/user.controller.js
