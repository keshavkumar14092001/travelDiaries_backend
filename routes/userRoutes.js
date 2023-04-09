const express = require("express");

const userRouter = express.Router();

const {
  getAllUser,
  signUp,
  logIn,
  getUserById,
} = require("../controllers/userControllers.js");

// Displaying all user route:
userRouter.get("/", getAllUser);

// Displaying single user details:
userRouter.get("/:id", getUserById);

// SignUp Route:
userRouter.post("/signup", signUp);

// LogIn Route:
userRouter.post("/login", logIn);

module.exports = userRouter;
