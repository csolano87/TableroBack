const { error } = require("console");
const { Request, Response } = require("express");
const fs = require("fs");
const csvToJson = require("convert-csv-to-json");
const Producto = require("../models/productos");
const { forIn } = require("lodash");
const getProductos = async (req, res) => {
	const productos = await Producto.findAll({
		where: {
			ESTADO: 1,
		},
	});
	res.status(200).json({
		ok: true,
		productos: productos,
	});
};

const getByProductos = async (req, res) => {
		const { id } = req.params;


	const productos = await Producto.findByPk(id);
	res.status(200).json({
		ok: true,
		productos: productos,
	});
};

const createProductos = async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ ok: false, msg: `No existe archivo` });
	}

	let fileInputName = req.file.path;

	let json = csvToJson.getJsonFromCsv(fileInputName);
	let productosGuardados = [];
	let productosDuplicados = [];
	for (const jsondata of json) {
		const datexistente = await Producto.findOne({
			where: { REFERENCIA: jsondata.REFERENCIA },
		});

		if (!datexistente) {
			const guardarProducto = await Producto.create(jsondata);
			productosGuardados.push(guardarProducto);
		} else {
			/* const existente = datexistente.map((ext)=>ext.producto)*/
			productosDuplicados.push(datexistente);
		}
	}

	const parseDuplicados = productosDuplicados.map(
		(ext) => ext.dataValues.REFERENCIA
	);
	const parseGuardados = productosGuardados.map(
		(ext) => ext.dataValues.REFERENCIA
	);

	if (productosGuardados.length > 0 && productosDuplicados.length > 0) {
		res.status(200).json({
			ok: true,
			msg: `Se han guardado con exito estos productos ${parseGuardados}, pero existen productos duplicados
                ${parseDuplicados},`,
		});
	} else if (productosGuardados.length > 0 && productosDuplicados.length == 0) {
		res.status(200).json({
			ok: true,
			msg: `Se ha ingresado con exito los siguientes productos  ${parseGuardados}`,
		});
	} else {
		res.status(200).json({
			ok: true,
			msg: `Los productos ingresados ya existen en el sistema ${parseDuplicados}`,
		});
	}
};

const updateProductos = async (req, res) => {
	res.send("update guardada con exito..");
};

const deleteProductos = async (req, res) => {
	const { id } = req.params;

	const producto = await Producto.findByPk(id);
	if (!producto) {
		return res.status(404).json({
			ok: false,
			msg: `No existe el producto seleccionado ${id}`,
		});
	}

	await producto.update({ ESTADO: 0 });
	res.status(200).json({
		msg: "El producto a sido desactivado con exito...",
	});
};

module.exports = {
	getProductos,
	getByProductos,
	createProductos,
	updateProductos,
	deleteProductos,
};
