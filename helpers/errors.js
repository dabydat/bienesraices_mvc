import { check, validationResult } from "express-validator";
import { FORM_ERROR } from "../utils/constantsInfo/errorMessages.js"
import { REGISTER, LOGIN, RECOVER_PASSWORD, NEW_PASSWORD } from "../utils/inputsFormsRequired.js"

const { email, password } = FORM_ERROR.LOGIN
const { nombre, email: register_email, password: password_register, repetir_password } = FORM_ERROR.DEFAULT

async function createErrors(req, form) {
    let errors = {
        nombreError: null,
        emailError: null,
        passwordError: null,
        confirmPasswordError: null
    };

    if (verifyFieldInForm(form, 'email')) await check('email').isEmail().withMessage(form == 'login' ? email : register_email).run(req)
    if (verifyFieldInForm(form, 'password')) await check('password').notEmpty().withMessage(form == 'login' ? password : password_register).run(req)
    if (verifyFieldInForm(form, 'nombre')) await check('nombre').notEmpty().withMessage(nombre).run(req)
    if (verifyFieldInForm(form, 'repetir_password')) await check('repetir_password').equals(req.body.password).withMessage(repetir_password).run(req)

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
    switch (form) {
        case 'register':
            if (field in REGISTER) return true;
            break;
        case 'login':
            if (field in LOGIN) return true;
            break;
        case 'recoverPassword':
            if (field in RECOVER_PASSWORD) return true;
            break;
        case 'newPassword':
            if (field in NEW_PASSWORD) return true;
            break;
    }
}

export {
    createErrors
};