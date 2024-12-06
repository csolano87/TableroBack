const { Router } = require("express");
const { getTipotubo, postTipotubo } = require("../controllers/tipoTubo");

const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles");

const router = Router();

router.get("/", [validarJWT, tieneRole], getTipotubo);
router.post("/", [validarJWT, tieneRole], postTipotubo);

module.exports = router;
