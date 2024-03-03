const express = require("express");
const { createProduct, getAllProductsByUserId } = require("../controllers/productController");
const isAuthenticated = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/getAllProducts/:productOwnerId",isAuthenticated,getAllProductsByUserId);//get all products
router.post("/",isAuthenticated,createProduct);//create product

module.exports = router
