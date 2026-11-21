var dashboardModel = require("../models/dashboardModel");

function responderErro(res, erro) {
    console.log("\nHouve um erro ao buscar os dados da dashboard! Erro: ", erro.sqlMessage || erro);
    if (erro.code == "ER_NO_SUCH_TABLE") {
        res.status(500).send("As tabelas do questionário ainda não existem no banco. Rode o arquivo src/database/script-questionario.sql no MySQL Workbench e tente de novo.");
        return;
    }
    res.status(500).send("Houve um erro ao buscar os dados da dashboard.");
}


function sentimentosMaisPublicados(req, res) {
    dashboardModel.sentimentosMaisPublicados()
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) { responderErro(res, erro); });
}

function artistasMaisLembrados(req, res) {
    dashboardModel.artistasMaisLembrados()
        .then(function (resultado) { res.json(resultado); })
        .catch(function (erro) { responderErro(res, erro); });
}

// GET /dashboard/comunidade
function comunidade(req, res) {
    Promise.all([
        dashboardModel.humorDaComunidade(),
        dashboardModel.pontosPorPessoa(),
        dashboardModel.artistasCitados(),
        dashboardModel.musicasCitadas()
    ])
        .then(function (r) {
            // quantas pessoas têm cada sentimento como principal
            var principais = dashboardModel.principalPorPessoa(r[1]);
            var contagem = {};

            for (var idUsuario in principais) {
                var nome = principais[idUsuario];
                contagem[nome] = (contagem[nome] || 0) + 1;
            }

            var sentimentos = [];
            for (var nome in contagem) {
                sentimentos.push({ sentimento: nome, total: contagem[nome] });
            }
            sentimentos.sort(function (a, b) {
                return b.total - a.total || a.sentimento.localeCompare(b.sentimento);
            });

            res.json({
                pessoas: Number(r[0].pessoas),
                humorMedio: r[0].media == null ? null : Number(r[0].media),
                sentimentos: sentimentos,
                artistas: r[2],
                musicas: r[3]
            });
        })
        .catch(function (erro) { responderErro(res, erro); });
}

// GET /dashboard/pessoal/:idUsuario
function pessoal(req, res) {
    var idUsuario = req.params.idUsuario;

    if (!/^[0-9]+$/.test(idUsuario)) {
        res.status(400).send("O id do usuário é inválido!");
        return;
    }

    dashboardModel.ultimaTentativa(idUsuario)
        .then(function (tentativa) {
            // quem nunca respondeu o questionário ainda não tem dashboard
            if (tentativa == null) {
                res.json({ respondeu: false });
                return;
            }

            return Promise.all([
                dashboardModel.sentimentosDaTentativa(tentativa.id),
                dashboardModel.pontosPorPessoa(),
                dashboardModel.humorDaComunidade()
            ]).then(function (r) {
                var sentimentos = r[0];
                var principais = dashboardModel.principalPorPessoa(r[1]);
                var meu = sentimentos[0].sentimento;

                // quantas OUTRAS pessoas têm o mesmo sentimento principal
                var pessoasIgual = 0;
                for (var id in principais) {
                    if (id != idUsuario && principais[id] == meu) {
                        pessoasIgual++;
                    }
                }

                res.json({
                    respondeu: true,
                    tentativa: tentativa,
                    sentimentos: sentimentos,
                    pessoasIgual: pessoasIgual,
                    pessoas: Number(r[2].pessoas),
                    humorMedio: r[2].media == null ? null : Number(r[2].media)
                });
            });
        })
        .catch(function (erro) { responderErro(res, erro); });
}

module.exports = {
    sentimentosMaisPublicados,
    artistasMaisLembrados,
    comunidade,
    pessoal
};
