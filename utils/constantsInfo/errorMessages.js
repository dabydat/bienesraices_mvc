export const FORM_ERROR = {
    LOGIN: {
        email: 'El email es obligatorio',
        password: 'La contraseña es obligatorio'
    },
    DEFAULT: {
        nombre: 'El nombre no puede ir vacío',
        email: 'No cumple con el formato de un correo',
        password: 'La contraseña debe contener al menos 6 carácteres',
        repetir_password: 'Las contraseñas no coinciden'
    }
}

export const GLOBAL_ERROR = {
    EMAIL_NOT_ASSIGNED: 'Este email no se encuentra asignado a ningun usuario',
    ACCOUNT_NOT_CONFIRMED: 'Tu cuenta no ha sido confirmada aún',
    EMAIL_EXISTING: 'Estimado usuario, ya existe un usuario con el correo anteriomente indicado',
    INVALID_TOKEN_OR_WRONG_EMAIL: 'Estimado usuario, es posible que este token sea invalido o la cuenta no exista. Intente de nuevo...',
    TOKEN_ERROR:'Hubo un error al validar tu informacion. Intente de nuevo...'
}