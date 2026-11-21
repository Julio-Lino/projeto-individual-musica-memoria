var express = require("express");
var router = express.Router();

var questionarioController = require("../controllers/questionarioController");

// as perguntas e alternativas (a tela monta o questionário com isso)
router.get("/perguntas", function (req, res) {
    questionarioController.perguntas(req, res);
});

// salva as respostas de uma pessoa
router.post("/responder/:idUsuario", function (req, res) {
    questionarioController.responder(req, res);
});

module.exports = router;
