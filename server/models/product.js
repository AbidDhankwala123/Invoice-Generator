const mongoose = require("mongoose");
const User = require("./user");

const invoiceSchema = new mongoose.Schema({

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    products: [
        {
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            rate: {
                type: Number,
                required: true
            },
            total: {
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

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice