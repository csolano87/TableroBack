const Cabecera = require("../models/cabecera");
const Cabecera_Agen = require("../models/cabecera_agen");
const Cliente = require("../models/cliente");
const Detalle = require("../models/detalle");
const Detalle_Agen = require("../models/detalle_agen");
const Itempedido = require("../models/itemPedido");
const Marca = require("../models/marca");
const Pedido = require("../models/pedido");
const Proceso = require("../models/proceso");
const Producto = require("../models/productos");
const Servicio = require("../models/servicio");
const Envase = require("../models/tipoTubo");
const Tubo = require("../models/tubo");
const Usuario = require("../models/usuarios");


/* Usuario.hasMany(Proceso,{as:"user" ,foreignKey:"usuarioId"});
Proceso.belongsTo(Usuario,{as:"tramites"}) */

Usuario.hasMany(Pedido,{as:"pedidos",foreignKey:"usuarioId"});
Pedido.belongsTo(Usuario,{as:"user"})

Cliente.hasMany(Pedido,{as:"pedidos", foreignKey:"clienteId"})
Pedido.belongsTo(Cliente,{as:"clientes"})

Marca.hasMany(Pedido,{as:"pedidos", foreignKey:"marcaId"})
Pedido.belongsTo(Marca,{as:"marcas"})


Pedido.hasMany(Itempedido,{as:"items",foreignKey:"pedidoId",})
Itempedido.belongsTo(Pedido,{as:"pedidos"})


Producto.hasMany(Itempedido,{as:"items",foreignKey:"productoId"})
Itempedido.belongsTo(Producto,{as:"product", })


Cabecera.hasMany(Detalle, { as: "pruebas", foreignKey: "cabeceraId" });
Detalle.belongsTo(Cabecera, { as: "pacientes" });
Cabecera_Agen.hasMany(Detalle_Agen, { as: "as400", foreignKey: "cabeceraId" });
Detalle_Agen.belongsTo(Cabecera_Agen, { as: "personas" });
Cabecera.hasMany(Tubo, { as: "tubos", foreignKey: "pacientesId" });
Tubo.belongsTo(Cabecera, { as: "pacientes" });
Tubo.hasMany(Envase, { as: "envase", foreignKey: "tuboId" });
Envase.belongsTo(Tubo, { as: "tubos" });
