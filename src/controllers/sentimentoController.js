var sentimentoModel = require("../models/sentimentoModel");

function listar(req, res) {
    sentimentoModel.listar()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log("\nHouve um erro ao buscar os sentimentos! Erro: ", erro.sqlMessage || erro);
            res.status(500).send("Houve um erro ao buscar os sentimentos.");
        });
}

module.exports = {
    listar
};
