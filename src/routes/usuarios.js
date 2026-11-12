var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

// recebe os dados do cadastro.html e manda para o controller
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
});

// recebe os dados do login.html e manda para o controller
router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

module.exports = router;
