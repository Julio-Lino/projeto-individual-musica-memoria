var historiaModel = require("../models/historiaModel");

function responderErro(res, erro, mensagem) {
    console.log("\n" + mensagem + " Erro: ", erro.sqlMessage || erro);
    res.status(500).send(mensagem);
}

function vazio(valor) {
    return valor == undefined || String(valor).trim() == "";
}

function listar(req, res) {
    historiaModel.listar()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            responderErro(res, erro, "Houve um erro ao buscar as histórias.");
        });
}

function listarPorUsuario(req, res) {
    historiaModel.listarPorUsuario(req.params.idUsuario)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            responderErro(res, erro, "Houve um erro ao buscar as histórias do usuário.");
        });
}

function publicar(req, res) {
    var idUsuario = req.params.idUsuario;
    var musica = req.body.musicaServer;
    var artista = req.body.artistaServer;
    var idSpotify = req.body.idSpotifyServer; // opcional
    var relato = req.body.relatoServer;
    var idSentimento = req.body.idSentimentoServer;

    if (vazio(musica)) {
        res.status(400).send("O nome da música está indefinido!");
    } else if (vazio(artista)) {
        res.status(400).send("O artista está indefinido!");
    } else if (vazio(relato)) {
        res.status(400).send("O relato está indefinido!");
    } else if (vazio(idSentimento)) {
        res.status(400).send("O sentimento está indefinido!");
    } else if (vazio(idUsuario)) {
        res.status(403).send("O id do usuário está indefinido!");
    } else {
        historiaModel.publicar(musica.trim(), artista.trim(), idSpotify, relato.trim(), idSentimento, idUsuario)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                responderErro(res, erro, "Houve um erro ao publicar a história.");
            });
    }
}

function editar(req, res) {
    var idHistoria = req.params.idHistoria;
    var idUsuario = req.body.idUsuarioServer;
    var musica = req.body.musicaServer;
    var artista = req.body.artistaServer;
    var idSpotify = req.body.idSpotifyServer; // opcional
    var relato = req.body.relatoServer;
    var idSentimento = req.body.idSentimentoServer;

    if (vazio(musica) || vazio(artista) || vazio(relato) || vazio(idSentimento) || vazio(idUsuario)) {
        res.status(400).send("Há dados indefinidos na edição!");
    } else {
        historiaModel.editar(idHistoria, idUsuario, musica.trim(), artista.trim(), idSpotify, relato.trim(), idSentimento)
            .then(function (resultado) {
                if (resultado.affectedRows == 0) {
                    res.status(403).send("Você só pode editar as suas próprias histórias.");
                } else {
                    res.json(resultado);
                }
            })
            .catch(function (erro) {
                responderErro(res, erro, "Houve um erro ao editar a história.");
            });
    }
}

function deletar(req, res) {
    historiaModel.deletar(req.params.idHistoria, req.params.idUsuario)
        .then(function (resultado) {
            if (resultado.affectedRows == 0) {
                res.status(403).send("Você só pode apagar as suas próprias histórias.");
            } else {
                res.json(resultado);
            }
        })
        .catch(function (erro) {
            responderErro(res, erro, "Houve um erro ao apagar a história.");
        });
}

module.exports = {
    listar,
    listarPorUsuario,
    publicar,
    editar,
    deletar
};
