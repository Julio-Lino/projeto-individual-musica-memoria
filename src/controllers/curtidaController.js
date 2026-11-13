var curtidaModel = require("../models/curtidaModel");

function responderErro(res, erro, mensagem) {
    console.log("\n" + mensagem + " Erro: ", erro.sqlMessage || erro);
    res.status(500).send(mensagem);
}

function curtir(req, res) {
    var idHistoria = req.params.idHistoria;
    var idUsuario = req.body.idUsuarioServer;

    if (idUsuario == undefined || idUsuario == "") {
        res.status(403).send("O id do usuário está indefinido!");
    } else {
        curtidaModel.curtir(idHistoria, idUsuario)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                if (erro.code == "ER_NO_REFERENCED_ROW_2") {
                    res.status(404).send("Essa história não existe mais.");
                } else {
                    responderErro(res, erro, "Houve um erro ao curtir a história.");
                }
            });
    }
}

function descurtir(req, res) {
    curtidaModel.descurtir(req.params.idHistoria, req.params.idUsuario)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            responderErro(res, erro, "Houve um erro ao remover a curtida.");
        });
}

function listarDoUsuario(req, res) {
    curtidaModel.listarDoUsuario(req.params.idUsuario)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            responderErro(res, erro, "Houve um erro ao buscar as curtidas.");
        });
}

module.exports = {
    curtir,
    descurtir,
    listarDoUsuario
};
