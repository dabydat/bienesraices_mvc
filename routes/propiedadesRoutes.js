import express from "express";
import { admin } from "../controllers/propiedadesController.js";
import { PROPIEDADES } from "../utils/constantsInfo/routes.js"

const ROUTER = express.Router();


ROUTER.get(PROPIEDADES.HOME, admin);

export default ROUTER;