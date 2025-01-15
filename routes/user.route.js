// Backend/routes/user.route.js
import express from "express";
// Add to user.route.js

import {
  allUsers,
  login,
  logout,
  signup,
  changePassword,
} from "../controller/user.controller.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/change-password", changePassword);
router.get("/allusers", secureRoute, allUsers);

// Backend/routes/user.route.js

// Error handling middleware for multer

export default router;
