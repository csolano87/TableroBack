const { Sequelize, DataTypes, Model } = require("sequelize");
const db = require("../db/connection");
//const Cabecera = require('./cabecera');

const Envase = db.define(
  "Envase",
  {
    descripcion: {
      type: DataTypes.STRING,
      //required:[true,'El rol es obligatorio']
    },
    codigo: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    tableName: "envase",
    timestamps: false,
  },
);
module.exports = Envase;
