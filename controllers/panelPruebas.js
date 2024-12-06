const { Request, Response } = require("express");
const Impresora = require("../models/impresora");
const Panel_pruebas = require("../models/panelPruebas");

const getpanelPruebas = async (req, res) => {
	const pruebas = await Panel_pruebas.findAll({
		where: {
			ESTADO: 1,
		},
	});

	res.json({ ok: true, pruebas });
};

const createpanelPruebas = async (req, res) => {
	const { CODIGO, NOMBRE, CATEGORIA } = req.body;
	const panelPruebas = new Panel_pruebas({ CODIGO, NOMBRE, CATEGORIA });
	const panel = await Panel_pruebas.findOne({
		where: {
			CODIGO: CODIGO,
		},
	});

	if (panel) {
		return res.status(400).json({
			msg: "Este codigo de pruebas   ya existe",
		});
	}
	await panelPruebas.save();
	res.status(201).json({ msg: "La prueba  ha  registrado con exito" });
};

const updatepanelPruebas = async (req, res) => {
	res.send("update guardada con exito..");
};

const deletepanelPruebas = async (req, res) => {
	res.status(200).json({
		msg: "El usuario a sido desactivado con exito...",
	});
};

module.exports = {
	createpanelPruebas,
	updatepanelPruebas,
	deletepanelPruebas,
	getpanelPruebas,
};
