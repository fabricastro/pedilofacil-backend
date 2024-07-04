const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../../models/User");  // Asegúrate de que la importación sea correcta
const { validationResult } = require("express-validator");

const authController = {
  register: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }

      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ username, email, password: hashedPassword });
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Registration failed: " + error.message });
    }
  },

  login: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }

      const { email, password } = req.body;
      const userResult = await User.findByEmail(email);

      if (userResult.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const foundUser = userResult[0]; // Cambia el nombre de la variable local a 'foundUser'
      const isPasswordValid = await bcrypt.compare(password, foundUser.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid Password" });
      }

      const token = jwt.sign(
        { userId: foundUser.id, email: foundUser.email },
        process.env.DB_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ token: token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Login failed: " + error.message });
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
      return res.status(200).json({ message: "Token validated" });
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Invalid token" });
    }
  }
};

module.exports = authController;
