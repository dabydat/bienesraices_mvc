import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js'

// Crear la APP
const APP = express()

// Habilitar lectura de datos de formulario
APP.use(express.urlencoded({ extended: true }))

// Conexion a la BBDD
try {
    await db.authenticate();
    db.sync();
    console.log('Conexion correcta a la BBDD');
} catch (error) {
    console.log(error);
}

// Habilitar PUG(Template Engine)
APP.set('view engine', 'pug');
APP.set('views', './views');

// Routing
APP.use('/auth', usuarioRoutes);

// Static files
APP.use(express.static('public'))

// Definir un Puerto y Correr el proyecto
const PORT = 3000

APP.listen(process.env.PORT || PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
})