const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/routes');
const app = express();
const PORT = 4000;

// Habilita CORS para permitir solicitudes desde el frontend
app.use(cors());

app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(req.method, req.originalUrl);
    console.log('Query Params:', req.body);
    next();
});

// Rutas con la direccion /api
app.use('/api', routes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);  
})