var questionarioModel = require("../models/questionarioModel");

function responderErro(res, erro, mensagem) {
    console.log("\n" + mensagem + " Erro: ", erro.sqlMessage || erro);
    if (erro.code == "ER_NO_SUCH_TABLE") {
        res.status(500).send("As tabelas do questionário ainda não existem no banco. Rode o arquivo src/database/script-questionario.sql no MySQL Workbench e tente de novo.");
        return;
    }
    res.status(500).send(mensagem);
}

// GET /questionario/perguntas
function perguntas(req, res) {
    questionarioModel.listarPerguntas()
        .then(function (lista) {
            res.json(lista);
        })
        .catch(function (erro) {
            responderErro(res, erro, "Houve um erro ao buscar as perguntas.");
        });
}

// POST /questionario/responder/:idUsuario
// body: respostasServer (ids das alternativas, uma por pergunta), humorServer (1 a 5),
//       artistaServer, musicaServer
function responder(req, res) {
    var idUsuario = req.params.idUsuario;
    var ids = req.body.respostasServer;
    var humor = Number(req.body.humorServer);
    var artista = req.body.artistaServer;
    var musica = req.body.musicaServer;

    if (!/^[0-9]+$/.test(idUsuario)) {
        res.status(403).send("O id do usuário está indefinido!");
        return;
    }
    if (!Array.isArray(ids) || ids.length == 0) {
        res.status(400).send("As respostas estão indefinidas!");
        return;
    }

    ids = ids.map(Number);
    for (var i = 0; i < ids.length; i++) {
        if (!Number.isInteger(ids[i]) || ids[i] <= 0 || ids.indexOf(ids[i]) != i) {
            res.status(400).send("As respostas são inválidas!");
            return;
        }
    }

    if (!Number.isInteger(humor) || humor < 1 || humor > 5) {
        res.status(400).send("O humor precisa ser um número de 1 a 5!");
        return;
    }
    if (artista == undefined || String(artista).trim() == "" || String(artista).trim().length > 100) {
        res.status(400).send("Escreva o artista (até 100 letras)!");
        return;
    }
    if (musica == undefined || String(musica).trim() == "" || String(musica).trim().length > 100) {
        res.status(400).send("Escreva a música (até 100 letras)!");
        return;
    }

    artista = String(artista).trim();
    musica = String(musica).trim();

    // confere se todas as perguntas foram respondidas, uma alternativa em cada
    Promise.all([
        questionarioModel.contarPerguntas(),
        questionarioModel.conferirAlternativas(ids)
    ])
        .then(function (resultados) {
            var totalPerguntas = resultados[0];
            var conferencia = resultados[1];

            if (ids.length != totalPerguntas || conferencia.encontradas != ids.length || conferencia.perguntas != totalPerguntas) {
                res.status(400).send("Responda todas as perguntas, uma alternativa em cada.");
                return;
            }

            return questionarioModel.criarTentativa(idUsuario, humor, artista, musica)
                .then(function (idTentativa) {
                    return questionarioModel.registrarRespostas(idTentativa, ids)
                        .then(function () {
                            res.json({ idTentativa: idTentativa });
                        })
                        .catch(function (erro) {
                            return questionarioModel.apagarTentativa(idTentativa).then(function () {
                                throw erro;
                            });
                        });
                });
        })
        .catch(function (erro) {
            if (erro.code == "ER_NO_REFERENCED_ROW_2") {
                res.status(404).send("Usuário não encontrado. Entre de novo.");
            } else {
                responderErro(res, erro, "Houve um erro ao salvar o questionário.");
            }
        });
}

module.exports = {
    perguntas,
    responder
};
