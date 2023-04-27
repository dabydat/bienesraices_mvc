import Precio from "../models/Precio.js";

async function allPrices(){
    return await Precio.findAll();
}

export {
    allPrices
}