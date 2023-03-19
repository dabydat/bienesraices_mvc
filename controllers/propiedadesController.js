const admin = (req, res) => {
    res.render('propiedades/admin', {
        pageName: 'Mis Propiedades'
    })
}

export {
    admin,
}