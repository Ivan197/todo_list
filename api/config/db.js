const mysql = require('mysql2');

// Configuración de la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todolist'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL.');
});

module.exports = db;