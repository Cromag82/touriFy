const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const path = require('path');
const app = express();
const dbs = require('./service/initializeDatabase').initializeDatabase()
require('dotenv').config()
const cookieParser = require('cookie-parser')

// Middleware
app.use(express.static('assets'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs'); // Configura EJS para las vistas
app.set('views', path.join(__dirname, 'views'))

//iniciamos bbdd
dbs;

//TODO crear página modificar de password
//TODO crear página para asignación de roles

// Rutas
app.use(routes);

// Inicia el servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Sirviendo en http://localhost:${PORT}`);
});