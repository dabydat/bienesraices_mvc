function createErrors(array = null) {
    let errors = {
        nombreError: null,
        emailError: null,
        passwordError: null,
        confirmPasswordError: null,
    };

    if (array != null) {
        array.forEach(element => {
            if (element.param == 'nombre') {
                errors.nombreError = element.msg
            }
            if (element.param == 'email') {
                errors.emailError = element.msg
            }
            if (element.param == 'password') {
                errors.passwordError = element.msg
            }
            if (element.param == 'repetir_password') {
                errors.confirmPasswordError = element.msg
            }
        });
    }

    return errors;
}

export { createErrors };