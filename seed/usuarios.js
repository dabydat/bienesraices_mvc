import bcrypt from "bcrypt";

const usuarios = [
    {
        nombre:'David',
        email: 'david@gomez.com',
        confirmed : 1,
        password: bcrypt.hashSync('password', 10)
    }
]

export default usuarios;