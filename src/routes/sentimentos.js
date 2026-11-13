var express = require("express");
var router = express.Router();

var sentimentoController = require("../controllers/sentimentoController");

// lista os 8 sentimentos (usado no select da hora de publicar)
router.get("/listar", function (req, res) {
    sentimentoController.listar(req, res);
});

module.exports = router;
