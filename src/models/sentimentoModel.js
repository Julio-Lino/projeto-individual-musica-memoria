var database = require("../database/config");

function listar() {
    return database.executar("SELECT id, nome FROM sentimento ORDER BY nome;");
}

module.exports = {
    listar
};
