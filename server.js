const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MongoDB (local)
mongoose.connect("mongodb://localhost:27017/supermarket", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// ✅ Schemas
const staffSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number
});

const saleSchema = new mongoose.Schema({
  items: Array,
  total: Number,
  date: { type: Date, default: Date.now }
});

const Staff = mongoose.model("Staff", staffSchema);
const Product = mongoose.model("Product", productSchema);
const Sale = mongoose.model("Sale", saleSchema);

// ✅ Staff Signup
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const staff = new Staff({ name, email, password });
  await staff.save();
  res.send("Staff Registered Successfully!");
});

// ✅ Staff Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const staff = await Staff.findOne({ email, password });
  if (staff) res.send("Login Successful!");
  else res.send("Invalid Credentials!");
});

// ✅ Add Product
app.post("/addProduct", async (req, res) => {
  const { name, price } = req.body;
  const product = new Product({ name, price });
  await product.save();
  res.send("Product Added Successfully!");
});

// ✅ Get All Products
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ✅ Record Sale
app.post("/recordSale", async (req, res) => {
  const { items, total } = req.body;
  const sale = new Sale({ items, total });
  await sale.save();
  res.send("Sale Recorded Successfully!");
});

// ✅ View Daily Sales
app.get("/sales", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const start = new Date(today);
  const end = new Date(today + "T23:59:59");
  const sales = await Sale.find({ date: { $gte: start, $lte: end } });
  res.json(sales);
});

// ✅ Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
