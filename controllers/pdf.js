const { PDFDocument, rgb, hasUtf16BOM, utf16Decode } = require("pdf-lib");
const fs = require("fs");

const { Request, Response } = require("express");
const Cabecera = require("../models/cabecera");
const pdf = require("html-pdf");
const Detalle = require("../models/detalle");
const Cabecera_Agen = require("../models/cabecera_agen");
const Detalle_Agen = require("../models/detalle_agen");

const getpdf = async (req, res) => {
  const { id } = req.params;

  console.log(id);
  const idCabecera = await Cabecera_Agen.findOne({
    where: { id: id },
    include: {
      model: Detalle_Agen,
      as: "as400",
      attributes: ["ItemID", "ItemName"],
    },
  });

  if (!idCabecera) {
    return res.status(400).json({ msg: "No existe orden creada" });
  }
  const opcionesPDF = {
    format: "Letter",
    border: {
      top: "1px",
      right: "1px",
      bottom: "1px",
      left: "1px",
    },
  };

  let html = '<table style="border-collapse: collapse;">';

  html += "<thead><tr>";
  html +=
    ' <th style="border: 1px solid black;font-size:18px;background-color: #8f8888;">INSTITUCION DEL SISTEMA</th>';
  html +=
    ' <th style="border: 1px solid black;font-size:18px;background-color: #8f8888;">UNIDAD OPERATIVA</th>';
  html +=
    ' <th style="border: 1px solid black;font-size:18px;background-color: #8f8888;">COD. UO</th>';
  html +=
    ' <th style="border: 1px solid black;font-size:18px;background-color: #8f8888;">COD. LOCALIZACION</th>';
  html +=
    ' <th style="border: 1px solid black;font-size:18px;background-color: #8f8888;">NUMERO DE  HISTORIA CLINICA</th>';

  html += "</tr></thead>";

  html += "<tbody><tr>";
  html +=
    '<td style="border: 1px solid black;font-size:28px">Ministerio de Salud publica</td>';
  html += '    <td style="border: 1px solid black;font-size:28px">HGMI</td>';
  html += '    <td style="border: 1px solid black;font-size:28px">12-032</td>';
  html +=
    '    <td style="border: 1px solid black;font-size:28px">01-12-12</td>';
  html += `    <td style="border: 1px solid black;font-size:28px">${idCabecera.IDENTIFICADOR}</td>`;
  html += "</tr></tbody>";

  html += "<thead><tr>";
  html +=
    '<th style="border: 1px solid black;font-size:18px;width:30%;background-color: #8f8888;">ORIGEN</th>';
  html +=
    '        <th style="border: 1px solid black;font-size:18px;background-color: #8f8888;">SERVICIO</th>';
  html +=
    '        <th style="border: 1px solid black;font-size:18px;background-color: #8f8888;">SALA</th>';
  html +=
    '        <th style="border: 1px solid black;font-size:18px;background-color: #8f8888;">CAMA</th>';
  html +=
    '        <th style="border: 1px solid black;font-size:18px;background-color: #8f8888;">FECHA TOMA</th>';

  html += "</tr></thead>";

  html += "<tbody><tr>";
  html +=
    '   <td style="border: 1px solid black;font-size:28px;">CONSULTA EXTERNA</td>';
  html += '   <td style="border: 1px solid black;font-size:28px"></td>';
  html += '   <td style="border: 1px solid black;font-size:28px"></td>';
  html += '   <td style="border: 1px solid black;font-size:28px"></td>';
  html += `  <td style="border: 1px solid black;font-size:28px">${idCabecera.FECHATOMA}</td>`;
  html += "</tr></tbody>";

  html += "<thead><tr>";
  html +=
    '<th style="border: 1px solid black;font-size:18px;width:60%;background-color: #8f8888;">APELLIDOS</th>';
  html +=
    '       <th style="border: 1px solid black;font-size:18px;width:60%;background-color: #8f8888;">NOMBRES</th>';
  html +=
    '       <th style="border: 1px solid black;font-size:18px;width:40%;background-color: #8f8888;">EDAD</th>';
  html +=
    '       <th style="border: 1px solid black;font-size:18px;width:60%;background-color: #8f8888;">CEDULA</th>';
  html +=
    '       <th style="border: 1px solid black;font-size:18px;width:60%;background-color: #8f8888;">HIS</th>';

  html += "</tr></thead><br>";

  html += "<tbody><tr>";
  html += `   <td style="border: 1px solid black;font-size:20px;">${idCabecera.APELLIDO}</td>`;
  html += `    <td style="border: 1px solid black;font-size:20px;">${idCabecera.NOMBRES}</td>`;
  html += `    <td style="border: 1px solid black;font-size:20px;">${idCabecera.EDAD}</td>`;
  html += `  <td style="border: 1px solid black;font-size:20px;">${idCabecera.IDENTIFICADOR}</td>`;
  html += `  <td style="border: 1px solid black;font-size:20px;">${idCabecera.HIS}</td>`;
  html += "</tr></tbody>";

  // Agregar encabezado de la tabla
  html += "<thead><tr>";
  html +=
    '<th style="border: 1px solid black;font-size:28px;width:100%;background-color: #8f8888;" colspan="5""> Lista de examenes </th>';

  html += "</tr></thead>";

  // Agregar contenido de la tabla
  html += "<tbody>";
  idCabecera.as400.forEach((dataValue) => {
    html += "<tr>";
    html += `<td style="border: 1px solid black;font-size:28px;width:100%;" colspan="5"">${dataValue.ItemID} ${dataValue.ItemName}</td>`;

    html += "</tr>";
  });
  html += "</tbody>";

  // Cerrar la etiqueta de la tabla

  html += "<thead><tr>";
  html +=
    ' <th style="border: 1px solid black;background-color: #8f8888;">FECHA</t>';
  html += `<td style="height:50%">${idCabecera.FECHAORDEN}</td>`;
  html +=
    ' <th style="border: 1px solid black;background-color: #8f8888;">HORA</t>';
  html += `<td style="height:50%">${idCabecera.HORAORDEN}</td>`;

  html += "</tr></thead><br>";

  html += "<tbody><tr>";

  html +=
    '<th style="border: 1px solid black;background-color: #8f8888;">NOMBRE DEL PROFESIONAL</t>';
  html += `<td>${idCabecera.CODDOCTOR}</td>`;
  html +=
    '<th style="border: 1px solid black;background-color: #8f8888;">FIRMA</t>';
  html += `<td>${idCabecera.CODDOCTOR}</td>`;
  html += "</tr></tbody>";

  html += "</table>";

  pdf.create(html, opcionesPDF).toStream((err, stream) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al generar el archivo PDF" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="archivo.pdf"');

    stream.pipe(res);
  });

  // res.json({pdf:html})
};

module.exports = {
  getpdf,
};
