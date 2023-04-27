import { allCategories } from "../services/categoriaService.js";
import { allPrices } from "../services/precioService.js";

const admin = (req, res) => {
    res.render('propiedades/admin', {
        pageName: 'Mis Propiedades',
        adminHeader: true,
    })
}

const createPropiedad = async (req, res) => {

    const [categorias, precios] = await Promise.all([
        allCategories(), allPrices()
    ]);
    console.log(categorias, precios);
    res.render('propiedades/create', {
        pageName: 'Crear Propiedad',
        adminHeader: true,
        categorias, 
        precios
    })
}

export {
    admin,
    createPropiedad
}