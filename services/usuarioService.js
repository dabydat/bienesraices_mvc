import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/token.js";

function createUsuarioErrors(object) {
    let errors = {
        nombreError: null,
        emailError: null,
        passwordError: null,
        confirmPasswordError: null
    };

    object.array().forEach(element => {
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

    return errors;
}

async function findUserExistence(email) {
    let userExists = await Usuario.findOne({ where: { email } });
    let errors = null;

    if (userExists) {
        errors = { userExists: 'Estimado usuario, ya existe un usuario con el correo anteriomente indicado.' }
    }

    return errors;
}

async function validateAccountByToken(token) {
    let account = await Usuario.findOne({ where: { token } });
    let errors = null;

    if (!account) {
        errors = { accountDoesNotExist: 'Estimado usuario, esta cuenta no existe. Por favor, registrese.' }
    }

    return errors != null ? errors : account;
}

async function createUser(nombre, email, password) {
    return await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })
}

export {
    createUsuarioErrors,
    findUserExistence,
    createUser,
    validateAccountByToken
}