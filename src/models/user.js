const db = require("../config/database");

const user = {
  create: async (userData) => {
    const { username, email, password } = userData;
    try {
      const [result] = await db.execute(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, password]
      );
      return result;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },

  findByEmail: async (email) => {
    try {
      const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
      return rows[0];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },
};

module.exports = user;
