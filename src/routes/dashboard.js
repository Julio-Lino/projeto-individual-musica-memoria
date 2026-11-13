var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.get("/sentimentos", function (req, res) {
    dashboardController.sentimentosMaisPublicados(req, res);
});

router.get("/artistas", function (req, res) {
    dashboardController.artistasMaisLembrados(req, res);
});

router.get("/musicas", function (req, res) {
    dashboardController.musicasMaisLembradas(req, res);
});

router.get("/meses", function (req, res) {
    dashboardController.historiasPorMes(req, res);
});

router.get("/mais-curtidas", function (req, res) {
    dashboardController.historiasMaisCurtidas(req, res);
});

router.get("/mais-comentadas", function (req, res) {
    dashboardController.historiasMaisComentadas(req, res);
});

module.exports = router;
