const { Sequelize, DataTypes, Model } = require("sequelize");
const db = require("../db/connection");
//const Cabecera = require('./cabecera');

const Role = db.define(
  "Role",
  {
    rol: {
      type: DataTypes.STRING,
      required: [true, "El rol es obligatorio"],
    },
  },
  {
    freezeTableName: true,
    tableName: "roles",
    timestamps: false,
  },
);
module.exports = Role;
