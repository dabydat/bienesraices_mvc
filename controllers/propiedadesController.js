const admin = (req, res) => {
    res.render('propiedades/admin', {
        pageName: 'Mis Propiedades',
        adminHeader: true,
    })
}

const createPropiedad = (req, res) => {
    res.render('propiedades/create', {
        pageName: 'Crear Propiedad',
        adminHeader: true,
    })
}

export {
    admin,
    createPropiedad
}