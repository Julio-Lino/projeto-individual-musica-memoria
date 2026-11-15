// Conversa com a API do Spotify. Só o servidor fala com o Spotify:
// a chave secreta (SPOTIFY_CLIENT_SECRET) nunca vai para o navegador.
// Usa o fluxo "Client Credentials": não precisa de login do usuário,
// serve para buscar músicas, capas e fotos de artistas.
// Precisa de Node 18 ou mais novo (usa o fetch que já vem no Node).

var URL_TOKEN = "https://accounts.spotify.com/api/token";
var URL_API = "https://api.spotify.com/v1";

var token = null;
var tokenExpiraEm = 0;

// guarda o que já foi buscado, para não chamar o Spotify toda vez que a Home abre
var cacheMusicas = {};
var cacheArtistas = {};

function obterToken() {
    if (token != null && Date.now() < tokenExpiraEm) {
        return Promise.resolve(token);
    }

    var clientId = process.env.SPOTIFY_CLIENT_ID;
    var clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        return Promise.reject(new Error("SPOTIFY_NAO_CONFIGURADO"));
    }

    var credenciais = Buffer.from(clientId + ":" + clientSecret).toString("base64");

    return fetch(URL_TOKEN, {
        method: "POST",
        headers: {
            "Authorization": "Basic " + credenciais,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials"
    })
        .then(function (resposta) {
            if (!resposta.ok) {
                throw new Error("SPOTIFY_CHAVES_INVALIDAS");
            }
            return resposta.json();
        })
        .then(function (json) {
            token = json.access_token;
            // renova 1 minuto antes de vencer
            tokenExpiraEm = Date.now() + (json.expires_in - 60) * 1000;
            return token;
        });
}

function chamar(caminho) {
    return obterToken()
        .then(function (tokenAtual) {
            return fetch(URL_API + caminho, {
                headers: { "Authorization": "Bearer " + tokenAtual }
            });
        })
        .then(function (resposta) {
            if (!resposta.ok) {
                throw new Error("SPOTIFY_ERRO_" + resposta.status);
            }
            return resposta.json();
        });
}

// o Spotify devolve várias capas (grande, média, pequena); pegamos a média
function escolherCapa(track) {
    var imagens = (track.album && track.album.images) ? track.album.images : [];
    if (imagens.length == 0) {
        return null;
    }
    var imagem = imagens[1] || imagens[0];
    return imagem.url;
}

function formatarMusica(track) {
    var artista = (track.artists && track.artists.length > 0) ? track.artists[0] : {};

    return {
        idSpotify: track.id,
        musica: track.name,
        artista: artista.name || "Artista desconhecido",
        idArtista: artista.id || null,
        capa: escolherCapa(track),
        fotoArtista: null
    };
}

// BUSCA (tela de publicar): devolve até 8 músicas com capa
function buscar(texto) {
    var caminho = "/search?type=track&limit=8&q=" + encodeURIComponent(texto);

    return chamar(caminho).then(function (json) {
        var itens = (json.tracks && json.tracks.items) ? json.tracks.items : [];
        var lista = [];

        for (var i = 0; i < itens.length; i++) {
            if (itens[i] && itens[i].id) {
                lista.push(formatarMusica(itens[i]));
            }
        }
        return lista;
    });
}

function buscarFotoArtista(idArtista) {
    if (!idArtista) {
        return Promise.resolve(null);
    }
    if (cacheArtistas[idArtista] !== undefined) {
        return Promise.resolve(cacheArtistas[idArtista]);
    }

    return chamar("/artists/" + idArtista)
        .then(function (artista) {
            var imagens = artista.images || [];
            var foto = imagens.length > 0 ? (imagens[1] || imagens[0]).url : null;
            cacheArtistas[idArtista] = foto;
            return foto;
        })
        .catch(function () {
            // se o Spotify não devolver a foto, o site usa a capa da música
            return null;
        });
}

function buscarUma(idSpotify) {
    if (cacheMusicas[idSpotify]) {
        return Promise.resolve(cacheMusicas[idSpotify]);
    }

    return chamar("/tracks/" + idSpotify)
        .then(function (track) {
            var musica = formatarMusica(track);
            return buscarFotoArtista(musica.idArtista).then(function (foto) {
                musica.fotoArtista = foto;
                cacheMusicas[idSpotify] = musica;
                return musica;
            });
        })
        .catch(function (erro) {
            // chaves erradas/ausentes precisam chegar ao controller
            if (erro.message == "SPOTIFY_NAO_CONFIGURADO" || erro.message == "SPOTIFY_CHAVES_INVALIDAS") {
                throw erro;
            }
            // uma música que falhou não derruba as outras
            return null;
        });
}

// INFO DE VÁRIAS MÚSICAS (Home): capa, nome, artista e foto do artista
function buscarVarias(ids) {
    var promessas = [];

    for (var i = 0; i < ids.length; i++) {
        promessas.push(buscarUma(ids[i]));
    }

    return Promise.all(promessas).then(function (resultados) {
        var lista = [];
        for (var i = 0; i < resultados.length; i++) {
            if (resultados[i] != null) {
                lista.push(resultados[i]);
            }
        }
        return lista;
    });
}

module.exports = {
    buscar,
    buscarVarias
};
