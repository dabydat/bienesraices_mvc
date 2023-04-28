import express from "express";
import { admin, createPropiedad, savePropiedad } from "../controllers/propiedadesController.js";
import { PROPIEDADES } from "../utils/constantsInfo/routes.js"

const ROUTER = express.Router();

ROUTER.get(PROPIEDADES.HOME, admin);
ROUTER.get(PROPIEDADES.CREATE, createPropiedad);
ROUTER.post(PROPIEDADES.CREATE, savePropiedad);

export default ROUTER;