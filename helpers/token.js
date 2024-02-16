import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config({ path: '.env' })

const generarJWT = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })


const generarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32)

export { generarId, generarJWT }