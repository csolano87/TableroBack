const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Panel_pruebas extends Model {}

Panel_pruebas.init(
  {
    CODIGO: {
      type: DataTypes.STRING,
    },
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
    modelName: "panel_prueba",
  },
);
module.exports = Panel_pruebas;
