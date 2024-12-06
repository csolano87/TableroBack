const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = require("../db/connection");

class Marca extends Model {}
Marca.init(
	{
		NOMBRE: { type: DataTypes.STRING },
		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
	},
	{
		sequelize,
		modelName: "marca",
	}
);

module.exports = Marca;
