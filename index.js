const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
let methodOverride = require("method-override");
const asyncCatch = require("./utilities/asyncCatch");
const ExpressError = require("./utilities/expressError");
const mongoose = require("mongoose");
const User = require("./models/user");
const Invoice = require("./models/invoice");
const InvoiceSchema = require("./schemas/invoice");
const path = require("path");
const ejsmate = require("ejs-mate");

app.listen(port);

// global middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
//serve static assets
app.use(express.static("assets"));

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

// homepage
app.get("/", (req, res) => {
  res.render("index", {
    title: "Spartan Business Solutions | Create, Receive & Send Invoices",
  });
});
//process edited invoice
app.put("/invoices/:id/edit", async (req, res, next) => {
  const newData = req.body;
  const oldData = await Invoice.findById(req.params.id)
  newData.paid = oldData.paid
  newData.invoiceTotal = oldData.invoiceTotal;
  const filter = { _id: req.params.id }
  const price = [];
      for (let item of req.body.items) {
        const itemPrice = item.price * item.qty;
        price.push(itemPrice);
      }
  newData.invoiceTotal = price.reduce((a, b) => a + b);
  const validateNewData = await InvoiceSchema.validate(newData);
  if (validateNewData.error) {
    throw new Error(validateNewData.error);
  }
  try {
    let newInvoice = await Invoice.findOneAndUpdate(filter, newData);
    await newInvoice.save()
    res.redirect(`/invoices/${req.params.id}`)

  } catch (e) {
    console.log(e);
        next(new ExpressError("500", "Unable to edit invoice at this time"));

  }
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
    } catch (e) {
      console.log(e);
      res.redirect(`/invoices/create`);
    }
  })
);
// all invoices
app.get("/invoices", async (req, res) => {
  const invoices = await Invoice.find();
  res.render("invoices/all", {
    title: "Invoices | Spartan Business Solutions",
    invoices,
  });
});
// single invoice
app.get("/invoices/:id", async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  res.render("invoices/single", { title: "Invoice", invoice });
});
// edit invoice
app.get("/invoices/:id/edit", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    res.render("invoices/edit", {
      title: "Edit Invoice | Spartan Business Solutions",
      invoice,
    });
  } catch {
    next(new ExpressError("404", `No Invoice found with id ${req.params.id}`));
  }
});
// delete invoice
app.delete("/invoices/:id", async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    await Invoice.deleteOne(invoice);
    res.redirect(`/invoices`);
  } catch {
    next(new ExpressError("500", "Unable to delete invoice at this time"));
  }
});
// account details
app.get("/account", (req, res) => {
  res.render("account", {});
});
app.put("/invoices/:id", async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    invoice.paid = !invoice.paid;
    await invoice.save();
    res.redirect(`/invoices/${req.params.id}`);
  } catch {
    next(new ExpressError("500", "Unable to delete invoice at this time"));
  }
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
