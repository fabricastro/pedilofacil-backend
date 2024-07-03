const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../../../models/user");
const { validationResult } = require("express-validator");

const authController = {
  register: async (req, res) => {
    try {
      // Validate the user input
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }

      const { username, email, password } = req.body;
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create the user in the database
      await user.create({ username, email, password: hashedPassword });
      res.status(201).json({ message: "user registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Registration failed: " + error.message });
    }
  },

  login: async (req, res) => {
    try {
      // Validate the user input
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }

      const { email, password } = req.body;
      // Find the user by email
      const [rows] = await user.findByEmail(email);

      if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = rows[0];
      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid Password" });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.DB_SECRET,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({ token: token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Login failed" });
    }
  },

  validateToken: (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    try {
      const decoded = jwt.verify(token, process.env.DB_SECRET);
      req.userId = decoded.userId;
      return res.status(200).json({ message: "Token validate" })
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Invalid token" });
    }
  }
};

module.exports = authController;
