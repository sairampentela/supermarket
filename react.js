import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [page, setPage] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [sales, setSales] = useState([]);

  const backendURL = "http://localhost:5000";

  // 🔹 Login
  const handleLogin = async () => {
    const res = await axios.post(`${backendURL}/login`, { email, password });
    alert(res.data);
    if (res.data === "Login Successful!") setPage("dashboard");
  };

  // 🔹 Add Product
  const addProduct = async () => {
    await axios.post(`${backendURL}/addProduct`, { name, price });
    alert("Product Added!");
    fetchProducts();
    setName("");
    setPrice("");
  };

  // 🔹 Fetch Products
  const fetchProducts = async () => {
    const res = await axios.get(`${backendURL}/products`);
    setProducts(res.data);
  };

  // 🔹 Record Sale
  const recordSale = async () => {
    if (items.length === 0) return alert("Cart is empty!");
    await axios.post(`${backendURL}/recordSale`, { items, total });
    alert("Sale Recorded!");
    setItems([]);
    setTotal(0);
  };

  // 🔹 View Daily Sales
  const viewSales = async () => {
    const res = await axios.get(`${backendURL}/sales`);
    setSales(res.data);
    setPage("sales");
  };

  // 🔹 Add to Cart
  const addToCart = (p) => {
    setItems([...items, p]);
    setTotal(total + p.price);
  };

  useEffect(() => {
    if (page === "dashboard") fetchProducts();
  }, [page]);

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      {page === "login" && (
        <div>
          <h2>Staff Login</h2>
          <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br />
          <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} /><br />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}

      {page === "dashboard" && (
        <div>
          <h2>Supermarket Dashboard</h2>
          <button onClick={() => setPage("add")}>Add Product</button>
          <button onClick={() => setPage("shop")}>Shop</button>
          <button onClick={viewSales}>View Sales</button>
        </div>
      )}

      {page === "add" && (
        <div>
          <h2>Add Product</h2>
          <input placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} /><br />
          <input placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} /><br />
          <button onClick={addProduct}>Add</button><br />
          <button onClick={() => setPage("dashboard")}>Back</button>
        </div>
      )}

      {page === "shop" && (
        <div>
          <h2>Product List</h2>
          {products.map((p) => (
            <div key={p._id} style={{ border: "1px solid gray", margin: "5px", padding: "5px" }}>
              <p>{p.name} - ₹{p.price}</p>
              <button onClick={() => addToCart(p)}>Add to Cart</button>
            </div>
          ))}
          <h3>Cart</h3>
          {items.map((i, index) => (
            <p key={index}>{i.name} - ₹{i.price}</p>
          ))}
          <h4>Total: ₹{total}</h4>
          <button onClick={recordSale}>Confirm Sale</button><br />
          <button onClick={() => setPage("dashboard")}>Back</button>
        </div>
      )}

      {page === "sales" && (
        <div>
          <h2>Today's Sales</h2>
          {sales.map((s, i) => (
            <div key={i} style={{ border: "1px solid gray", margin: "5px", padding: "5px" }}>
              <p><b>Date:</b> {new Date(s.date).toLocaleString()}</p>
              <p><b>Total:</b> ₹{s.total}</p>
            </div>
          ))}
          <button onClick={() => setPage("dashboard")}>Back</button>
        </div>
      )}
    </div>
  );
}

export default App;
