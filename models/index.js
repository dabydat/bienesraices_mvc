import Propiedad from "./Propiedad.js";
import Precio from "./Precio.js";
import Categoria from "./Categoria.js";
import Usuario from "./Usuario.js";

// Propiedad has one precio
// Precio.hasOne(Propiedad);
Propiedad.belongsTo(Precio, { foreignKey: 'precioId' });
Propiedad.belongsTo(Categoria, { foreignKey: 'categoriaId' })
Usuario.belongsTo(Propiedad, { foreignKey: 'usuarioId' });

export {
    Propiedad,
    Precio,
    Categoria,
    Usuario
}