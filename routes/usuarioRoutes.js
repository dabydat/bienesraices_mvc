import express from "express";
import { formularioLogin, authenticate, formularioRegister, sendRegister, formularioRecoverPassword, confirmAccount, resetPassword, proveToken, newPassword } from "../controllers/usuarioController.js";

const ROUTER = express.Router();

ROUTER.get('/login', formularioLogin);
ROUTER.post('/login', authenticate);

ROUTER.get('/register', formularioRegister);
ROUTER.post('/register', sendRegister);

ROUTER.get('/confirmAccount/:token', confirmAccount);

ROUTER.get('/recoverPassword', formularioRecoverPassword);
ROUTER.post('/recoverPassword', resetPassword);

// Almacena el nuevo password
ROUTER.get('/recoverPassword/:token', proveToken);
ROUTER.post('/recoverPassword/:token', newPassword);


export default ROUTER;