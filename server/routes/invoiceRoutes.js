const express = require("express");
const { createInvoice, getAllInvoicesByUserId,createPDf,fetchPdf } = require("../controllers/invoiceController");
const isAuthenticated = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/getAllInvoices/:ownerId",isAuthenticated,getAllInvoicesByUserId);//get all products
router.post("/",isAuthenticated,createInvoice);//create product
router.post("/create-pdf",isAuthenticated,createPDf);//create pdf
router.get("/fetch-pdf",isAuthenticated,fetchPdf);

module.exports = router
