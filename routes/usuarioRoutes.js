import express from "express";
import { formularioLogin, authenticate, formularioRegister, sendRegister, formularioRecoverPassword, confirmAccount, resetPassword, proveToken, newPassword } from "../controllers/usuarioController.js";
import { AUTH } from "../utils/constantsInfo/routes.js"

const ROUTER = express.Router();

ROUTER.get(AUTH.LOGIN, formularioLogin);
ROUTER.post(AUTH.LOGIN, authenticate);

ROUTER.get(AUTH.REGISTER, formularioRegister);
ROUTER.post(AUTH.REGISTER, sendRegister);

ROUTER.get(AUTH.CONFIRM_ACCOUNT_WITH_TOKEN, confirmAccount);

ROUTER.get(AUTH.RECOVER_PASSWORD, formularioRecoverPassword);
ROUTER.post(AUTH.RECOVER_PASSWORD, resetPassword);

// Almacena el nuevo password
ROUTER.get(AUTH.RECOVER_PASSWORD_WITH_TOKEN, proveToken);
ROUTER.post(AUTH.RECOVER_PASSWORD_WITH_TOKEN, newPassword);


export default ROUTER;