const axios = require("axios").default;
const csvtojson = require("csvtojson");
const fs = require("fs");

const pruebasQuevedo = require("../json/pruebasQuevedo");
const buscarAs400 = async (req, res) => {
  const { dlnuor } = req.params;

  let params = {
    dlnuor: `${dlnuor}`,
    dlunme: "2221010000",
  };

  const instance = axios.create({
    baseURL: process.env.AS400,
    params,
  });

  const resp = await instance.get();
  const as400 = resp.data;

  if (as400 && as400.DLCEXAS) {
    const GroupList = as400.DLCEXAS.map((item) => {
      const referenciaObjeto = pruebasQuevedo.find(
        (ref) => ref["ID externo"] == item,
      );
      if (referenciaObjeto) {
        return {
          ItemID: referenciaObjeto["ID interno"],
          ItemName: referenciaObjeto.Descripción,
        };
      }
      return item;
    });
    as400.DLCEXAS = GroupList;
  }
  res.status(200).json({ ok: true, data: as400 });
};

module.exports = {
  buscarAs400,
};
