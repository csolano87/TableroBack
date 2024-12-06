const { Router } = require("express");

const { validarJWT } = require("../middleware/validar-jwt");
const { tieneRole } = require("../middleware/validar-roles");
const {
	getProductos,
	getByProductos,
	createProductos,
	deleteProductos,
} = require("../controllers/productos");
const multer = require("multer");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});
const upload = multer({ storage: storage });
const router = Router();
router.get("/", getProductos);
router.get("/:id",[validarJWT, tieneRole], getByProductos);
router.post(
	"/",
	upload.single("file"),
	validarJWT,
	tieneRole,

	createProductos
);
router.delete("/:id", [validarJWT, tieneRole], deleteProductos);

module.exports = router;
