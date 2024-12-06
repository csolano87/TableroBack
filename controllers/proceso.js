const { Request, Response } = require("express");

const Proceso = require("../models/proceso");

const pdf = require("html-pdf");

const nodemailer = require("nodemailer");
const path = require("node:path");
const mailer = require("../templates/signup-mail");
const Usuario = require("../models/usuarios");
const { Op } = require("sequelize");

const getproceso = async (req, res) => {
	const data = await Proceso.findAll();

	res.status(200).json({
		ok: true,
		proceso: data,
	});
};

const getByProceso = async (req, res) => {
	const { termino } = req.params;
console.log(termino)
	const dataCA = termino.replace(/\w\S*/g, function (e) {
		return e.charAt(0).toUpperCase() + e.substring(1);
	});

	const data = await Proceso.findAll({
		where: {
			institucion: {
				[Op.like]: `%${dataCA}%`,
			},
		},
	});
	res.status(200).json({ ok: true, resultados: data });
};

const createregistro = async (req, res) => {
	const user = req.usuario;
	const {
		institucion,
		codigo,
		linkproceso,
		tiempoconsumo,
		determinacion,
		presupuesto,
		entregacarpeta,
		areas,
		terceraopcion,
		sistema,
		equipoprincipal,
		equipobackup,
		observacion,
		licenciaEquiposHematologicos,
		adjunto,
		correo,
	} = req.body;

	const validacodigo = await Proceso.findOne({ codigo: codigo });
	console.log(`req.body`, req.body);

	/* if (validacodigo != null) {
		return res.status(400).json({ msg: "La orden no se puede registar" });
	}  */
/* 
	if (validacodigo.codigo === codigo) {
		return res
			.status(400)
			.json({ msg: "Este codigo que esta ingresando  ya existe" });
	} */

	const correo2 = correo.replace(/(\r\n|\n|\r)/gm, ";");
	console.log(`adjunto`, adjunto);
	const registro = new Proceso({
		institucion,
		codigo,
		linkproceso,
		tiempoconsumo,
		determinacion,
		presupuesto,
		entregacarpeta,
		areas,
		terceraopcion,
		sistema,
		equipoprincipal,
		equipobackup,
		observacion,
		usuarioId: user.doctor,
		licenciaEquiposHematologicos,
	});

	await registro.save();

  res.status(200).json({ok:true, msg: `Se ha registrado con exito ${codigo}`})
};

const updateregistro = async (req, res) => {
	res.send("update guardada con exito..");
};

const usuariosDelete = async (req, res) => {
	//   res.status(200).json({ msg 'El usuario a sido desactivado con exito...'  });
};

module.exports = { getproceso, createregistro, getByProceso };
