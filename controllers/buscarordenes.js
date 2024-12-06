const express = require("express");
const { Request, Response } = require("express");
const Cabecera = require("../models/cabecera");
const localStorage = require("localStorage");
const axios = require("axios").default;
const xml2js = require("xml2js");
const fs = require("fs");
const appt = express();
const moment = require("moment");
const { loginInfinity } = require("../helpers/loginInfinity");
const { key } = require("localStorage");
const stripNS = require("xml2js").processors.stripPrefix;
const login = require("../controllers/login");
const Usuario = require("../models/usuarios");

const buscarordenes = async (req, res) => {
	const { cedula } = req.params;

	const tokenID = localStorage.getItem("Idtoken");

	const rawcookies = localStorage.getItem("rawcookies");
	let params = {
		soap_method: `${process.env.Ordenes}`,
		pstrSessionKey: `${tokenID}`,
		pstrPatientID2: `${cedula}`,
	};

	try {
		const insstance = axios.create({
			baseURL: `${process.env.baseURL}/wso.ws.wOrders.cls`,
			params,
			headers: { cookie: rawcookies },
		});

		const respo = await insstance.get();
		const path2 = `${respo.data}`;
		xml2js.parseString(
			path2,
			{
				explicitArray: false,
				mergeAttrs: true,
				explicitRoot: false,
				tagNameProcessors: [stripNS],
			},
			(err, result) => {
				if (err) {
					throw err;
				}

				const listaordenes =
					result.Body.GetListResponse.GetListResult.diffgram.DefaultDataSet.SQL;

				if (Array.isArray(listaordenes) == true) {
					res.status(200).json({
						ok: true,
						listaordenes: listaordenes,
					});
				} else {
					let listaArray = [];
					listaArray.push(listaordenes);
					console.log("es un obj convertido en array ", listaArray);

					res.status(200).json({
						ok: true,
						listaordenes: listaArray,
					});
				}
			}
		);
	} catch (error) {
		console.log("error", error);
		res.status(404).json({ ok: false, "ERROR DEL SERVER": error });
	}
};

