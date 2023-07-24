const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors());
var userCollection = mongoose.connection.collection('Users');

app.use(express.json());

app.get("/", async (req, res) => {
  return res.json({ message: "Hello, World" });
});

app.get("/friends/:genre", async (req, res) => {
  console.log("Getting friends for a user based on genre " + req.params.genre);
  const users = await userCollection.find({ "topGenre": req.params.genre });
  const result = await users.toArray();
  console.log(result);
  return res.status(201).json(result);
});

app.post("/newuser", async (req, res) => {
  console.log("Post for new user received");
  console.log(req.body);
  const updatedUser = await userCollection.findOneAndUpdate({ "email": req.body.email }, {
    $set: {
      "displayName": req.body.displayName,
      "email": req.body.email,
      "imageUrl": req.body.imageUrl,
      "topGenre": req.body.topGenre,
    }
  });

  console.log(updatedUser);
  if (!updatedUser.value) {
    console.log("Creating new user");
    const insertedUser = await userCollection.insertOne(req.body);
    return res.status(201).json(insertedUser);
  }
  return res.status(201).json(updatedUser);
});

const PORT = process.env.PORT || 8080;
const start = async () => {
  try {
    await mongoose.connect("mongodb+srv://admin-ayush:ayush-admin@cluster0.ptxlfeb.mongodb.net/Harmony?retryWrites=true&w=majority", { useNewUrlParser: true });
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}. Mongoose connection successful.`)
    );
    app.use(cors());
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();