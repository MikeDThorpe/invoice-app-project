const express = require("express");
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const invoice = require("../models/invoice");
const ExpressError = require("../utilities/expressError");

// homepage
router.get("/", (req, res, next) => {
    res.render("index", {
    title: "Spartan Business Solutions | Create, Receive & Send Invoices",
  });
})
// all invoices
router.get("/all", invoiceController.read_all_invoices_get);
// create new invoice
router.get("/create", invoiceController.create_invoice_get);
// single invoice
router.get("/:id", invoiceController.read_single_invoice_get)
// edit single invoice
router.get("/:id/edit", invoiceController.update_invoice_get)
// submit new invoice form
router.post("/create", invoiceController.create_invoice_post)
// submit updated invoice form
router.put("/:id/edit", invoiceController.update_invoice_put)
// delete invoice
router.delete("/:id", invoiceController.delete_invoice_delete)
// 404 route

module.exports = router;