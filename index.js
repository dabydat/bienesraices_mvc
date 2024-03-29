import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import db from './config/db.js'

// Crear la APP
const APP = express()

// Habilitar lectura de datos de formulario
APP.use(express.urlencoded({ extended: true }))

// Habilitar cookie Parser
APP.use(cookieParser())

// Habilitar CSRF
APP.use(csrf({ cookie: true }))

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
APP.use('/', propiedadesRoutes);

// Static files
APP.use(express.static('public'))

// Definir un Puerto y Correr el proyecto
const PORT = 8500

APP.listen(process.env.PORT || PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
})