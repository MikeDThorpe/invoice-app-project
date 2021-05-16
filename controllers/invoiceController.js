const mongoose = require("mongoose");
const Invoice = require("../models/invoice");
const InvoiceSchema = require("../schemas/invoice");
const ExpressError = require("../utilities/expressError");

const create_invoice_get = async (req, res, next) => {
  res.render("invoices/create", {
    title: "Create Invoice | Spartan Business Solutions",
  });
};
const create_invoice_post = async (req, res, next) => {
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
};
const read_all_invoices_get = async (req, res, next) => {
  const invoices = await Invoice.find();
  res.render("invoices/all", {
    title: "All Invoices",
    invoices,
  });
};
const read_single_invoice_get = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    res.render("invoices/single", {
      title: "Invoices",
      invoice,
    });
  } catch {
    next(new ExpressError("404", `No Invoice found with id ${req.params.id}`));
  }
};
const delete_invoice_delete = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    await Invoice.deleteOne(invoice);
    res.redirect(`/invoices/all`);
  } catch {
    next(new ExpressError("500", "Unable to delete invoice at this time"));
  }
};
const update_invoice_get = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    res.render("invoices/edit", {
      title: "Edit Invoice | Spartan Business Solutions",
      invoice,
    });
  } catch {
    next(new ExpressError("404", `No Invoice found with id ${req.params.id}`));
  }
};

module.exports = {
  create_invoice_get,
  create_invoice_post,
  read_all_invoices_get,
  read_single_invoice_get,
  delete_invoice_delete,
  update_invoice_get,
};