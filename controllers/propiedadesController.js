const admin = (req, res) => {
    res.render('propiedades/admin', {
        pageName: 'Mis Propiedades',
        adminHeader: true,
    })
}

export {
    admin,
}