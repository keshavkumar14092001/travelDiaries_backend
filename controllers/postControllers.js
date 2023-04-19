const mongoose = require("mongoose");
const Post = require("../models/Post.js");
const User = require("../models/User.js");

// Conroller to get all post from the database:
const getAllPosts = async (req, res, next) => {
  let posts;
  try {
    posts = await Post.find().sort({ createdAt: -1 }).populate("user");
  } catch (error) {
    return console.log(error);
  }

  if (!posts) {
    return res
      .status(500)
      .json({ message: "Cannot fetch records from the database." });
  }

  return res.status(200).json({ posts });
};

// Controller to add post to the database:
const addPost = async (req, res, next) => {
  const { title, description, image, location, date, user } = req.body;

  if (!title || !description || !image || !location || !date || !user) {
    return res.status(422).json({ message: "All Fields are required." });
  }

  if (
    title.trim() === "" ||
    description.trim() === "" ||
    image.trim() === "" ||
    location.trim() === "" ||
    date.trim() === "" ||
    user.trim() === ""
  ) {
    return res.status(422).json({ message: "All Fields are required." });
  }

  let existingUser;

  try {
    existingUser = await User.findById(user);
  } catch (error) {
    return console.log(error);
  }

  if (!existingUser) {
    return res.status(404).json({ message: "User not found." });
  }

  let post;

  try {
    post = new Post({
      title: title,
      description: description,
      image: image,
      location: location,
      date: new Date(`${date}`),
      user: user,
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    existingUser.posts.push(post);
    await existingUser.save({ session: session });
    post = await post.save({ session: session });
    session.commitTransaction();
  } catch (error) {
    return console.log(error);
  }

  if (!post) {
    return res.status(500).json({ message: "Cannot create post." });
  }

  return res.status(201).json({ post });
};

// Retreving Post from database using that post id:
const getPostById = async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(422).json({ message: "Please provide id of the post." });
  }

  let post;

  try {
    post = await Post.findById(id);
  } catch (error) {
    return console.log(error);
  }

  if (!post) {
    return res.status(404).json({ message: "No Post Found." });
  }

  return res.status(200).json({ post });
};

// Updating the post section:
const updatePost = async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(422).json({ message: "Please provide id of the post." });
  }

  const { title, description, image, location } = req.body;

  if (!title || !description || !image || !location) {
    return res.status(422).json({ message: "All Fields are required." });
  }

  if (
    title.trim() === "" ||
    description.trim() === "" ||
    image.trim() === "" ||
    location.trim() === ""
  ) {
    return res.status(422).json({ message: "All Fields are required." });
  }

  let post;

  try {
    post = await Post.findByIdAndUpdate(id, {
      title: title,
      description: description,
      image: image,
      location: location,
    });
  } catch (error) {
    return console.log(error);
  }

  if (!post) {
    return res.status(500).json({ message: "Unable to update the post." });
  }

  return res.status(200).json({ message: "Updated Successfully." });
};

// Deleting the post with the help of id:

const deletePost = async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(422).json({ message: "Please provide id of the post." });
  }

  let post;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    post = await Post.findById(id).populate("user");
    post.user.posts.pull(post);
    await post.user.save({ session });
    post = await Post.findByIdAndRemove(id);
    session.commitTransaction();
  } catch (error) {
    return console.log(error);
  }

  if (!post) {
    return res.status(500).json({ message: "Unable to delete the post." });
  }

  return res.status(200).json({ message: "Deleted successfully." });
};

module.exports = { getAllPosts, addPost, getPostById, updatePost, deletePost };
