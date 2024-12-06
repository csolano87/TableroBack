const { Request, Response } = require("express");
const Envase = require("../models/tipoTubo");

const getTipotubo = async (req, res) => {
  const envase = await Envase.findAll();

  res.json({ ok: true, envase });
};

const postTipotubo = async (req, res) => {
  const { descripcion, codigo, estado } = req.body;

  console.log(req.body);
  const envases = new Envase({ codigo, descripcion, estado });
  const envase = await Envase.findOne({
    where: {
      codigo: envases.codigo,
    },
  });

  console.log(envase);

  if (envase) {
    return res.status(400).json({
      msg: "Este tubo  ya existe",
    });
  }

  await envases.save();
  res.status(201).json({ msg: "El tubo a sido registrado con exito" });
};

module.exports = { getTipotubo, postTipotubo };
