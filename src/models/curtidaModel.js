var database = require("../database/config");

// INSERT IGNORE: se a pessoa já curtiu, não dá erro nem duplica
function curtir(idHistoria, idUsuario) {
    var instrucaoSql = `
        INSERT IGNORE INTO curtida (fk_usuario, fk_historia) VALUES (?, ?);
    `;
    return database.executar(instrucaoSql, [idUsuario, idHistoria]);
}

function descurtir(idHistoria, idUsuario) {
    var instrucaoSql = `
        DELETE FROM curtida WHERE fk_usuario = ? AND fk_historia = ?;
    `;
    return database.executar(instrucaoSql, [idUsuario, idHistoria]);
}

// ids das histórias que o usuário já curtiu (para pintar o coração no front)
function listarDoUsuario(idUsuario) {
    var instrucaoSql = `
        SELECT fk_historia AS idHistoria FROM curtida WHERE fk_usuario = ?;
    `;
    return database.executar(instrucaoSql, [idUsuario]);
}

module.exports = {
    curtir,
    descurtir,
    listarDoUsuario
};
