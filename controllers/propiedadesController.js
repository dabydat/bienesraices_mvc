
import Propiedad from "../models/Propiedad.js";
import { createErrors } from "../helpers/errors.js";
import { allPrices } from "../services/precioService.js";
import { allCategories } from "../services/categoriaService.js";
import { PROPIEDADES } from "../utils/constantsInfo/routes.js";

const [categorias, precios] = await Promise.all([allCategories(), allPrices()]);
let components = { pageName: 'Crear Propiedad', adminHeader: true, csrfToken: req.csrfToken(), categorias, precios }

const admin = (req, res) => {
    res.render(PROPIEDADES.ADMIN, {
        pageName: 'Mis Propiedades',
        adminHeader: true,
    })
}

const createPropiedad = async (req, res) => {
    res.render(PROPIEDADES.CREATE, components)
}

const savePropiedad = async (req, res) => {
    const errors = await createErrors(req, 'createPropiedad');
    if (errors != null) {
        components = { ...components, errors, propiedad: { ...req.body } };
        return res.render(PROPIEDADES.CREATE, components);
    }
    const { titulo, descripcion, categoria: categoriaId, precio: precioId, habitaciones, estacionamiento, banios, lat, lng, calle } = req.body;
    const { id: usuarioId } = req.usuario;

    try {
        const createPropiedad = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            banios,
            calle,
            lat,
            lng,
            precioId,
            categoriaId,
            usuarioId,
            imagen: ''
        });
        const { id } = createPropiedad;
        res.redirect(`/propiedades/agregar-imagen/${id}`)
    } catch (error) {
        console.log('error', error);
    }



}

export {
    admin,
    createPropiedad,
    savePropiedad
}