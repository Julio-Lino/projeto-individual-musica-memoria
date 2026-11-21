var database = require("../database/config");

// ---------- usados pela HOME (vêm das histórias do fórum) ----------

// todos os sentimentos aparecem, mesmo os que ainda têm 0 histórias
function sentimentosMaisPublicados() {
    var instrucaoSql = `
        SELECT s.nome AS sentimento, COUNT(h.id) AS total
        FROM sentimento s
        LEFT JOIN historia h ON h.fk_sentimento = s.id
        GROUP BY s.id, s.nome
        ORDER BY total DESC, s.nome;
    `;
    return database.executar(instrucaoSql);
}

function artistasMaisLembrados() {
    var instrucaoSql = `
        SELECT m.artista, COUNT(h.id) AS total, MAX(m.idSpotify) AS idSpotify
        FROM historia h
        JOIN musica m ON m.id = h.fk_musica
        GROUP BY m.artista
        ORDER BY total DESC, m.artista
        LIMIT 5;
    `;
    return database.executar(instrucaoSql);
}

// ---------- DASHBOARD (vêm do questionário) ----------
// Em tudo abaixo conta só a ÚLTIMA tentativa de cada pessoa.

var ultimasTentativas = "(SELECT MAX(id) FROM tentativa GROUP BY fk_usuario)";

// a última tentativa de uma pessoa (ou null se nunca respondeu)
function ultimaTentativa(idUsuario) {
    var instrucaoSql = `
        SELECT id, humor, artista, musica, dtResposta
        FROM tentativa WHERE fk_usuario = ? ORDER BY id DESC LIMIT 1;
    `;
    return database.executar(instrucaoSql, [idUsuario]).then(function (linhas) {
        return linhas.length > 0 ? linhas[0] : null;
    });
}

// pontos de cada sentimento em uma tentativa
// (empate: vence o sentimento que apareceu primeiro nas perguntas)
function sentimentosDaTentativa(idTentativa) {
    var instrucaoSql = `
        SELECT s.nome AS sentimento, COUNT(*) AS total
        FROM resposta r
        JOIN alternativa a ON a.id = r.fk_alternativa
        JOIN pergunta p ON p.id = a.fk_pergunta
        JOIN sentimento s ON s.id = a.fk_sentimento
        WHERE r.fk_tentativa = ?
        GROUP BY s.id, s.nome
        ORDER BY total DESC, MIN(p.numero), s.nome;
    `;
    return database.executar(instrucaoSql, [idTentativa]);
}

// pontos por sentimento de TODAS as pessoas (última tentativa de cada uma)
function pontosPorPessoa() {
    var instrucaoSql = `
        SELECT t.fk_usuario AS idUsuario, s.nome AS sentimento,
               COUNT(*) AS total, MIN(p.numero) AS primeira
        FROM tentativa t
        JOIN resposta r ON r.fk_tentativa = t.id
        JOIN alternativa a ON a.id = r.fk_alternativa
        JOIN pergunta p ON p.id = a.fk_pergunta
        JOIN sentimento s ON s.id = a.fk_sentimento
        WHERE t.id IN ${ultimasTentativas}
        GROUP BY t.fk_usuario, s.id, s.nome;
    `;
    return database.executar(instrucaoSql);
}

function humorDaComunidade() {
    var instrucaoSql = `
        SELECT COUNT(*) AS pessoas, ROUND(AVG(humor), 1) AS media
        FROM tentativa WHERE id IN ${ultimasTentativas};
    `;
    return database.executar(instrucaoSql).then(function (linhas) {
        return linhas[0];
    });
}

function artistasCitados() {
    var instrucaoSql = `
        SELECT artista, COUNT(*) AS total
        FROM tentativa WHERE id IN ${ultimasTentativas}
        GROUP BY artista
        ORDER BY total DESC, artista
        LIMIT 5;
    `;
    return database.executar(instrucaoSql);
}

function musicasCitadas() {
    var instrucaoSql = `
        SELECT musica, COUNT(*) AS total
        FROM tentativa WHERE id IN ${ultimasTentativas}
        GROUP BY musica
        ORDER BY total DESC, musica
        LIMIT 5;
    `;
    return database.executar(instrucaoSql);
}

// descobre o sentimento principal de cada pessoa: { idUsuario: "Nostalgia", ... }
// (mais pontos; empate: o que apareceu primeiro nas perguntas)
function principalPorPessoa(linhas) {
    var melhores = {};

    for (var i = 0; i < linhas.length; i++) {
        var linha = linhas[i];
        var atual = melhores[linha.idUsuario];
        var total = Number(linha.total);
        var primeira = Number(linha.primeira);

        if (atual == undefined || total > atual.total || (total == atual.total && primeira < atual.primeira)) {
            melhores[linha.idUsuario] = { sentimento: linha.sentimento, total: total, primeira: primeira };
        }
    }

    var principais = {};
    for (var idUsuario in melhores) {
        principais[idUsuario] = melhores[idUsuario].sentimento;
    }
    return principais;
}

module.exports = {
    sentimentosMaisPublicados,
    artistasMaisLembrados,
    ultimaTentativa,
    sentimentosDaTentativa,
    pontosPorPessoa,
    humorDaComunidade,
    artistasCitados,
    musicasCitadas,
    principalPorPessoa
};
