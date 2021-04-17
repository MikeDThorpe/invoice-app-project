const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const asyncCatch = require("./utilities/asyncCatch");
const ExpressError = require("./utilities/expressError");
const mongoose = require("mongoose");
const User = require("./models/user");
const Invoice = require("./models/invoice");

const InvoiceSchema = require("./schemas/invoice");

const path = require("path");
const ejsmate = require("ejs-mate");

app.listen(port);

//set tools for application
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);

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
app.get("/", async (req, res) => {
  const invoices = await Invoices.find()

  res.render("index", {
    title: "Spartan Business Solutions | Create, Receive & Send Invoices",
    ...invoices
  });
});
// login page
app.get("/login", (req, res) => {
  res.render("login", {});
});
// create invoice
app.get("/invoices/create", (req, res) => {
  res.render("invoices/create", {
    title: "Create Invoice | Spartan Business Solutions",
  });
});
// submit new invoice form
app.post(
  "/new/invoice",
  asyncCatch(async (req, res) => {
    const invoice = req.body;
    invoice.paid = false;
    const price = [];
    for (let item of req.body.items) {
      const itemPrice = item.price * item.qty;
      price.push(itemPrice);
    }
    invoice.invoiceTotal = price.reduce((a, b) => a + b);

    const validateInvoice = await InvoiceSchema.validate(invoice);
    if (validateInvoice.error) {
      throw new Error(validateInvoice.error);
    }
    try {
      const newInvoice = new Invoice(invoice);
      await newInvoice.save();
      res.redirect(`/invoices/${newInvoice._id}`);
    }
    catch (e) {
      console.log(e)
      res.redirect(`/invoices/create`);
    }
  })
);
// all invoices
app.get("/invoices", (req, res) => {
  res.render("invoices/all", {});
});
// single invoice
app.get("/invoices/:id", async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  res.render("invoices/single", { title: "Invoice", invoice });
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
app.all("*", (req, res, next) => {
  next(new ExpressError("404", "Page not found"));
});
//custom error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.send(message);
});
