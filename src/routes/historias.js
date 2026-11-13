var express = require("express");
var router = express.Router();

var historiaController = require("../controllers/historiaController");

// lista todas as histórias do fórum
router.get("/listar", function (req, res) {
    historiaController.listar(req, res);
});

// lista as histórias de um usuário (perfil)
router.get("/listar/:idUsuario", function (req, res) {
    historiaController.listarPorUsuario(req, res);
});

// publica uma nova história
router.post("/publicar/:idUsuario", function (req, res) {
    historiaController.publicar(req, res);
});

// edita uma história (só o autor consegue)
router.put("/editar/:idHistoria", function (req, res) {
    historiaController.editar(req, res);
});

// apaga uma história (só o autor consegue)
router.delete("/deletar/:idHistoria/:idUsuario", function (req, res) {
    historiaController.deletar(req, res);
});

module.exports = router;
