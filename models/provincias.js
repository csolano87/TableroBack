const { Sequelize, DataTypes, Model } = require("sequelize");
const db = require("../db/connection");
//const Cabecera = require('./cabecera');

const Provincia = db.define(
  "Provincia",
  {
    descripcion: {
      type: DataTypes.STRING,
      //required:[true,'El rol es obligatorio']
    },
  },
  {
    freezeTableName: true,
    tableName: "provincia",
    timestamps: false,
  },
);
module.exports = Provincia;
