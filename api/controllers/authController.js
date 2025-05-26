const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Obtener todos los usuarios
exports.getAllUsers = (req, res) => {
  db.query("SELECT * FROM users", async (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    res.status(200).json({ message: "consulta con éxito", data: results });
  });
};

// Registrar un nuevo usuario
exports.register = async (req, res) => {
  const { username, password, firstname, lastname, active } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
   // Verificar si el usuario ya existe
  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.status(200).json({ message: "El nombre de usuario ya está en uso" });
    }

    // Si no existe, continuar con el registro
    db.query(
      "INSERT INTO users (username, password, firstname, lastname, active) VALUES (?, ?, ?, ?, ?)",
      [username, hashedPassword, firstname, lastname, active],
      (err, results) => {
        if (err) return res.status(200).json({ error: err.message });
        res.status(200).json({ message: "Usuario registrado con éxito", statusCode: 202 });
      }
    );
  });
};

// Iniciar sesión
exports.login = (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "Error en el servidor" });
      if (results.length === 0)
        return res.status(200).json({ message: "Usuario no encontrado", statusCode: 400 });

      const user = results[0];
      console.log("Contraseña ingresada:", password);
      console.log("Contraseña almacenada (hash):", user.password);
      
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(202).json({ message: "Contraseña incorrecta", statusCode: 403 });

      const token = jwt.sign(
        { username: user.username, id: user.id, name: user.firstname, lastname: user.lastname },
        "SECRET_KEY",
        { expiresIn: "10m" }
      );

      res.json({
        message: "Inicio de sesión exitoso",
        token,
        statusCode: 202,
        user: {
          id: user.id,
          username: user.username,
        },
      });
    }
  );
};
