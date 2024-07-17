const express = require("express");
const cors = require("cors");
const multer = require("multer");
const connectDb = require("./config/db");
const User = require("./models/login");
const Product = require("./models/Product");
const Buyer = require("./models/Buyer");
connectDb();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["https://productservice.netlify.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/register", async (req, res) => {
  try {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    res.send(result);
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
});

app.post("/login", async (req, res) => {
  if (req.body.password && req.body.email && req.body.role) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      res.send(user);
    } else {
      res.send({ result: "No User Found" });
    }
  } else {
    res.send({ result: "No User Found" });
  }
});

app.post("/add-product", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category,productQuantity, userId } = req.body;
    const image = req.file ? req.file.path : null;
    const product = new Product({
      name,
      price,
      category,
      productQuantity,
      userId,
      image,
    });
    const result = await product.save();
    res.status(200).json(result); 
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
});

app.get("/products", async (req, res) => {
  const products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ error: "No Data Found" });
  }
});

app.get("/customers", async (req, res) => {
  const customers = await Buyer.find();
  if (customers.length > 0) {
    res.send(customers);
  } else {
    res.send({ error: "No Data Found" });
  }
})

app.delete("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const deleteProduct = await Product.deleteOne({ _id: productId });

    const deleteBuyers = await Buyer.deleteMany({ productId: productId });

    if (deleteProduct.deletedCount > 0 || deleteBuyers.deletedCount > 0) {
      res.json({
        message: "Product and associated buyers deleted successfully",
      });
    } else {
      res.status(404).json({ error: "Product or associated buyers not found" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ error: "Failed to delete product and associated buyers" });
  }
});


app.get("/products/:id", async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "No data found" });
  }
});

app.put("/products/:id", async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.send(result);
});

app.post("/add-buyer",require('./Component/buyer'));

app.use("/uploads", express.static("uploads"));

app.listen("8000", () => {
  console.log("Server is Running");
});
