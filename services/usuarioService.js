import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/token.js";

async function findUserExistence(email) {
    let userExists = await Usuario.findOne({ where: { email } });
    let errors = '';
    return errors = userExists != null ? userExists : 'error';
}

async function validateAccountByToken(token) {
    let account = await Usuario.findOne({ where: { token } });
    let errors = '';
    return errors = account != null ? account : 'error';
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
    findUserExistence,
    createUser,
    validateAccountByToken
}