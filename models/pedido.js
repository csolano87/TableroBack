const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Pedido extends Model {}

Pedido.init(
	{
		 
		ID_PROVEEDOR: {
			type: DataTypes.INTEGER,
		},
		MARCA: {
			type: DataTypes.INTEGER,
		},

		/* CANTIDAD: { type: DataTypes.INTEGER }, */
		FECHAPEDIDO: {
			type: Sequelize.DATEONLY,
			allowNull: false,
			defaultValue: Sequelize.NOW,
		},

		ESTADO: { type: DataTypes.INTEGER, defaultValue: 1 },
	},
	{
		sequelize,
		modelName: "pedido",
	}
);
module.exports = Pedido;
