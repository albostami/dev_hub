const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const profile = require("./routes/api/profile");
const users_auth = require("./routes/api/users");
const posts = require("./routes/api/posts");

const app = express();

// Body parser middle
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("<h1>Hello world!</h1>"));

//Use Routes
app.use("/api/users", users_auth)     ;
app.use("/api/profile", profile)      ;
app.use("/api/posts", posts)          ;

const port = process.env.PORT || 5000 ;

app.listen(port, () => console.log(`Server running on port ${port}`));
