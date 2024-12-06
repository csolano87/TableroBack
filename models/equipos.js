const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Equipos extends Model {}

Equipos.init(
  {
    
    NOMBRE: {
      type: DataTypes.STRING,
    },
    CATEGORIA: {
      type: DataTypes.STRING,
    },
    ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    sequelize,
    modelName: "equipos",
  },
);
module.exports = Equipos;
