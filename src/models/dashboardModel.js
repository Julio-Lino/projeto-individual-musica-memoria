var database = require("../database/config");

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
        SELECT m.artista, COUNT(h.id) AS total
        FROM historia h
        JOIN musica m ON m.id = h.fk_musica
        GROUP BY m.artista
        ORDER BY total DESC, m.artista
        LIMIT 5;
    `;
    return database.executar(instrucaoSql);
}

function musicasMaisLembradas() {
    var instrucaoSql = `
        SELECT m.nome AS musica, m.artista, COUNT(h.id) AS total
        FROM historia h
        JOIN musica m ON m.id = h.fk_musica
        GROUP BY m.id, m.nome, m.artista
        ORDER BY total DESC, m.nome
        LIMIT 5;
    `;
    return database.executar(instrucaoSql);
}

function historiasPorMes() {
    var instrucaoSql = `
        SELECT DATE_FORMAT(dtPublicacao, '%Y-%m') AS mes, COUNT(*) AS total
        FROM historia
        GROUP BY mes
        ORDER BY mes;
    `;
    return database.executar(instrucaoSql);
}

function historiasMaisCurtidas() {
    var instrucaoSql = `
        SELECT h.id, m.nome AS musica, m.artista, u.nome AS autor, COUNT(c.fk_usuario) AS total
        FROM historia h
        JOIN musica m ON m.id = h.fk_musica
        JOIN usuario u ON u.id = h.fk_usuario
        LEFT JOIN curtida c ON c.fk_historia = h.id
        GROUP BY h.id, m.nome, m.artista, u.nome
        ORDER BY total DESC, h.id DESC
        LIMIT 5;
    `;
    return database.executar(instrucaoSql);
}

function historiasMaisComentadas() {
    var instrucaoSql = `
        SELECT h.id, m.nome AS musica, m.artista, u.nome AS autor, COUNT(co.id) AS total
        FROM historia h
        JOIN musica m ON m.id = h.fk_musica
        JOIN usuario u ON u.id = h.fk_usuario
        LEFT JOIN comentario co ON co.fk_historia = h.id
        GROUP BY h.id, m.nome, m.artista, u.nome
        ORDER BY total DESC, h.id DESC
        LIMIT 5;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    sentimentosMaisPublicados,
    artistasMaisLembrados,
    musicasMaisLembradas,
    historiasPorMes,
    historiasMaisCurtidas,
    historiasMaisComentadas
};
