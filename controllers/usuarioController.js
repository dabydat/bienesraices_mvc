import { check, validationResult } from "express-validator";
import { findUserExistence, createUser, validateAccountByToken } from "../services/usuarioService.js";
import { emailRegister, emailRecoverPassword } from "../helpers/email.js";
import { createErrors } from "../helpers/errors.js";
import { generarId } from "../helpers/token.js";
import bcrypt from "bcrypt";


const formularioLogin = (request, response) => {
    response.render('auth/login', {
        pageName: 'Login'
    });
}

const formularioRegister = (request, response) => {
    response.render('auth/register', {
        pageName: 'Sign Up',
        csrfToken: request.csrfToken()
    });
}

const sendRegister = async (request, response) => {
    const { nombre, email, password } = request.body;
    // Validacion de campos de formulario
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(request)
    await check('email').isEmail().withMessage('No cumple con el formato de un correo').run(request)
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe contener al menos 6 carácteres').run(request)
    await check('repetir_password').equals(password).withMessage('Las contraseñas no coinciden').run(request)
    let resultado = validationResult(request);
    // Validacion de usuario en la BD
    let userExists = await findUserExistence(email);
    // Errores de envio de formulario
    let errors = createErrors(resultado.array());
    errors = userExists == 'error' ? { ...errors, userExists: 'Estimado usuario, ya existe un usuario con el correo anteriomente indicado.' } : errors;

    if (!resultado.isEmpty() || userExists == 'error') {
        return response.render('auth/register', {
            pageName: 'Sign Up',
            csrfToken: request.csrfToken(),
            errors,
            usuario: { nombre, email }
        });
    }

    // Creacion de usuario
    const userCreated = await createUser(nombre, email, password);

    // Envia email de confirmacion
    emailRegister({
        nombre: userCreated.nombre,
        email: userCreated.email,
        token: userCreated.token
    });

    // Mostrar mensaje de confirmacion
    response.render('templates/mensaje', {
        pageName: 'Cuentra creada correctamente',
        mensaje: 'Hemos enviado un Email de Confirmacion, presiona en el enlace'
    });
}

const confirmAccount = async (request, response, next) => {
    let account = await validateAccountByToken(request.params.token);

    if (account == 'error') {
        return response.render('auth/confirmar-cuenta', {
            pageName: 'Error al confirmar tu cuenta',
            mensaje: 'Estimado usuario, es posible que este token sea invalido o la cuenta no exista. Intente de nuevo...',
            error: true
        });
    }

    // Confirmar cuenta
    account.token = null;
    account.confirmed = true;
    await account.save();
    response.render('auth/confirmar-cuenta', {
        pageName: 'Cuenta confirmada',
        mensaje: 'La cuenta ha sido confirmada correctamente.'
    });
}

const formularioRecoverPassword = (request, response) => {
    response.render('auth/recoverPassword', {
        pageName: 'Recover your Password',
        csrfToken: request.csrfToken(),
    });
}

const resetPassword = async (request, response) => {
    const { email } = request.body;
    await check('email').isEmail().withMessage('No cumple con el formato de un correo').run(request)
    let resultado = validationResult(request);
    let errors = createErrors(resultado.array());

    if (!resultado.isEmpty()) {
        return response.render('auth/recoverPassword', {
            pageName: 'Recover your password',
            csrfToken: request.csrfToken(),
            errors
        });
    }

    let user = await findUserExistence(email);
    if (user == 'error') {
        errors = user == 'error' ? { ...errors, userDoesNotExists: 'Este email no se encuentra asignado a ningun usuario.' } : errors;
        return response.render('auth/recoverPassword', {
            pageName: 'Recover your password',
            csrfToken: request.csrfToken(),
            errors
        });
    }

    // Generar token
    user.token = generarId();
    await user.save();

    // Enviar Email
    emailRecoverPassword({
        email: user.email, nombre: user.nombre, token: user.token
    });

    // Mostrar mensaje de confirmacion
    response.render('templates/mensaje', {
        pageName: 'Recover your password',
        mensaje: 'Hemos enviado un Email con las instrucciones.'
    });
}

const proveToken = async (request, response) => {
    let account = await validateAccountByToken(request.params.token);
    if (account == 'error') {
        return response.render('auth/confirmar-cuenta', {
            pageName: 'Recover your password',
            mensaje: 'Hubo un error al validar tu informacion. Intente de nuevo...',
            error: true
        });
    }

    // Mostrar formulario para modificar la contraseña
    response.render('auth/reset-password', {
        pageName: 'Recover your password',
        csrfToken: request.csrfToken()
    });
}

const newPassword = async (request, response) => {
    // Validar el password
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe contener al menos 6 carácteres').run(request)
    let resultado = validationResult(request);
    // Errores de envio de formulario
    let errors = createErrors(resultado.array());
    console.log(errors);
    if (!resultado.isEmpty()) {
        return response.render('auth/reset-password', {
            pageName: 'Recover your password',
            csrfToken: request.csrfToken(),
            errors
        });
    }

    // Identificar quien hace el cambio 
    let user = await validateAccountByToken(request.params.token);

    // Hashear el nuevo password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(request.body.password, salt);
    user.token = null;
    await user.save();
    response.render('auth/confirmar-cuenta', {
        pageName: 'Password recovered',
        mensaje: 'La contraseña se ha guardado correctamente.'
    });
}

export {
    formularioLogin,
    formularioRegister,
    sendRegister,
    confirmAccount,
    formularioRecoverPassword,
    resetPassword,
    proveToken,
    newPassword
}