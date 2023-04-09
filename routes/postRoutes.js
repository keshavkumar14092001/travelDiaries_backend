const express = require("express");
const {
  getAllPosts,
  addPost,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postControllers.js");

const postRouter = express.Router();

// Displaying all post from the database:
postRouter.get("/", getAllPosts);

// Retreving Post using id:
postRouter.get("/:id", getPostById);

// Adding post to the database:
postRouter.post("/", addPost);

// Updating the post using id:
postRouter.put("/:id", updatePost);

// Deleting the post using id:
postRouter.delete("/:id", deletePost);

module.exports = postRouter;
