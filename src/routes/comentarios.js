var express = require("express");
var router = express.Router();

var comentarioController = require("../controllers/comentarioController");

// comentários de uma história
router.get("/listar/:idHistoria", function (req, res) {
    comentarioController.listar(req, res);
});

// comentar em uma história (body: idUsuarioServer, textoServer)
router.post("/publicar/:idHistoria", function (req, res) {
    comentarioController.publicar(req, res);
});

// apagar um comentário (só o autor consegue)
router.delete("/deletar/:idComentario/:idUsuario", function (req, res) {
    comentarioController.deletar(req, res);
});

module.exports = router;
