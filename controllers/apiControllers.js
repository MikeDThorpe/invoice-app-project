const mongoose = require("mongoose");
const Invoice = require("../models/invoice");
const InvoiceSchema = require("../schemas/invoice");

exports.read_all_invoices_get = async (req, res) => {
  const filter = req.query.filter;
  let invoices;
  try {
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
    } else {
      invoices = await Invoice.find();
    }
    res.status(200).send(invoices);
  } catch {
    res.status(500).send({ errorMsg: "Unable to get invoices." });
  }
}