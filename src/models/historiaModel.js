var database = require("../database/config");
var musicaModel = require("./musicaModel");

var selectBase = `
    SELECT h.id, h.relato, h.dtPublicacao,
           m.id AS idMusica, m.nome AS musica, m.artista, m.idSpotify,
           s.id AS idSentimento, s.nome AS sentimento,
           u.id AS idUsuario, u.nome AS autor,
           (SELECT COUNT(*) FROM curtida c WHERE c.fk_historia = h.id) AS curtidas,
           (SELECT COUNT(*) FROM comentario co WHERE co.fk_historia = h.id) AS comentarios
    FROM historia h
    JOIN musica m ON m.id = h.fk_musica
    JOIN sentimento s ON s.id = h.fk_sentimento
    JOIN usuario u ON u.id = h.fk_usuario
`;

function listar() {
    return database.executar(selectBase + " ORDER BY h.id DESC;");
}

function listarPorUsuario(idUsuario) {
    return database.executar(selectBase + " WHERE u.id = ? ORDER BY h.id DESC;", [idUsuario]);
}

function publicar(musica, artista, idSpotify, relato, idSentimento, idUsuario) {
    return musicaModel.buscarOuCriar(musica, artista, idSpotify)
        .then(function (idMusica) {
            var instrucaoSql = `
                INSERT INTO historia (relato, fk_usuario, fk_musica, fk_sentimento) VALUES (?, ?, ?, ?);
            `;
            return database.executar(instrucaoSql, [relato, idUsuario, idMusica, idSentimento]);
        });
}

function editar(idHistoria, idUsuario, musica, artista, idSpotify, relato, idSentimento) {
    return musicaModel.buscarOuCriar(musica, artista, idSpotify)
        .then(function (idMusica) {
            var instrucaoSql = `
                UPDATE historia SET relato = ?, fk_musica = ?, fk_sentimento = ?
                WHERE id = ? AND fk_usuario = ?;
            `;
            return database.executar(instrucaoSql, [relato, idMusica, idSentimento, idHistoria, idUsuario]);
        });
}

function deletar(idHistoria, idUsuario) {
    var instrucaoSql = `
        DELETE FROM historia WHERE id = ? AND fk_usuario = ?;
    `;
    return database.executar(instrucaoSql, [idHistoria, idUsuario]);
}

module.exports = {
    listar,
    listarPorUsuario,
    publicar,
    editar,
    deletar
};
