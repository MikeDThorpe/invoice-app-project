const express = require("express");
const router = express.Router();
const invoiceController = require('./controllers/invoiceController');
const invoice = require("./models/invoice");
const ExpressError = require("./utilities/expressError");

// homepage
router.get("/", (req, res, next) => {
    res.render("index", {
    title: "Spartan Business Solutions | Create, Receive & Send Invoices",
  });
})
// all invoices
router.get("/invoices", invoiceController.read_all_invoices_get);
// create new invoice
router.get("/invoices/create", invoiceController.create_invoice_get);
// single invoice
router.get("/invoices/:id", invoiceController.read_single_invoice_get)
// edit single invoice
router.get("/invoices/:id/edit", invoiceController.update_invoice_get)
// submit new invoice form
router.post("/invoices/create", invoiceController.create_invoice_post)
// submit updated invoice form
router.put("/invoices/:id/edit", invoiceController.update_invoice_put)
// 404 route
router.get("*", (req, res, next) => {
  next(new ExpressError("404", "Page not found"));
});

module.exports = router;