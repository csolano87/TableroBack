const { Request, Response } = require("express");

const Equipos = require("../models/equipos");

const getEquipos = async (req, res) => {
	const equipos = await Equipos.findAll({
		where: {
			ESTADO: 1,
		},
	});

	res.json({ ok: true, equipos: equipos });
};

const createEquipos = async (req, res) => {
	const { NOMBRE, CATEGORIA } = req.body;
	const equipos = new Equipos({ NOMBRE, CATEGORIA });
	const equipo = await Equipos.findOne({
		where: {
			NOMBRE: NOMBRE,
		},
	});

	if (equipo) {
		return res.status(400).json({
			msg: "El nombre ya se encuentra registrado ",
		});
	}
	await equipos.save();
	res.status(201).json({ msg: "El equipo  ha  registrado con exito" });
};

const updateEquipos = async (req, res) => {
	res.send("update guardada con exito..");
};

const deleteEquipos = async (req, res) => {
	res.status(200).json({
		msg: "El usuario a sido desactivado con exito...",
	});
};

module.exports = {
	createEquipos,
	updateEquipos,
	deleteEquipos,
	getEquipos,
};
