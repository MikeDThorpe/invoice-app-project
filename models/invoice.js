const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
  user: [{ type: Schema.Types.ObjectId, ref: "User" }],
  invoiceDate: Date,
  paymentTerms: String,
  description: String,
  addressFrom: {
    street: String,
    city: String,
    postCode: String,
    country: String,
  },
  client: {
    name: String,
    email: String,
    address: {
      street: String,
      city: String,
      postCode: String,
      country: String,
    }
  },
  items: [{ name: String, quantity: String, price: String }],
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
