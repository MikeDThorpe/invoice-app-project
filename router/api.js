const express = require("express");
const router = express.Router();
const apiController = require('../controllers/apiControllers');
const invoice = require("../models/invoice");

// all invoices
router.get("/all", apiController.read_all_invoices_get);

module.exports = router;