const Buyer = require("../models/Buyer");
const Product = require("../models/Product");

const AddBuyer = async (req, res) => {
  try {
    const {
      productId,
      productName,
      productPrice,
      productCategory,
      quantity,
      buyerName,
      buyerContact,
    } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.productQuantity < quantity) {
      return res.status(400).json({ error: "Insufficient product quantity" });
    }

    product.productQuantity -= quantity;

    if (product.productQuantity === 0) {
      await Product.deleteOne({ _id: productId });
    } else {
      await product.save();
    }

    const newBuyer = new Buyer({
      productId,
      productName,
      productPrice,
      productCategory,
      quantity,
      buyerName,
      buyerContact,
    });

    await newBuyer.save();
    res.status(200).json({ result: "Product purchased successfully" });
  } catch (error) {
    console.error("Error purchasing product:", error);
    res.status(500).json({ error: "Failed to save buyer information" });
  }
};

module.exports = AddBuyer;
