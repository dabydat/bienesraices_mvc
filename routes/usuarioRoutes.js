import express from "express";
import { formularioLogin, formularioRegister, sendRegister, formularioRecoverPassword, confirmAccount } from "../controllers/usuarioController.js";

const ROUTER = express.Router();

ROUTER.get('/login', formularioLogin);
ROUTER.get('/register', formularioRegister);
ROUTER.post('/register', sendRegister);
ROUTER.get('/confirmAccount/:token', confirmAccount);
ROUTER.get('/recoverPassword', formularioRecoverPassword);


export default ROUTER;