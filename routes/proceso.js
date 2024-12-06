const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { validarCampos } = require("../middleware/validar-campos");
const { check } = require("express-validator");
const { createregistro, getproceso, getByProceso } = require("../controllers/proceso");

const router = Router();
router.get("/", getproceso)
router.get("/:termino", getByProceso)
router.post(
  "/",
  validarJWT,
  tieneRole,
  [
    check("institucion", "La institucion es obligatorio").not().isEmpty(),
    check("codigo", "El codigo  es obligatorio").not().isEmpty(),
    check("linkproceso", "El link de proceso es obligatorio").not().isEmpty(),
    check("tiempoconsumo", "El tiempoo de consumoe es obligatorio")
      .not()
      .isEmpty(),
    check("determinacion", "la determinacion es obligatorio").not().isEmpty(),
    check("presupuesto", "El presupuesto es obligatorio").not().isEmpty(),
    check("entregacarpeta", "la entrega de carpeta es obligatorio")
      .not()
      .isEmpty(),
    check("areas", "Las areas es obligatorio").not().isEmpty(),
    check("sistema", "El sistema es obligatorio").not().isEmpty(),
    check("terceraopcion", "la tercera opcion es obligatorio").not().isEmpty(),
    check("observacion", "la obeservacion es obligatorio").not().isEmpty(),
  
    /* check('licenciaEquiposHematologicos', 'El OBSERVACIONES es obligatorio').not().isEmpty(), */
    /* check('equipoprincipal.eqquimica', 'El CODEXAMEN es obligatorio').not().isEmpty(),
    check('equipobackup.', 'El EXAMEN es obligatorio').not().isEmpty(), */
    validarCampos,
  ],
  createregistro,
);

module.exports = router;
