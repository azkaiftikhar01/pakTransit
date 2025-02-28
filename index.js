require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const  pool  =require("./src/config/dbpool");
const authRoutes=require("./src/routes/auth")
const adminOperations=require("./src/routes/adminOperations")
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json()); 

pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Database connection error:", err.stack);
  } else {
    console.log("✅ Connected to PostgreSQL");
    release();
  }
});
app.get("/", (req, res) => {
  res.send("🚀 Bus Tracker API is running!");
});
app.use("/auth", authRoutes);
app.use("/admin", adminOperations);
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
