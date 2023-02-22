import {
    check,
    validationResult
} from "express-validator";

async function createErrors(req, form) {
    let errors = {
        nombreError: null,
        emailError: null,
        passwordError: null,
        confirmPasswordError: null
    };

    if (verifyFieldInForm(form, 'email')) await check('email').isEmail().withMessage(form == 'login' ? 'El email es obligatorio' : 'No cumple con el formato de un correo').run(req)
    if (verifyFieldInForm(form, 'password')) await check('password').notEmpty().withMessage(form == 'login' ? 'La contraseña es obligatorio' : 'La contraseña debe contener al menos 6 carácteres').run(req)
    if (verifyFieldInForm(form, 'nombre')) await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(req)
    if (verifyFieldInForm(form, 'repetir_password')) await check('repetir_password').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req)

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

const verifyFieldInForm = (form, field) => {
    if (field in getForm(form)) return true
}

const getForm = (form) => {
    switch (form) {
        case 'register':
            return {nombre: true,email: true,password: true,confirmPassword: true};
        case 'login':
            return {email: true, password: true};
        case 'recoverPassword':
            return {email: true};
        case 'newPassword':
            return {password: true};
    }
}

export {
    createErrors
};