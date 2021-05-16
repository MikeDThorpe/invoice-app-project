const mongoose = require("mongoose");
const Invoice = require("../models/invoice");
const User = require("../models/user");
const InvoiceSchema = require("../schemas/invoice");
const UserSchema = require("../schemas/user");
const asyncCatch = require("../utilities/asyncCatch");

const read_all_invoices_get = async (req, res) => {
  const filter = req.query.filter;
  const query = req.query.clientName;
  let invoices;
  try {
    if (!query && !filter) {
      invoices = await Invoice.find();
    }
    if (query) {
      invoices = await Invoice.find({
        clientName: {
          $regex: new RegExp(query),
        },
      });
    }
    if (filter) {
      if (filter === "all") {
        invoices = await Invoice.find();
      }
      if (filter === "pending") {
        invoices = await Invoice.find({ paid: false });
      }
      if (filter === "paid") {
        invoices = await Invoice.find({ paid: true });
      }
    }
    res.status(200).send(invoices);
  } catch {
    res.status(500).send({ errorMsg: "Unable to get invoices." });
  }
};
const edit_invoice_put = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    res.status(400).send(`No invoice with exist with that id ${req.params.id}`);
  }
  if (req.query.changePaid) {
    invoice.paid = !invoice.paid;
    try {
      await invoice.save();
      res.status(200).send(invoice);
    } catch {
      res.status(500);
    }
  } else {
    const newData = req.body;
    newData.paid = invoice.paid;
    newData.invoiceTotal = invoice.invoiceTotal;
    const filter = { _id: req.params.id };
    const price = [];
    for (let item of req.body.items) {
      const itemPrice = item.price * item.qty;
      price.push(itemPrice);
    }
    newData.invoiceTotal = price.reduce((a, b) => a + b);
    const validateNewData = await InvoiceSchema.validate(newData);
    if (validateNewData.error) {
      next(new ExpressError("400"), "Incorrect Data Types.");
    }
    try {
      let newInvoice = await Invoice.findOneAndUpdate(filter, newData);
      await newInvoice.save();
      res.redirect(`/invoices/${req.params.id}`);
    } catch (e) {
      console.log(e);
      next(new ExpressError("500", "Unable to edit invoice at this time"));
    }
  }
};
const create_user_post = async (req, res, next) => {
  const userDetails = req.body;
  userDetails.initials =
    userDetails.firstName[0].toUpperCase() +
    userDetails.lastName[0].toUpperCase();
  const validateUserDetails = await UserSchema.validate(userDetails);
  if (validateUserDetails.error) {
    req.flash("error", "Invalid user details");
    res.redirect("/register");
    console.error(validateUserDetails.error);
  }

  try {
    const { firstName, lastName, username, email, password, initials } = req.body;
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      initials,
    });
    const registeredNewUser = await User.register(newUser, password);
    console.log(registeredNewUser);
    req.flash("success", "New User Created!");
    res.redirect("/register");
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Server error" });
  }
};

module.exports = {
  read_all_invoices_get,
  edit_invoice_put,
  create_user_post,
};
