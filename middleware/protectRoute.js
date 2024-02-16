import { AUTH } from "../utils/constantsInfo/routes.js";
import { Usuario } from "../models/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: '.env' })

const protectRoute = async (req, res, next) => {
    // Verify if token exists
    const { _token } = req.cookies
    if (!_token) return res.redirect('/auth' + AUTH.LOGIN)

    // Prove the token
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)
        if (usuario) { req.usuario = usuario; }
        else { return res.redirect('/auth' + AUTH.LOGIN) }
        return next();
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth' + AUTH.LOGIN)
    }
}

export default protectRoute