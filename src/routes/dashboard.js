var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

// ---- usados pela Home (histórias do fórum) ----
router.get("/sentimentos", function (req, res) {
    dashboardController.sentimentosMaisPublicados(req, res);
});

router.get("/artistas", function (req, res) {
    dashboardController.artistasMaisLembrados(req, res);
});

// ---- dashboard (questionário) ----
// aba Comunidade
router.get("/comunidade", function (req, res) {
    dashboardController.comunidade(req, res);
});

// aba Pessoal
router.get("/pessoal/:idUsuario", function (req, res) {
    dashboardController.pessoal(req, res);
});

module.exports = router;
