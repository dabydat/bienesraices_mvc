import Categoria from "../models/Categoria.js";

async function allCategories(){
    return await Categoria.findAll();
}

export {
    allCategories
}