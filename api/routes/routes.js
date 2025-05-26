const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');
const tasksController = require('../controllers/tasksController');

// Ruta para obtener todos los usuarios
router.get('/users', authController.getAllUsers);

// Ruta para registrar usuarios
router.post('/auth/register', authController.register);

// Ruta para iniciar sesion
router.post('/auth/login', authController.login);

// Ruta protegida que requiere autenticación con JWT
router.get('/protected', authenticateToken, (req, res) => {
    res.json({messaje: 'Acceso concedido', user: req.user});
});

// Ruta para obtener todas las tareas del usuario autenticado.
router.get('/tasks', authenticateToken, tasksController.getAllTasks);

// Ruta para crear una nueva tarea.
router.post('/tasks', authenticateToken, tasksController.createTask);

// // Ruta para actualizar una tarea existente.
router.put('/tasks/:id', authenticateToken, tasksController.updateTask);

// // Ruta para eliminar una tarea.
router.delete('/tasks/:id', authenticateToken, tasksController.deleteTask);

module.exports = router;
