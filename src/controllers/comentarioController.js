var comentarioModel = require("../models/comentarioModel");

function responderErro(res, erro, mensagem) {
    console.log("\n" + mensagem + " Erro: ", erro.sqlMessage || erro);
    res.status(500).send(mensagem);
}

function listar(req, res) {
    comentarioModel.listar(req.params.idHistoria)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            responderErro(res, erro, "Houve um erro ao buscar os comentários.");
        });
}

function publicar(req, res) {
    var idHistoria = req.params.idHistoria;
    var idUsuario = req.body.idUsuarioServer;
    var texto = req.body.textoServer;

    if (texto == undefined || String(texto).trim() == "") {
        res.status(400).send("O comentário está vazio!");
    } else if (idUsuario == undefined || idUsuario == "") {
        res.status(403).send("O id do usuário está indefinido!");
    } else {
        comentarioModel.publicar(idHistoria, idUsuario, String(texto).trim())
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                if (erro.code == "ER_NO_REFERENCED_ROW_2") {
                    res.status(404).send("Essa história não existe mais.");
                } else {
                    responderErro(res, erro, "Houve um erro ao publicar o comentário.");
                }
            });
    }
}

function deletar(req, res) {
    comentarioModel.deletar(req.params.idComentario, req.params.idUsuario)
        .then(function (resultado) {
            if (resultado.affectedRows == 0) {
                res.status(403).send("Você só pode apagar os seus próprios comentários.");
            } else {
                res.json(resultado);
            }
        })
        .catch(function (erro) {
            responderErro(res, erro, "Houve um erro ao apagar o comentário.");
        });
}

module.exports = {
    listar,
    publicar,
    deletar
};
