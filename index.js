const express = require("express");
const cors = require("cors");
const multer = require("multer");
const connectDb = require("./config/db");
const User = require("./config/login");
const Product = require("./models/Product");
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
  if (req.body.password && req.body.email) {
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
    const { name, price, category, userId, company } = req.body;
    const image = req.file ? req.file.path : null;
    const product = new Product({
      name,
      price,
      category,
      userId,
      company,
      image,
    });
    const result = await product.save();
    res.status(201).json(result); 
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

app.delete("/products/:id", async (req, res) => {
  let result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
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
