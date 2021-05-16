const express = require("express");
const router = express.Router();
const apiController = require('../controllers/apiControllers');
const invoice = require("../models/invoice");

// invoice routes

// all invoices
router.get("/invoices/all", apiController.read_all_invoices_get);
// edit invoice
router.put("/invoices/edit/:id", apiController.edit_invoice_put);


// user routes

// create user
router.post("/user", apiController.create_user_post)
// get user details
// update new user
// delete user
module.exports = router;