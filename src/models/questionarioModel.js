var database = require("../database/config");

// devolve as perguntas já com as alternativas (sem mostrar o sentimento de cada uma)
function listarPerguntas() {
    var instrucaoSql = `
        SELECT p.id AS idPergunta, p.numero, p.texto,
               a.id AS idAlternativa, a.texto AS alternativa
        FROM pergunta p
        JOIN alternativa a ON a.fk_pergunta = p.id
        ORDER BY p.numero, a.id;
    `;

    return database.executar(instrucaoSql).then(function (linhas) {
        var perguntas = [];

        for (var i = 0; i < linhas.length; i++) {
            var ultima = perguntas[perguntas.length - 1];

            if (ultima == undefined || ultima.id != linhas[i].idPergunta) {
                ultima = {
                    id: linhas[i].idPergunta,
                    numero: linhas[i].numero,
                    texto: linhas[i].texto,
                    alternativas: []
                };
                perguntas.push(ultima);
            }

            ultima.alternativas.push({
                id: linhas[i].idAlternativa,
                texto: linhas[i].alternativa
            });
        }

        return perguntas;
    });
}

function contarPerguntas() {
    return database.executar("SELECT COUNT(*) AS total FROM pergunta;").then(function (linhas) {
        return Number(linhas[0].total);
    });
}

// quantas das alternativas existem e em quantas perguntas diferentes elas estão
function conferirAlternativas(ids) {
    var instrucaoSql = `
        SELECT COUNT(*) AS encontradas, COUNT(DISTINCT fk_pergunta) AS perguntas
        FROM alternativa WHERE id IN (?);
    `;
    return database.executar(instrucaoSql, [ids]).then(function (linhas) {
        return {
            encontradas: Number(linhas[0].encontradas),
            perguntas: Number(linhas[0].perguntas)
        };
    });
}

function criarTentativa(idUsuario, humor, artista, musica) {
    var instrucaoSql = `
        INSERT INTO tentativa (fk_usuario, humor, artista, musica) VALUES (?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [idUsuario, humor, artista, musica]).then(function (resultado) {
        return resultado.insertId;
    });
}

function registrarRespostas(idTentativa, idsAlternativas) {
    var linhas = [];
    for (var i = 0; i < idsAlternativas.length; i++) {
        linhas.push([idTentativa, idsAlternativas[i]]);
    }

    var instrucaoSql = "INSERT INTO resposta (fk_tentativa, fk_alternativa) VALUES ?;";
    return database.executar(instrucaoSql, [linhas]);
}

// se der erro ao salvar as respostas, a tentativa não pode ficar pela metade
function apagarTentativa(idTentativa) {
    return database.executar("DELETE FROM tentativa WHERE id = ?;", [idTentativa]);
}

module.exports = {
    listarPerguntas,
    contarPerguntas,
    conferirAlternativas,
    criarTentativa,
    registrarRespostas,
    apagarTentativa
};
