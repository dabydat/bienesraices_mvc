import { check, validationResult } from "express-validator";
import { createUsuarioErrors, findUserExistence, createUser, validateAccountByToken } from "../services/usuarioService.js";
import { emailRegister } from "../helpers/email.js";

const formularioLogin = (request, response) => {
    response.render('auth/login', {
        pageName: 'Login'
    });
}

const formularioRegister = (request, response) => {
    response.render('auth/register', {
        pageName: 'Sign Up'
    });
}

const sendRegister = async (request, response) => {
    const { nombre, email, password } = request.body;
    // Validacion
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(request)
    await check('email').isEmail().withMessage('No cumple con el formato de un correo').run(request)
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe contener al menos 6 carácteres').run(request)
    await check('repetir_password').equals(password).withMessage('Las contraseñas no coinciden').run(request)
    let resultado = validationResult(request);
    let userExists = await findUserExistence(email);
    let errors = userExists != null ? userExists : createUsuarioErrors(resultado);
    if (!resultado.isEmpty() || userExists != null) {
        return response.render('auth/register', {
            pageName: 'Sign Up',
            errors,
            usuario: { nombre, email }
        });
    }

    const userCreated = await createUser(nombre, email, password);

    // Envia email de confirmacion
    emailRegister({
        nombre: userCreated.nombre,
        email: userCreated.email,
        token: userCreated.token
    });

    // Mostrar mensaje de confirmacion
    response.render('templates/token', {
        pagina: 'Cuentra creada correctamente',
        mensaje: 'Hemos enviado un Email de Confirmacion, presiona en el enlace'
    });
}



const confirmAccount = async (request, response, next) => {
    let account = await validateAccountByToken(request.params.token);
    console.log(account);
}

const formularioRecoverPassword = (request, response) => {
    response.render('auth/recoverPassword', {
        pageName: 'Recover your Password'
    });
}

export {
    formularioLogin,
    formularioRegister,
    sendRegister,
    confirmAccount,
    formularioRecoverPassword
}