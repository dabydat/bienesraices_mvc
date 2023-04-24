import express from "express";
import { formularioLogin, sendLogin, formularioRegister, sendRegister, formularioRecoverPassword, confirmAccount, sendResetPassword, generateToken, sendNewPassword } from "../controllers/usuarioController.js";
import { AUTH } from "../utils/constantsInfo/routes.js"

const ROUTER = express.Router();

ROUTER.get(AUTH.LOGIN, formularioLogin);
ROUTER.post(AUTH.LOGIN, sendLogin);

ROUTER.get(AUTH.REGISTER, formularioRegister);
ROUTER.post(AUTH.REGISTER, sendRegister);

ROUTER.get(AUTH.CONFIRM_ACCOUNT_WITH_TOKEN, confirmAccount);

ROUTER.get(AUTH.RECOVER_PASSWORD, formularioRecoverPassword);
ROUTER.post(AUTH.RECOVER_PASSWORD, sendResetPassword);

// Almacena el nuevo password
ROUTER.get(AUTH.RECOVER_PASSWORD_WITH_TOKEN, generateToken);
ROUTER.post(AUTH.RECOVER_PASSWORD_WITH_TOKEN, sendNewPassword);


export default ROUTER;