const buscarordene = async (req, res) => {
	const { PatientID1, SampleID, apellido } = req.query;

	console.log(SampleID);
	const CacheUserName = `${process.env.CacheUserName}`;
	const CachePassword = `${process.env.CachePassword}`;
	const token = `${CacheUserName}:${CachePassword}`;
	const encodedToken = Buffer.from(token).toString("base64");

	const responseToken = await loginInfinity(encodedToken);
	localStorage.setItem("Idtoken", responseToken);
	const tokenResult = localStorage.getItem("sn");
	const rawcookies = localStorage.getItem("rawcookies");

	let params = {
		soap_method: `${process.env.Ordenes}`,
		pstrSessionKey: `${tokenResult}`,
		pstrPatientID1: `${PatientID1}`.replace("undefined", ""),
		pstrSampleID: `${SampleID}`.replace("undefined", ""),
		pstrLastName: `${req.query.apellido}`.replace("undefined", ""),
		pstrRegisterDateFrom: "2021-01-01",
		pstrRegisterDateTo: "2050-01-01",
	};
	const intance = axios.create({
		baseURL: `${process.env.baseURL}/wso.ws.wOrders.cls`,
		params,
		headers: { cookie: rawcookies },
	});

	const resp = await intance.get();

	try {
		xml2js.parseString(
			resp.data,
			{
				explicitArray: false,
				mergeAttrs: true,
				explicitRoot: false,
				tagNameProcessors: [stripNS],
			},
			(err, result) => {
				if (err) {
					throw err;
				}

				const listaordenes =
					result.Body.GetListResponse.GetListResult.diffgram.DefaultDataSet.SQL;

				if (listaordenes != undefined || listaordenes != null) {
					if (Array.isArray(listaordenes) == true) {
						res.status(200).json({
							ok: true,
							listaordenes: listaordenes,
						});
					} else {
						let listaArray = [];
						listaArray.push(listaordenes);
						res.status(200).json({
							ok: true,
							listaordenes: listaArray,
						});
					}
				} else {
					res.status(400).json({ ok: true, msg: `No existe orden ` });
				}
			}
		);
	} catch (error) {
		console.log("---- line 147777777");
		localStorage.removeItem("Idtoken");
		buscarordene(req, res);
	}
};
const OrdenesTotal = async (req, res) => {
	const getResult = async () => {
		const hoy = moment();
		const hora = moment().format("HH:mm:ss");
		const fechaanterior = hoy.subtract(1, "day");
		const fechaFormateada = fechaanterior.format("YYYY-MM-DD");
		//const hora = moment("00:00:00", "HH:mm:ss");
		console.log("hora-++", fechaFormateada);
		const fecha = hoy.format().slice(0, 10);
		return new Promise(async (resolve, reject) => {
			const CacheUserName = `${process.env.CacheUserName}`;
			const CachePassword = `${process.env.CachePassword}`;
			const token = `${CacheUserName}:${CachePassword}`;
			const encodedToken = Buffer.from(token).toString("base64");

			const responseToken = await loginInfinity(encodedToken);
			localStorage.setItem("Idtoken", responseToken);
			const tokenResult = localStorage.getItem("Idtoken");
			console.log("primer token", tokenResult);
			const rawcookies = localStorage.getItem("rawcookies");

			let params = {
				soap_method: `${process.env.Ordenes}`,
				pstrSessionKey: `${tokenResult}`,
				/* pstrRegisterDateFrom: `${fecha}`,
				pstrRegisterDateTo: `${fecha}`,  */
				pstrRegisterDateFrom: `${fechaFormateada}`,
				pstrRegisterDateTo: `2024-01-01`,
			};
			const intance = axios.create({
				baseURL: `${process.env.baseURL}/wso.ws.wOrders.cls`,
				params,
				headers: { cookie: rawcookies },
			});

			const resp = await intance.get();

			xml2js.parseString(
				resp.data,
				{
					explicitArray: false,
					mergeAttrs: true,
					explicitRoot: false,
					tagNameProcessors: [stripNS],
				},
				(err, result) => {
					if (err) {
						throw err;
					}

					const lista =
						result.Body.GetListResponse.GetListResult.diffgram.DefaultDataSet
							.SQL;
							console.log(`********************************`,lista)
					const listaordene = lista.filter(
						(item) => item.Origin === "URGENCIAS"
					);
					resolve(listaordene);
				}
			);
		});
	};

	const getpacientes = (cedula) => {
		return new Promise(async (resolve, reject) => {
			const responseToken1 = localStorage.getItem("Idtoken");
			let params = {
				soap_method: "GetList",
				pstrSessionKey: `${responseToken1}`,
				pstrPatientID1: `${cedula}`,
			};

			const rawcookies = localStorage.getItem("rawcookies");

			const orden = axios.create({
				baseURL: `${process.env.baseURL}/wso.ws.wPatients.cls`,
				params,
				headers: { cookie: rawcookies },
				//timeout:5000,
			});
			const resp = await orden.get();
			//	console.log("pacinetes", resp.data);
			xml2js.parseString(
				resp.data,
				{
					explicitArray: false,
					mergeAttrs: true,
					explicitRoot: false,
					tagNameProcessors: [stripNS],
				},
				(err, result) => {
					if (err) {
						throw err;
					}
					const dataPaciente =
						result.Body.GetListResponse.GetListResult.diffgram.DefaultDataSet
							.SQL;

					resolve(dataPaciente);
				}
			);
		});
	};
	let dataArray = [];
	getResult().then(async (cedula) => {
		try {
			//	console.log("data result", cedula);
			const items = await Promise.all(
				cedula.map(async (element) => {
					const ced = await getpacientes(element.PatientID1);
					//console.log(element);
					return {
						RegisterDate: element.RegisterDate,
						RegisterHour: element.RegisterHour,
						IsOrderValidated: element.IsOrderValidated,
						cedula: ced.D_102,
						SurNameAndName: element.SurNameAndName,
						Origin: element.Origin,
						Service: element.Service,
					};
				})
			);
			dataArray = items;
			res.json({ ok: true, listaordenes: dataArray });
		} catch (error) {
			console.log(error);
			res.status(500).json({ ok: false, error });
		}

		/* no funciona datarray */
	});
	console.log(`---`, dataArray);
};

module.exports = {
	buscarordene,
	buscarordenes,
	OrdenesTotal,
};
