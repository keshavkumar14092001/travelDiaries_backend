const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRoutes.js");
const postRouter = require("./routes/postRoutes.js");
const cors = require("cors");

const app = express();
dotenv.config();

const PORT = process.env.PORT;

// Allowing request from other platform:
app.use(cors());

// Allowing express to read JSON data:
app.use(express.json());

// Middleware:
app.use("/user", userRouter);
app.use("/posts", postRouter);

// Connecting to mongodb:
mongoose
  .connect(`${process.env.URL}`)
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Connected to mongodb and running on PORT ${PORT}`);
    })
  )
  .catch((err) => {
    console.log(err);
  });
