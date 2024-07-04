const db = require("../config/database");

const User = {
  findByEmail: async (email) => {
    try {
      const connection = await db.getConnection();
      const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);
      
      if (rows.length === 0) {
        return null; // No se encontró ningún usuario
      }
      
      return rows[0]; // Devolver el primer usuario encontrado
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },
};

module.exports = User;
