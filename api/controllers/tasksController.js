const db = require("../config/db");
// // Obtener estatus
// exports.getAllStatuses = (req, res) => {
//   const query = 'SELECT id, title FROM status';

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error al obtener los estados:', err);
//       return res.status(500).json({ error: 'Error del servidor' });
//     }

//     res.status(200).json({ message: "consulta con éxito", data: results, statusCode: 202 });
//   });
// };

// Obtener todas las tareas del usuario
exports.getAllTasks = (req, res) => {
  const user_id = req.user.id;
  console.log(user_id);

  db.query(
    "SELECT t.id, t.title, t.description, CONCAT(DATE(t.creation_date), ' ', TIME(t.creation_date)) fecha_hora, s.title status_title, t.status_id FROM tasks t LEFT JOIN users u on u.id = t.user_id LEFT JOIN status s on s.id = t.status_id WHERE user_id = ?",
    [user_id],
    async (err, results) => {
      console.log(results);
      console.log(results.length);
      if (err) return res.status(500).json({ error: "Error en el servidor" });

      if (results.length === 0)
        return res.status(200).json({ message: "El usuario no tiene tareas", statusCode: 203 }); // status 203 para informar que no existen tares del usuario

      res.status(200).json({
          message: "consulta con éxito",
          data: results,
          statusCode: 202,
        }); // status 202 para informar ok en la consulta y devuelve datos
    }
  );
};

// Registrar una nueva tarea
exports.createTask = async (req, res) => {
  const user_id = req.user.id;
  const { title, description } = req.body;

  db.query(
    "INSERT INTO tasks (title, description, creation_date, user_id, status_id) VALUES (?, ?, NOW(), ?, 1)",
    [title, description, user_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res
        .status(200)
        .json({ message: "Tarea registrada con éxito", statusCode: 202 });
    }
  );
};

// Eliminar tarea
exports.deleteTask = async (req, res) => {
    console.log(req.params);
    
  const { id } = req.params;
  const userId = req.user.id;

  db.query(
    "DELETE FROM tasks WHERE id = ? AND user_id = ?",
    [id, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (result.affectedRows === 0) 
        return res.status(404).json({ message: "Tarea no encontrada o no autorizada" });
        
      res.status(200).json({ message: "Tarea eliminada correctamente", statusCode: 202 });
    }
  );
};

// Editar tarea
exports.updateTask = (req, res) => {
  console.log(req);

  const taskId = req.params.id;
  const { title, description, status_id } = req.body;

  if (!title || !description || !status_id) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios." });
  }

  const query = `
    UPDATE tasks 
    SET title = ?, description = ?, status_id = ? 
    WHERE id = ?
  `;

  db.query(query, [title, description, status_id, taskId], (err, result) => {
    if (err) {
      console.error("Error al actualizar tarea:", err);
      return res.status(500).json({ message: "Error del servidor." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tarea no encontrada." });
    }

    res.json({ message: "Tarea actualizada correctamente." });
  });
};
