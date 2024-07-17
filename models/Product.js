const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    price: String,
    category: String,
    productQuantity: Number,
    userId: String,
    image: String,
});

module.exports = mongoose.model("products", productSchema);