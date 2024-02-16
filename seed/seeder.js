import { exit } from "node:process";
import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
import { Categoria, Precio, Usuario } from "../models/index.js";
import db from "../config/db.js";

const importarDatos = async () => {
    try {
        // Authentication
        await db.authenticate();

        // Creating columns
        await db.sync();

        // Insert data
        // use Promise.all when they can run at the same time 
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ]);
        console.log("Data has been saved succesfully");

        // It means succesfull proccess
        exit();

    } catch (error) {
        console.log(error);
        // A good way to finish the process immediately, it means error
        exit(1);
    }
}

const eliminarDatos = async () => {
    try {
        // await Promise.all([
        //     Categoria.destroy({ where: {}, truncate: true }),
        //     Precio.destroy({ where: {}, truncate: true })
        // ]);
        
        await db.sync({ force: true });
        console.log("Data has been deleted succesfully");
        exit();
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

if (process.argv[2] === "-import") {
    importarDatos();
}

if (process.argv[2] === "-delete") {
    eliminarDatos();
}