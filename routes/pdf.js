const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const { getpdf } = require("../controllers/pdf");

const router = Router();

router.get("/:id", getpdf);

module.exports = router;
