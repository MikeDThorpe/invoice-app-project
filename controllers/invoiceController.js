const mongoose = require("mongoose");
const Invoice = require("../models/invoice");
const InvoiceSchema = require("../schemas/invoice");
const ExpressError = require("../utilities/expressError");

exports.create_invoice_get = async (req, res, next) => {
  res.render("invoices/create", {
    title: "Create Invoice | Spartan Business Solutions",
  });
};
exports.create_invoice_post = async (req, res, next) => {
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
exports.read_all_invoices_get = async (req, res, next) => {
  const invoices = await Invoice.find();
  res.render("invoices/all", {
    title: "All Invoices",
    invoices,
  });
};
exports.api_read_all_invoices_get = async (req, res, next) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).send(invoices)
  }
  catch {
    res.status(500).send({errorMsg: "Unable to get invoices."})
  }
}
exports.read_single_invoice_get = async (req, res, next) => {
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
exports.delete_invoice_delete = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    await Invoice.deleteOne(invoice);
    res.redirect(`/invoices/all`);
  } catch {
    next(new ExpressError("500", "Unable to delete invoice at this time"));
  }
};
exports.update_invoice_get = async (req, res, next) => {
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
exports.update_invoice_put = async (req, res, next) => {
  const oldData = await Invoice.findById(req.params.id);
  if (req.query.setPaid) {
    try {
      oldData.paid = !oldData.paid;
      await oldData.save();
      res.redirect(`/invoices/${req.params.id}`);
    } catch {
      next(new ExpressError("500", "Unable to delete invoice at this time"));
    }
  } else {
    const newData = req.body;
    newData.paid = oldData.paid;
    newData.invoiceTotal = oldData.invoiceTotal;
    const filter = { _id: req.params.id };
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
      await newInvoice.save();
      res.redirect(`/invoices/${req.params.id}`);
    } catch (e) {
      console.log(e);
      next(new ExpressError("500", "Unable to edit invoice at this time"));
    }
  }
};