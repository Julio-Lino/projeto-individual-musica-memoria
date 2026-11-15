var express = require("express");
var router = express.Router();

var spotifyController = require("../controllers/spotifyController");

// busca músicas no Spotify (tela de publicar)
router.get("/buscar", function (req, res) {
    spotifyController.buscar(req, res);
});

// capa, artista e foto do artista a partir dos ids (Home)
router.get("/musicas", function (req, res) {
    spotifyController.musicas(req, res);
});

module.exports = router;
