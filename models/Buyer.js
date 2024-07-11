const mongoose = require("mongoose");

const buyerSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productCategory: { type: Number, required: true },
  quantity: { type: Number, required: true },
  buyerName: { type: String, required: true },
  buyerContact: { type: String, required: true },
});

const Buyer = mongoose.model("buyers", buyerSchema);

module.exports = Buyer;
