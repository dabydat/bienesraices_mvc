import { check, validationResult } from "express-validator";

async function createErrors(req, form) {
    let errors = {
        nombreError: null,
        emailError: null,
        passwordError: null,
        confirmPasswordError: null
    };

    if (verifiedField(form, 'email')) await check('email').isEmail().withMessage(form == 'login' ? 'El email es obligatorio' : 'No cumple con el formato de un correo').run(req)
    if (verifiedField(form, 'password')) await check('password').notEmpty().withMessage(form == 'login' ? 'La contraseña es obligatorio' : 'La contraseña debe contener al menos 6 carácteres').run(req)
    if (verifiedField(form, 'nombre')) await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(req)
    if (verifiedField(form, 'repetir_password')) await check('repetir_password').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req)

    let resultado = validationResult(req);

    resultado.array().forEach(element => {
        if (element.param == 'nombre') {
            errors.nombreError = element.msg
        }
        if (element.param == 'email') {
            errors.emailError = element.msg
        }
        if (element.param == 'password') {
            errors.passwordError = element.msg
        }
        if (element.param == 'repetir_password') {
            errors.confirmPasswordError = element.msg
        }
    });

    return resultado.array() == [] ? null : errors;
}

const verifiedField = (form, field) => {
    const register = {
        nombre: true, email: true, password: true, confirmPassword: true
    }
    const recoverPassword = {
        email: true
    }
    const login = {
        email: true, password: true
    }
    const newPassword = {
        password: true
    }

    if (form == 'login' && field in login) return true
    if (form == 'recoverPassword' && field in recoverPassword) return true
    if (form == 'register' && field in register) return true
    if (form == 'newPassword' && field in newPassword) return true
}


export { createErrors };