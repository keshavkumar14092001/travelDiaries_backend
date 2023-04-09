const User = require("../models/User.js");
const { hashSync, compareSync } = require("bcryptjs");

// Function to display all User:
const getAllUser = async (req, res) => {
  let users;
  try {
    users = await User.find();
  } catch (error) {
    return console.log(error);
  }

  if (!users) {
    return res.status(500).json({ message: "Something went wrong" });
  }

  return res.status(200).json({ users });
};

// Displaying a single user using id:
const getUserById = async (req, res) => {
  const id = req.params.id;

  let user;

  try {
    user = await User.findById(id).populate("posts");
  } catch (error) {
    return console.log(error);
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ user });
};

// Registering a new User:
const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({ message: "All Fields are required." });
  }

  if (password.length < 6) {
    return res
      .status(422)
      .json({ message: "Password must have more than 6 characters." });
  }

  if (name.trim() === "" || email.trim === "") {
    return res
      .status(422)
      .json({ message: "Please provide valid credintials." });
  }

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return console.log(error);
  }

  if (existingUser) {
    return res
      .status(422)
      .json({ message: "This email is already registered." });
  }

  const hashedPassword = hashSync(password);

  let user;
  try {
    user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });
    await user.save();
  } catch (error) {
    return console.log(error);
  }

  if (!user) {
    return res.status(500).json({ message: "Internal server error." });
  }

  return res.status(201).json({ user });
};

// Login a User:
const logIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ message: "All fields are required." });
  }

  if (password.length < 6) {
    return res
      .status(422)
      .json({ message: "Password must have more than 6 characters." });
  }

  if (email.trim === "") {
    return res
      .status(422)
      .json({ message: "Please provide valid credintials." });
  }

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return console.log(error);
  }

  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordCorrect = compareSync(password, existingUser.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  return res
    .status(200)
    .json({ id: existingUser._id, message: "Login Successfull" });
};

module.exports = { getAllUser, signUp, logIn, getUserById };
