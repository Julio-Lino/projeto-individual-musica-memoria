var database = require("../database/config");

// Devolve o id da música: se ela já existe (mesmo nome + artista, ou mesmo idSpotify)
// reaproveita; se não existe, cria. Assim "Evidências" nunca vira duas músicas.
function buscarOuCriar(nome, artista, idSpotify) {
    var instrucaoSql = `
        INSERT INTO musica (nome, artista, idSpotify) VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id);
    `;
    var spotify = (idSpotify == undefined || idSpotify == "") ? null : idSpotify;

    return database.executar(instrucaoSql, [nome, artista, spotify])
        .then(function (resultado) {
            return resultado.insertId;
        });
}

module.exports = {
    buscarOuCriar
};
