const Buyer = require("../models/Buyer");

const AddBuyer =  async (req, res) => {
  try {
    const {
      productId,
      productName,
      productPrice,
      quantity,
      buyerName,
      buyerContact,
    } = req.body;

    const newBuyer = new Buyer({
      productId,
      productName,
      productPrice,
      quantity,
      buyerName,
      buyerContact,
    });

    const savedBuyer = await newBuyer.save();
    res.status(201).json(savedBuyer);
  } catch (error) {
    console.error("Error saving buyer information:", error);
    res.status(500).json({ error: "Failed to save buyer information" });
  }
};

module.exports = AddBuyer;
