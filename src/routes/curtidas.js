var express = require("express");
var router = express.Router();

var curtidaController = require("../controllers/curtidaController");

// curtir uma história (body: idUsuarioServer)
router.post("/curtir/:idHistoria", function (req, res) {
    curtidaController.curtir(req, res);
});

// tirar a curtida
router.delete("/descurtir/:idHistoria/:idUsuario", function (req, res) {
    curtidaController.descurtir(req, res);
});

// ids das histórias que o usuário já curtiu
router.get("/usuario/:idUsuario", function (req, res) {
    curtidaController.listarDoUsuario(req, res);
});

module.exports = router;
