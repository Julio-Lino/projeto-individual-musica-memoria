var database = require("../database/config");

function listar(idHistoria) {
    var instrucaoSql = `
        SELECT co.id, co.texto, co.dtComentario, u.id AS idUsuario, u.nome AS autor
        FROM comentario co
        JOIN usuario u ON u.id = co.fk_usuario
        WHERE co.fk_historia = ?
        ORDER BY co.id;
    `;
    return database.executar(instrucaoSql, [idHistoria]);
}

function publicar(idHistoria, idUsuario, texto) {
    var instrucaoSql = `
        INSERT INTO comentario (texto, fk_historia, fk_usuario) VALUES (?, ?, ?);
    `;
    return database.executar(instrucaoSql, [texto, idHistoria, idUsuario]);
}

function deletar(idComentario, idUsuario) {
    var instrucaoSql = `
        DELETE FROM comentario WHERE id = ? AND fk_usuario = ?;
    `;
    return database.executar(instrucaoSql, [idComentario, idUsuario]);
}

module.exports = {
    listar,
    publicar,
    deletar
};
