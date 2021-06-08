const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// app.use(cors()); // middlware
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const exercisesRouter = require("./routes/exercises");
const usersRouter = require("./routes/users");

app.use("/exercises", exercisesRouter);
app.use("/users", usersRouter);

const ___dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(___dirname, "/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(___dirname, "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
