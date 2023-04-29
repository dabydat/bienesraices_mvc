const REGISTER = ['nombre', 'email', 'password', 'confirmPassword']
const LOGIN = ['email', 'password']
const RECOVER_PASSWORD = ['email']
const NEW_PASSWORD = ['password']
const CREATE_PROPIEDAD = ['titulo', 'descripcion', 'categoria', 'precio', 'habitaciones', 'estacionamiento', 'banios']

export const verifyFieldInForm = (form, field) => {
    switch (form) {
        case 'register':
            if (REGISTER.indexOf(field) !== -1) return true;
            break;
        case 'login':
            if (LOGIN.indexOf(field) !== -1) return true;
            break;
        case 'recoverPassword':
            if (RECOVER_PASSWORD.indexOf(field) !== -1) return true;
            break;
        case 'newPassword':
            if (NEW_PASSWORD.indexOf(field) !== -1) return true;
            break;
        case 'createPropiedad':
            if (CREATE_PROPIEDAD.indexOf(field) !== -1) return true;
            break;
    }
}