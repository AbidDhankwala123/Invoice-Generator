const mongoose = require("mongoose");
const User = require("./user");

const productSchema = new mongoose.Schema({

    productOwnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    products: [
        {
            productName: {
                type: String,
                required: true
            },
            productQuantity: {
                type: Number,
                required: true
            },
            productRate: {
                type: Number,
                required: true
            },
            productTotal: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number
    },
    appliedGST: {
        type: String,
        default: "18%"
    },
    grandTotal: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

const Product = mongoose.model("Product", productSchema);

module.exports = Product