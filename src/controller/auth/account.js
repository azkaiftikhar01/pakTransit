const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { insertIntoTable, dbOperations } = require("../../utils/common");
require('dotenv').config();

const registerAuthController = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const { user_role } = req.params; 
      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const role = user_role === "admin" ? "admin" : "user";
      const user = await dbOperations("insert","public.users", {
        name,
        email,
        password: hashedPassword,
        role,
      });
      console.log(user[0])
      const token = jwt.sign(
        { id: user[0].id, email: user[0].email, role: user[0].role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
  
      res.status(201).json({
        message: "User registered successfully",
        user: { id: user[0].id, email: user[0].email, role: user[0].role },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

const loginAuthController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Fetch user by email
    const users = await dbOperations("select", "users", {}, { where: { email } });

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ message: "Login successful", user: { id: user.id, email: user.email, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { registerAuthController,loginAuthController };
