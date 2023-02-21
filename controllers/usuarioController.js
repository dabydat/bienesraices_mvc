import { findUserExistence, createUser, validateAccountByToken } from "../services/usuarioService.js";
import { emailRegister, emailRecoverPassword } from "../helpers/email.js";
import { createErrors } from "../helpers/errors.js";
import { generarId } from "../helpers/token.js";
import bcrypt from "bcrypt";


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
    errors = req.body.email == '' || req.body.password == '' ? errors : (userExists == 'error' && req.body.email != '' ? { ...errors, userError: 'Este email no se encuentra asignado a ningun usuario.' } : (req.body.email != '' && userExists.confirmed != true ? { ...errors, userError: 'Tu cuenta no ha sido confirmada aún.' } : null));
    components = errors != null ? { ...components, errors } : components;
    if (errors != null) {
        return res.render('auth/login', components);
    }

    console.log('auth');
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
        errors = userExists != 'error' && email != '' ? { ...errors, userExists: 'Estimado usuario, ya existe un usuario con el correo anteriomente indicado.'} : errors;
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
        mensaje: 'Hemos enviado un Email de Confirmacion, presiona en el enlace'
    });
}

const confirmAccount = async (req, res) => {
    let account = await validateAccountByToken(req.params.token);

    if (account == 'error') {
        return res.render('auth/confirmar-cuenta', {
            pageName: 'Error al confirmar tu cuenta',
            mensaje: 'Estimado usuario, es posible que este token sea invalido o la cuenta no exista. Intente de nuevo...',
            error: true
        });
    }

    // Confirmar cuenta
    account.token = null;
    account.confirmed = true;
    await account.save();
    res.render('auth/confirmar-cuenta', {
        pageName: 'Cuenta confirmada',
        mensaje: 'La cuenta ha sido confirmada correctamente.'
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
        errors = user == 'error' ? { ...errors, userDoesNotExists: 'Este email no se encuentra asignado a ningun usuario.' } : errors;
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
        mensaje: 'Hemos enviado un Email con las instrucciones.'
    });
}

const proveToken = async (req, res) => {
    let account = await validateAccountByToken(req.params.token);
    if (account == 'error') {
        return res.render('auth/confirmar-cuenta', {
            pageName: 'Recover your password',
            mensaje: 'Hubo un error al validar tu informacion. Intente de nuevo...',
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
        mensaje: 'La contraseña se ha guardado correctamente.'
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