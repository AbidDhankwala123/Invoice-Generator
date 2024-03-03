const Product = require("../models/product");
const puppeteer = require("puppeteer");

//Get All Products
const getAllProductsByUserId = async (req, res) => {
    try {
        const { productOwnerId } = req.params;

        //Get All Products
        const products = await Product.find({ productOwnerId }).sort({ createdAt: 1 });

        res.status(200).json({
            status: "SUCCESS",
            products
        });
    } catch (error) {
        console.log(error);
        res.status(400);
        return next(new Error(error.message));
    }
};

//Create product
const createProduct = async (req, res) => {
    try {
        const { productOwnerId, products,totalAmount,grandTotal } = req.body;

        const newProduct = await Product.create({ productOwnerId, products,totalAmount,grandTotal });

        res.status(200).json({
            message: "Product created successfully",
            newProduct
        })
    } catch (error) {
        console.log(error);
        res.status(400);
        return next(new Error(error.message));
    }
}


module.exports = { createProduct, getAllProductsByUserId }
