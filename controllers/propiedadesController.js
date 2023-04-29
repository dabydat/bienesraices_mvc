
import { createErrors } from "../helpers/errors.js";
import { allCategories } from "../services/categoriaService.js";
import { allPrices } from "../services/precioService.js";

const [categorias, precios] = await Promise.all([
    allCategories(), allPrices()
]);

const admin = (req, res) => {
    res.render('propiedades/admin', {
        pageName: 'Mis Propiedades',
        adminHeader: true,
    })
}

const createPropiedad = async (req, res) => {
    res.render('propiedades/create', {
        pageName: 'Crear Propiedad',
        adminHeader: true,
        csrfToken: req.csrfToken(),
        categorias,
        precios
    })
}

const savePropiedad = async (req, res) => {
    let components = {
        pageName: 'Crear Propiedad',
        adminHeader: true,
        csrfToken: req.csrfToken(),
        categorias,
        precios
    }
    const errors = await createErrors(req, 'createPropiedad');
    if (errors != null) {
        components = errors != null ? { ...components, errors } : components;
        return res.render('propiedades/create', components);
    }
    console.log(errors);
}

export {
    admin,
    createPropiedad,
    savePropiedad
}