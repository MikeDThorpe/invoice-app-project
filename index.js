const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
let methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const ejsmate = require("ejs-mate");
const routes = require("./routes");

app.listen(port);

//create database connection with mongoose
mongoose.connect("mongodb://localhost:27017/invoiceApp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

//set tools for application
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);

app.use(methodOverride("_method"));
app.use(express.static("assets"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// global middleware
app.use(routes);
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.send(message);
});
