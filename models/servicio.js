const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/connection");

class Servicio extends Model {}
Servicio.init(
  {
    DLCPRO: DataTypes.STRING,
    NOMBRE: DataTypes.STRING,
    //ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    sequelize,
    modelName: "servicio",
  },
);

module.exports = Servicio;
