var spotifyService = require("../services/spotifyService");

function responderErro(res, erro) {
    console.log("\nErro ao falar com o Spotify: ", erro.message);

    if (erro.message == "SPOTIFY_NAO_CONFIGURADO") {
        res.status(503).send("O Spotify ainda não foi configurado no servidor (veja SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET no .env).");
    } else if (erro.message == "SPOTIFY_CHAVES_INVALIDAS") {
        res.status(503).send("As chaves do Spotify no .env não foram aceitas.");
    } else {
        res.status(502).send("Não foi possível falar com o Spotify agora. Tente de novo em instantes.");
    }
}

// GET /spotify/buscar?q=evidencias
function buscar(req, res) {
    var texto = req.query.q;

    if (texto == undefined || String(texto).trim().length < 2) {
        res.status(400).send("Digite pelo menos 2 letras para buscar.");
    } else {
        spotifyService.buscar(String(texto).trim())
            .then(function (lista) {
                res.json(lista);
            })
            .catch(function (erro) {
                responderErro(res, erro);
            });
    }
}

// GET /spotify/musicas?ids=ID1,ID2,ID3
function musicas(req, res) {
    var texto = req.query.ids;

    if (texto == undefined || texto == "") {
        res.json([]);
        return;
    }

    // só aceita ids no formato do Spotify (22 letras/números), sem repetir, no máximo 20
    var recebidos = String(texto).split(",");
    var ids = [];

    for (var i = 0; i < recebidos.length; i++) {
        var id = recebidos[i].trim();
        if (/^[A-Za-z0-9]{22}$/.test(id) && ids.indexOf(id) == -1) {
            ids.push(id);
        }
    }
    ids = ids.slice(0, 20);

    spotifyService.buscarVarias(ids)
        .then(function (lista) {
            res.json(lista);
        })
        .catch(function (erro) {
            responderErro(res, erro);
        });
}

module.exports = {
    buscar,
    musicas
};
