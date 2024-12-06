const { Request, Response } = require("express");
const { Op, and, Sequelize } = require("sequelize");
const fs = require("fs");
const moment = require("moment");
const bcryptjs = require("bcryptjs");
const { Mutex } = require("async-mutex");

const path = require("path");
const { where } = require("sequelize");
const { sequelize } = require("../models/cabecera");
const db = require("../db/connection");
const Usuario = require("../models/usuarios");
const Cabecera_Agen = require("../models/cabecera_agen");
const Detalle_Agen = require("../models/detalle_agen");
const Cabecera = require("../models/cabecera");
const Detalle = require("../models/detalle");
const Server = require("../models/server");
const salas = require("../json/origen");

const hisMutex = new Mutex();
const out_dir = String.raw`C:\Users\devel\Videos`;

const ordenexternaGet = async (req, res) => {
  const server = Server.instance;

  const ordenes = await Cabecera.findAll({
    attributes: [
      "FECHA",
      [Sequelize.fn("COUNT", Sequelize.col("FECHA")), "count"],
    ],
    group: ["FECHA"],
  });
  server.io.emit("orden-generada", ordenes);

  res.json({
    ok: true,
    ordenes: ordenes,
  });
};

const ordenexternaGetTodos = async (req, res) => {
  const orden = await Cabecera.findAll({
    include: {
      model: Detalle,
      as: "pruebas",
    },
  });

  orden.forEach((objeto) => {
    const Dta = objeto.dataValues.DLCPRO;

    if (Array.isArray(Dta)) {
      const listGroups = Dta.map((item) => {
        const referenciaObjeto = salas.find((ref) => ref.id === item);
        if (referenciaObjeto) {
          return referenciaObjeto.nombre;
        }
        return item;
      });
      objeto.dataValues.DLCPRO = listGroups;
    } else {
      const referenciaObjeto = salas.find((ref) => ref.id === Dta);
      if (referenciaObjeto) {
        objeto.dataValues.DLCPRO = referenciaObjeto.nombre;
      } else {
        objeto.dataValues.DLCPRO = Dta; // Mantén el valor original si no hay coincidencia
      }
    }
  });

  res.status(200).json({
    ok: true,
    ordenes: orden,
  });
};
const ordenesGetfiltroExterna = async (req, res) => {
  console.log("params", req.query);
  const { IDENTIFICADOR, NUMEROORDEN, ESTADO, HIS, FECHA, FECHAORDEN, SALA } =
    req.query;
  console.log("**********IDENTIFICADOR**********", IDENTIFICADOR);
  console.log("**********NUMEROORDEN**********", NUMEROORDEN);
  console.log("**********ESTADO**********", ESTADO);
  console.log("**********HIS**********", HIS);
  console.log("**********FECHACITA**********", FECHA);
  console.log("**********FECHAORDEN**********", FECHAORDEN);
  let where = {};
  if (IDENTIFICADOR) {
    where.DLCEDU = {
      [Op.eq]: IDENTIFICADOR,
    };
  }

  if (NUMEROORDEN) {
    where.NUMEROORDEN = {
      [Op.eq]: NUMEROORDEN,
    };
  }

  if (ESTADO) {
    where.ESTADO = {
      [Op.eq]: ESTADO,
    };
  }

  if (HIS) {
    where.HIS = {
      [Op.eq]: HIS,
    };
  }

  if (FECHA) {
    where.FECHA = {
      [Op.eq]: FECHA,
    };
  }

  if (FECHAORDEN) {
    where.FECHAORDEN = {
      [Op.eq]: FECHAORDEN,
    };
  }

  if (SALA) {
    where.DLNUOR = {
      [Op.eq]: SALA,
    };
  }

  const data = await Cabecera.findAll({ where });

  data.forEach((objeto) => {
    const Dta = objeto.dataValues.DLCPRO;

    if (Array.isArray(Dta)) {
      const listGroups = Dta.map((item) => {
        const referenciaObjeto = salas.find((ref) => ref.id === item);
        if (referenciaObjeto) {
          return referenciaObjeto.nombre;
        }
        return item;
      });
      objeto.dataValues.DLCPRO = listGroups;
    } else {
      const referenciaObjeto = salas.find((ref) => ref.id === Dta);
      if (referenciaObjeto) {
        objeto.dataValues.DLCPRO = referenciaObjeto.nombre;
      } else {
        objeto.dataValues.DLCPRO = Dta; // Mantén el valor original si no hay coincidencia
      }
    }
  });
  console.log(`**************`, data);
  res.status(200).json({ ok: true, resultados: data });
};
const ordenexternaPost = async (req, res) => {
  const numExiste = await Cabecera.findOne({
    where: { DLNUOR: req.body.DLNUOR },
  });
  /* if (numExiste) {
	console.log(`La orden ${req.body.DLNUOR} ya se encuentra ingresada. `)
	return res.status(400).json({ok:false,msg:`La orden ${req.body.DLNUOR} ya se encuentra ingresada. `})
	
} */

  const totalAgendado = await Cabecera.count({
    where: { FECHA: req.body.FECHA },
  });
  if (totalAgendado == 4) {
    console.log(
      `No existe disponiblidad para agendar debe de seleccionar otra fecha`,
      totalAgendado,
    );
    return res
      .status(400)
      .json({
        ok: false,
        msg: `No hay disponibilidad en el agendamiento, seleccione otra fecha `,
      });
  }
  const server = Server.instance;
  const user = req.usuario;

  const {
    DLCBEN,
    DLCACT,
    DLCDEP,
    DLCOTR,
    DLCEDU,
    DLCPRO,
    DLCSER,
    DLCMED,
    DLCDIS,
    DLNUOR,
    DLAPEL,
    DLNOMB,
    DLSEXO,
    DLFECN,
    DLHIST,
    FECHA,
    DLTIDO,
  } = req.body;

  await Cabecera.create({
    DLCBEN,
    DLCACT,
    DLCDEP,
    DLCOTR,
    DLCEDU,
    DLCPRO,
    DLCSER,
    DLCMED,
    DLCDIS,
    DLNUOR,
    DLAPEL,
    DLNOMB,
    DLSEXO,
    DLFECN,
    DLHIST,
    FECHA: `${req.body.FECHA}` == "" ? null : FECHA,
    DLTIDO,
  }).then((cabecera) => {
    Detalle.bulkCreate(req.body.DLCEXAS).then((ItemID) => {
      cabecera.setPruebas(ItemID);
    });
  });

  const ordenesActualizadas = await Cabecera.findAll({
    attributes: [
      "FECHA",
      [Sequelize.fn("COUNT", Sequelize.col("FECHA")), "count"],
    ],
    group: ["FECHA"],
  });

  console.log(`************************`, ordenesActualizadas);
  server.io.emit("orden-generada", ordenesActualizadas);
  res.status(201).json({
    msg: `Se a creado exitosamente la orden # ${DLNUOR} para el paciente ${DLAPEL}  `,
  });
};
const ordenexternaUpdate = async (req, res) => {
  server = Server.instance;
  const user = req.usuario;

  moment.locale("es");
  const hoy = moment();
  const fecha = hoy.format().slice(2, 10).replaceAll("-", "");
  console.log(`fecha`, fecha);
  const fechaT = hoy.format("L").split("/");
  const fechaToma = fechaT[2] + "-" + fechaT[1] + "-" + fechaT[0];
  let Norden = 0;
  const horaToma = hoy.format("LTS");
  const releaseHisMutex = await hisMutex.acquire();

  try {
    const numeroOrdenBD = await Cabecera.findAll({
      attributes: ["NUMEROORDEN"],
      limit: 1,
      order: [["NUMEROORDEN", "DESC"]],
    });
    console.log(`******orden*****`, numeroOrdenBD[0].dataValues.NUMEROORDEN);
    let numero = parseInt(
      `${numeroOrdenBD[0].dataValues.NUMEROORDEN}`.slice(-4),
    );
    const rest =
      fecha - `${numeroOrdenBD[0].dataValues.NUMEROORDEN}`.slice(0, 6);
    if (isNaN(numero) || rest > 0) {
      let num = 0;
      Norden = `${num + 1}`.padStart(4, "0");
    } else {
      Norden = `${numero + 1}`.padStart(4, "0");
    }

    console.log(`******ordennumero*****`, req.body);
    const { HORATOMA, FECHATOMA, CODIMPRESORA, NUMEROORDEN, ESTADO } = req.body;

    console.log(`******orden34*****`, req.body);

    await Cabecera.update(
      {
        HORATOMA: horaToma,
        FECHATOMA: fechaToma,
        CODIMPRESORA,
        NUMEROORDEN: fecha + Norden,
        ESTADO: 2,
      },
      { where: { id: req.body.id } },
    );

    const ordenActualizada = await Cabecera.findAll({
      include: {
        model: Detalle,
        as: "pruebas",
      },
    });

    ordenActualizada.forEach((objeto) => {
      const Dta = objeto.dataValues.DLCPRO;

      if (Array.isArray(Dta)) {
        const listGroups = Dta.map((item) => {
          const referenciaObjeto = salas.find((ref) => ref.id === item);
          if (referenciaObjeto) {
            return referenciaObjeto.nombre;
          }
          return item;
        });
        objeto.dataValues.DLCPRO = listGroups;
      } else {
        const referenciaObjeto = salas.find((ref) => ref.id === Dta);
        if (referenciaObjeto) {
          objeto.dataValues.DLCPRO = referenciaObjeto.nombre;
        } else {
          objeto.dataValues.DLCPRO = Dta; // Mantén el valor original si no hay coincidencia
        }
      }
    });

    server.io.emit("numero-generado", ordenActualizada);
    /* const idw = req.body.pruebas.filter((e) => e.ESTADO == '1').map((e, i) => `O|${i + 1}|${fecha}${Norden}|${e.ItemID}|${fecha}|${horaToma}`).join('\n');
		
		const filename = path.join(out_dir, `${fecha + Norden}.ord`);
		const data =
			`H|^&|Roche^^Diagnostics|||OrderEntry^Interface||HPBO^^cobas_Infinity||||P|
        P|1|${fecha}${Norden}|${req.body.DLCEDU}|${req.body.DLAPEL}|${req.body.DLAPEL}|${req.body.DLFECN}|${req.body.DLSEXO}|${req.body.CODDOCTOR}|${req.body.CODTIPOORDEN}|${req.body.CODSALA}|${req.body.OPERADOR}|${req.body.CODFLEBOTOMISTA}|${req.body.CORRELATIVO}|${req.body.CODIMPRESORA}|${nInfinity.HIS}|${fecha}|${horaToma}
        ${idw}
        L|1|F`;
		fs.writeFileSync(`${filename}`, data); */

    /* GENERAR HL7 Y ENVIO A INFINITY */
    const partesApel = req.body.DLAPEL.split(" ");

    const idw = req.body.pruebas
      .map(
        (e, i) =>
          `O|${i + 1}|${fecha}${Norden}|${e.ItemID}|${fecha}|${horaToma}`,
      )
      .join("\n");

    const filename = path.join(out_dir, `${fecha + Norden}.ord`);
    const data =
      `H|^&|Roche^^Diagnostics|||OrderEntry^Interface||HPBO^^cobas_Infinity||||P|\n` +
      `P|1|${fecha}${Norden}|${req.body.DLCEDU}|${partesApel.slice(0, 2).join(" ")}|${partesApel.slice(partesApel.length - 2).join(" ")}|${req.body.DLFECN}|${req.body.DLSEXO}|${req.body.DLCMED}|${req.body.DLTIDO}|${req.body.CODIMPRESORA}|${req.body.DLHIST}|${fecha}|${horaToma}\n` +
      `${idw}\n` +
      `L|1|F`;

    /* `MSH|^~\&||IESS QUEVEDO|cobas Infinity|Roche Ecuador|20230817171123||OML^O21^OML_O21|202308171711237517844 \n`+
`PID|1|${req.body.DLCEDU}|117512|117512|${req.body.DLAPEL}^.||${req.body.DLFECN}|${req.body.DLSEXO}||\n`+
`PV1||1|^^|ARIVERA^ARIVERA|1^IESS QUEVEDO|${req.body.CODIMPRESORA}^SECRETARIA 1|1|9|9|||||||||2308177844|4170946\n`+
`ORC|NW||||||||20230817171123|||13154927|3|||U|142\n`+
`${idw}\n` */

    fs.writeFileSync(`${filename}`, data);

    res.status(201).json({
      msg: `Se genero correctamente el ingreso de la orden del paciente ${req.body.DLAPEL} `,
    });
  } catch (error) {
    console.log(`*****************ERROR*************`, error);
  } finally {
    releaseHisMutex(); // Libera el bloqueo una vez que se completa la consulta y actualización
  }
};

