import nodemailer from "nodemailer";

const emailRegister = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const { email, nombre, token } = data;
    // Enviar el email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices.com',
        text: 'Confirma tu cuenta en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, comprueba tu cuenta en BienesRaices.com</p>
            <p>Tu cuenta esta lista, solo debes confirmarla en el siguiente enlace:
                <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmAccount/${token}">Confirmar Cuenta</a>
            </p>
            <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
        `
    })
}

const emailRecoverPassword = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const { email, nombre, token } = data;
    // Enviar el email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Reestablece tu contraseña en BienesRaices.com',
        text: 'Reestablece tu contraseña en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, has solicitado reestablecer tu contraseña en BienesRaices.com</p>
            <p>Sigue el siguiente enlace para generar una nueva contraseña:
                <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/recoverPassword/${token}">Reestablecer contraseña</a>
            </p>
            <p>Si no solicitaste el cambio de contraseña, puedes ignorar este mensaje.</p>
        `
    })
}

export {
    emailRegister,
    emailRecoverPassword
}