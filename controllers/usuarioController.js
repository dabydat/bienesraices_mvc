import { findUserExistence, createUser, validateAccountByToken } from "../services/usuarioService.js";
import { emailRegister, emailRecoverPassword } from "../helpers/email.js";
import { createErrors } from "../helpers/errors.js";
import { generarId, generarJWT } from "../helpers/token.js";
import bcrypt from "bcrypt";

import { GLOBAL_ERROR } from "../utils/constantsInfo/errorMessages.js";
import { GLOBAL_SUCCESS } from "../utils/constantsInfo/successMessages.js";

const { EMAIL_NOT_ASSIGNED, ACCOUNT_NOT_CONFIRMED, EMAIL_EXISTING, INVALID_TOKEN_OR_WRONG_EMAIL, TOKEN_ERROR, INCORRECT_PASSWORD } = GLOBAL_ERROR;
const { EMAIL_SENT, ACCOUNT_CONFIRMED, RESET_PASSWORD, SAVED_PASSWORD } = GLOBAL_SUCCESS;


const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pageName: 'Login',
        csrfToken: req.csrfToken()
    });
}

const authenticate = async (req, res) => {
    let components = {
        pageName: 'Login',
        csrfToken: req.csrfToken()
    }
    let errors = await createErrors(req, 'login');
    // Validacion de usuario en la BD
    let userExists = await findUserExistence(req.body.email);
    errors = req.body.email == '' || req.body.password == '' ? errors : (userExists == 'error' && req.body.email != '' ? { ...errors, userError: EMAIL_NOT_ASSIGNED } : (req.body.email != '' && userExists.confirmed != true ? { ...errors, userError: ACCOUNT_NOT_CONFIRMED } : (!userExists.verifyPassword(req.body.password) ? { ...errors, userError: INCORRECT_PASSWORD } : null)));
    components = errors != null ? { ...components, errors } : components;
    if (errors != null) {
        return res.render('auth/login', components);
    }

    if (userExists.verifyPassword(req.body.password)) {
        // return res.render('auth/login', components);
        const token = generarJWT(userExists.id)

        return res.cookie('_token', token, {
            httpOnly:true,
        }).redirect('/mis-propiedades');
    }
}

const formularioRegister = (req, res) => {
    res.render('auth/register', {
        pageName: 'Sign Up',
        csrfToken: req.csrfToken()
    });
}

const sendRegister = async (req, res) => {
    const { nombre, email, password } = req.body;
    // Validacion de usuario en la BD
    let userExists = await findUserExistence(email);
    // Errores de envio de formulario
    let errors = await createErrors(req, 'register');
    if (errors != null || userExists != 'error') {
        errors = userExists != 'error' && email != '' ? { ...errors, userExists: EMAIL_EXISTING } : errors;
        return res.render('auth/register', { pageName: 'Sign Up', csrfToken: req.csrfToken(), usuario: { nombre, email }, errors });
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
    res.render('templates/mensaje', {
        pageName: 'Cuentra creada correctamente',
        mensaje: EMAIL_SENT
    });
}

const confirmAccount = async (req, res) => {
    let account = await validateAccountByToken(req.params.token);

    if (account == 'error') {
        return res.render('auth/confirmar-cuenta', {
            pageName: 'Error al confirmar tu cuenta',
            mensaje: INVALID_TOKEN_OR_WRONG_EMAIL,
            error: true
        });
    }

    // Confirmar cuenta
    account.token = null;
    account.confirmed = true;
    await account.save();
    res.render('auth/confirmar-cuenta', {
        pageName: 'Cuenta confirmada',
        mensaje: ACCOUNT_CONFIRMED
    });
}

const formularioRecoverPassword = (req, res) => {
    res.render('auth/recoverPassword', {
        pageName: 'Recover your Password',
        csrfToken: req.csrfToken(),
    });
}

const resetPassword = async (req, res) => {
    const { email } = req.body;
    let errors = await createErrors(req, 'recoverPassword');

    if (email == '') {
        return res.render('auth/recoverPassword', {
            pageName: 'Recover your password',
            csrfToken: req.csrfToken(),
            errors
        });
    }

    let user = await findUserExistence(email);
    if (user == 'error') {
        errors = user == 'error' ? { ...errors, userDoesNotExists: EMAIL_NOT_ASSIGNED } : errors;
        return res.render('auth/recoverPassword', {
            pageName: 'Recover your password',
            csrfToken: req.csrfToken(),
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
    res.render('templates/mensaje', {
        pageName: 'Recover your password',
        mensaje: RESET_PASSWORD
    });
}

const proveToken = async (req, res) => {
    let account = await validateAccountByToken(req.params.token);
    if (account == 'error') {
        return res.render('auth/confirmar-cuenta', {
            pageName: 'Recover your password',
            mensaje: TOKEN_ERROR,
            error: true
        });
    }

    // Mostrar formulario para modificar la contraseña
    res.render('auth/reset-password', {
        pageName: 'Recover your password',
        csrfToken: req.csrfToken()
    });
}

const newPassword = async (req, res) => {
    // Errores de envio de formulario
    let errors = await createErrors(req, 'newPassword');
    if (req.body.password == '') {
        return res.render('auth/reset-password', {
            pageName: 'Recover your password',
            csrfToken: req.csrfToken(),
            errors
        });
    }

    // Identificar quien hace el cambio 
    let user = await validateAccountByToken(req.params.token);

    // Hashear el nuevo password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.token = null;
    await user.save();
    res.render('auth/confirmar-cuenta', {
        pageName: 'Password recovered',
        mensaje: SAVED_PASSWORD
    });
}

export {
    formularioLogin,
    authenticate,
    formularioRegister,
    sendRegister,
    confirmAccount,
    formularioRecoverPassword,
    resetPassword,
    proveToken,
    newPassword
}