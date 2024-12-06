const { Router } = require("express");
const { generarId } = require("../controllers/id");

//const { check } = require('express-validator');
//validator = require('validator');

const router = Router();

router.put(
  "/",

  generarId,
);

module.exports = router;
