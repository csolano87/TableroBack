const { Router } = require("express");
const { buscarordenes, buscarordene, OrdenesTotal } = require("../controllers/buscarordenes");
const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");

const router = Router();

/* router.get("/:cedula", [validarJWT, tieneRole], buscarordenes);
router.get("/", [validarJWT, tieneRole], buscarordene); */
router.get("/ordenesTotales/",  OrdenesTotal);//OrdenesTotal

module.exports = router;
