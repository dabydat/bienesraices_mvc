import express from "express";
import { admin, createPropiedad, savePropiedad } from "../controllers/propiedadesController.js";
import { PROPIEDADES } from "../utils/constantsInfo/routes.js"
import protectRoute from "../middleware/protectRoute.js";


const ROUTER = express.Router();

ROUTER.get(PROPIEDADES.HOME, protectRoute, admin);
ROUTER.get(PROPIEDADES.CREATE, createPropiedad);
ROUTER.post(PROPIEDADES.CREATE, protectRoute, savePropiedad);

export default ROUTER;