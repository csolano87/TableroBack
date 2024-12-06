const { Request, Response } = require("express");

const Marca = require("../models/marca");

const getmarca = async (req, res) => {
	const marca = await Marca.findAll({
		where: {
			ESTADO: 1,
		},
	});

	res.json({ ok: true, marcas: marca });
};

const createmarca = async (req, res) => {
	const { NOMBRE } = req.body;
	const marca = new Marca({ NOMBRE });
	const mar = await Marca.findOne({
		where: {
			NOMBRE: NOMBRE,
		},
	});

	if (mar) {
		return res.status(400).json({
			msg: "El nombre ya se encuentra registrado ",
		});
	}
	await marca.save();
	res.status(201).json({ msg: "La marca  ha  registrado con exito" });
};

const updatemarca = async (req, res) => {
	res.send("update guardada con exito..");
};

const deletemarca = async (req, res) => {
	res.status(200).json({
		msg: "El usuario a sido desactivado con exito...",
	});
};

module.exports = {
	createmarca,
	updatemarca,
	deletemarca,
	getmarca,
};
