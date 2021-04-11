const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

const mongoose = require("mongoose");
const User = require("./models/user");
const Invoice = require("./models/invoice");

const path = require("path");
const ejsmate = require("ejs-mate");

app.listen(port);

//serve static assets
app.use(express.static('assets'))

//set tools for application
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//create database connection with mongoose
mongoose.connect("mongodb://localhost:27017/myapp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// homepage
app.get("/", (req, res) => {
  res.render("index", {title: "Spartan Invoicing"});
});
// login page
app.get("/login", (req, res) => {
  res.render("login", {});
});
// create invoice
app.get("/invoices/create", (req, res) => {
  res.render("invoices/create", {title: "Create Invoice"})
})
// all invoices
app.get("/invoices", (req, res) => {
  res.render("invoices/all", {});
});
// single invoice
app.get("/invoices/:id", (req, res) => {
  res.render("invoices/single", {});
});
// edit invoice
app.get("/invoices/:id/edit", (req, res) => {
  res.render("invoices/edit", {});
});
// account details
app.get("/account", (req, res) => {
  res.render("account", {});
});
// 404 route
app.get("*", (req, res) => {
  res.send("404 Page Not Found!");
});