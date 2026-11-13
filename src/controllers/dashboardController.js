var dashboardModel = require("../models/dashboardModel");

// cada rota do dashboard só chama uma função do model e devolve o JSON
function responder(funcaoDoModel) {
    return function (req, res) {
        funcaoDoModel()
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log("\nHouve um erro ao buscar os dados da dashboard! Erro: ", erro.sqlMessage || erro);
                res.status(500).send("Houve um erro ao buscar os dados da dashboard.");
            });
    };
}

module.exports = {
    sentimentosMaisPublicados: responder(dashboardModel.sentimentosMaisPublicados),
    artistasMaisLembrados: responder(dashboardModel.artistasMaisLembrados),
    musicasMaisLembradas: responder(dashboardModel.musicasMaisLembradas),
    historiasPorMes: responder(dashboardModel.historiasPorMes),
    historiasMaisCurtidas: responder(dashboardModel.historiasMaisCurtidas),
    historiasMaisComentadas: responder(dashboardModel.historiasMaisComentadas)
};
