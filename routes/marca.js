const { Router } = require("express");


const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole } = require("../middleware/validar-roles");
const { createmarca, getmarca } = require("../controllers/marca");

const router = Router();

router.get("/", [validarJWT, esAdminRole],getmarca );
router.post("/", [validarJWT, esAdminRole], createmarca);
/* 

router.put('/:id',usuariosUpdate );

router.post('/',usuariosPost );

router.delete('/:id',usuariosDelete );
 */

module.exports = router;