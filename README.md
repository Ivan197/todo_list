****************  INSTRUCCIONES PARA LA INSTALACIÓN Y EJECUCIÓN  ****************

1. Clonar el repositorio con el siguiente comando:
   git clone https://github.com/tu-usuario/tu-repo.git

2. Acceder al directorio del backend:
   cd todo_list/api

3. Instalar las dependencias necesarias:
   npm install

4. Iniciar el servidor en modo desarrollo:
   npm run dev

5. Abrir una nueva terminal y dirigirse al directorio del frontend:
   cd ../app_web

6. Instalar las dependencias del frontend:
   npm install

7. Iniciar la aplicación web:
   npm start


****************  DESICIONES DE DISEÑO Y ARQUITECTURA  ****************

- Separación Frontend/Backend: 
  Se optó por una arquitectura desacoplada, donde el frontend (React) y el backend (Node.js + Express) se encuentran en carpetas independientes. Esto permite escalar, mantener y desplegar ambos proyectos de forma separada.

- Autenticación con JWT:
  El backend utiliza JSON Web Tokens (JWT) para gestionar la autenticación del usuario. Esta técnica permite verificar sesiones de forma segura, sin almacenar datos sensibles en el servidor.

- Base de datos relacional:
  El sistema se conecta a una base de datos MySQL, permitiendo almacenar usuarios, tareas y estados con integridad relacional. Se utiliza un esquema estructurado y consultas eficientes.

- Manejo de estado con Redux:
  El frontend emplea Redux para gestionar el estado global de autenticación y las tareas del usuario, garantizando una sincronización fluida de datos entre componentes y vistas.

- Componentes reutilizables:
  Se implementaron componentes que permiten reutilizar la lógica para crear y editar tareas, promoviendo un código más limpio, mantenible y escalable.

- Rutas protegidas:
  Se aplican rutas protegidas en React para evitar el acceso a partes sensibles de la aplicación si el usuario no está autenticado.



****************  INSTRUCCIONES PARA CREAR BD  ****************
CREATE DATABASE IF NOT EXISTS todolist;
USE todolist;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  active INT(1) NOT NULL
);

CREATE TABLE status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL
);

INSERT INTO status (title) VALUES 
('Pendiente'),
('En progreso'),
('Completada');

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    status_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES status (id)
);

