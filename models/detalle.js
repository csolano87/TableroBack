const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db/connection");

class Detalle extends Model {}
Detalle.init(
  {
    ItemID: DataTypes.INTEGER,
    ItemName: DataTypes.STRING,
    ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    sequelize,
    modelName: "detalle",
  },
);

module.exports = Detalle;
