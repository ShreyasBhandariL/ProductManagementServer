const Buyer = require("../models/Buyer");

const AddBuyer =  async (req, res) => {
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
    res.status(200).json({ result: "Buyed the product" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save buyer information" });
  }
};

module.exports = AddBuyer;
