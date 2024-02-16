import { check, validationResult } from "express-validator";
import { FORM_ERROR } from "../utils/constantsInfo/errorMessages.js"
import { verifyFieldInForm } from "../utils/inputsFormsRequired.js"

const { email, password } = FORM_ERROR.LOGIN
const { nombre, email: register_email, password: password_register, repetir_password } = FORM_ERROR.DEFAULT
const { titulo, descripcion, categoria, precio, habitaciones, estacionamiento, banios } = FORM_ERROR.CREATE_PROPIEDAD

async function createErrors(req, form) {
    let errors = {
        nombreError: null,
        emailError: null,
        passwordError: null,
        confirmPasswordError: null,
        tituloPropiedadError: null,
        descripcionPropiedadError: null,
        categoriaPropiedadError: null,
        precioPropiedadError: null,
        habitacionesPropiedadError: null,
        estacionamientoPropiedadError: null,
        baniosPropiedadError: null
    };
    //REGISTER-LOGIN
    if (verifyFieldInForm(form, 'email')) await check('email').isEmail().withMessage(form == 'login' ? email : register_email).run(req)
    if (verifyFieldInForm(form, 'password')) await check('password').notEmpty().withMessage(form == 'login' ? password : password_register).run(req)
    if (verifyFieldInForm(form, 'nombre')) await check('nombre').notEmpty().withMessage(nombre).run(req)
    if (verifyFieldInForm(form, 'repetir_password')) await check('repetir_password').equals(req.body.password).withMessage(repetir_password).run(req)
    //CREATE PROPIEDAD
    if (verifyFieldInForm(form, 'titulo')) await check('titulo').notEmpty().withMessage(titulo).run(req)
    if (verifyFieldInForm(form, 'descripcion')) await check('descripcion').notEmpty().withMessage(descripcion).isLength({ min: 15 }).withMessage(descripcion).run(req)
    if (verifyFieldInForm(form, 'categoria')) await check('categoria').isNumeric().withMessage(categoria).run(req)
    if (verifyFieldInForm(form, 'precio')) await check('precio').isNumeric().withMessage(precio).run(req)
    if (verifyFieldInForm(form, 'habitaciones')) await check('habitaciones').isNumeric().withMessage(habitaciones).run(req)
    if (verifyFieldInForm(form, 'estacionamiento')) await check('estacionamiento').isNumeric().withMessage(estacionamiento).run(req)
    if (verifyFieldInForm(form, 'banios')) await check('banios').isNumeric().withMessage(banios).run(req)

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
        if (element.param == 'titulo') {
            errors.tituloPropiedadError = element.msg
        }
        if (element.param == 'descripcion') {
            errors.descripcionPropiedadError = element.msg
        }
        if (element.param == 'categoria') {
            errors.categoriaPropiedadError = element.msg
        }
        if (element.param == 'precio') {
            errors.precioPropiedadError = element.msg
        }
        if (element.param == 'habitaciones') {
            errors.habitacionesPropiedadError = element.msg
        }
        if (element.param == 'estacionamiento') {
            errors.estacionamientoPropiedadError = element.msg
        }
        if (element.param == 'banios') {
            errors.baniosPropiedadError = element.msg
        }
    });
    
    return resultado.array().length <= 0 ? null : errors;
}

export {
    createErrors
};