const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

const mongoose = require("mongoose");
const User = require("./models/user");
const Invoice = require("./models/invoice");

const path = require("path");
const ejsmate = require("ejs-mate");

app.listen(port);

//set tools for application
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

//serve static assets
app.use(express.static("assets"));

// global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// homepage
app.get("/", (req, res) => {
  res.render("index", { title: "Spartan Business Solutions | Create, Receive & Send Invoices" });
});
// login page
app.get("/login", (req, res) => {
  res.render("login", {});
});
// create invoice
app.get("/invoices/create", (req, res) => {
  res.render("invoices/create", { title: "Create Invoice | Spart Business Solutions" });
});
// submit new invoice form
app.post("/new/invoice", async (req, res) => {
  const invoice = new Invoice(req.body)
  await invoice.save()
  res.send(invoice)
});
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