const ordenexternaDelete = async (req, res) => {
  server = Server.instance;
  const { id } = req.params;
  console.log(id);
  const orden = await Cabecera.findByPk(id);
  if (!orden) {
    return res.status(404).json({
      msg: `No existe la orden  con el id ${id}`,
    });
  }
  if (orden.ESTADO === 2 || orden.ESTADO === 3) {
    return res.status(401).json({
      msg: `La orden con estado ingresado  no puede ser eliminada`,
    });
  }

  /* const ordenEliminada = await Cabecera.findAll({
include:{
	model:Detalle,
	as:'pruebas',
	
}
	}) */

  await orden.update({ ESTADO: 0 });

  const ordenEliminada = await Cabecera.findAll({
    include: {
      model: Detalle,
      as: "pruebas",
    },
  });

  ordenEliminada.forEach((objeto) => {
    const Dta = objeto.dataValues.DLCPRO;

    if (Array.isArray(Dta)) {
      const listGroups = Dta.map((item) => {
        const referenciaObjeto = salas.find((ref) => ref.id === item);
        if (referenciaObjeto) {
          return referenciaObjeto.nombre;
        }
        return item;
      });
      objeto.dataValues.DLCPRO = listGroups;
    } else {
      const referenciaObjeto = salas.find((ref) => ref.id === Dta);
      if (referenciaObjeto) {
        objeto.dataValues.DLCPRO = referenciaObjeto.nombre;
      } else {
        objeto.dataValues.DLCPRO = Dta; // Mantén el valor original si no hay coincidencia
      }
    }
  });

  server.io.emit("orden-eliminada", ordenEliminada);
  res.status(200).json({
    msg: "La orden  a sido eliminada con exito...",
  });
};

module.exports = {
  ordenexternaGet,
  ordenexternaPost,
  ordenexternaUpdate,
  ordenexternaDelete,
  ordenexternaGetTodos,
  ordenesGetfiltroExterna,
};
