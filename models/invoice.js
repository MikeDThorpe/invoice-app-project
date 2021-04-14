const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
  // user: [{ type: Schema.Types.ObjectId, ref: "User" }],
  paid: Boolean,
  invoiceDate: Date,
  paymentTerms: String,
  description: String,
  fromStreet: String,
  fromCity: String,
  fromPostCode: String,
  fromCountry: String,
  clientName: String,
  clientEmail: String,
  clientStreet: String,
  clientCity: String,
  clientPostCode: String,
  clientCountry: String,
  items: [{ name: String, qty: String, price: String }],
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
