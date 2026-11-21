// Funções usadas em mais de uma página (index.html e publicar.html)

// troca < > & " ' por códigos, para que um texto digitado por alguém
// nunca vire HTML/JavaScript quando for colocado na tela
function escapar(texto) {
    if (texto == null) {
        return '';
    }
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// transforma a data do banco em "há 5 min", "há 3 h", "há 2 d"
function tempoAtras(dataTexto) {
    let minutos = Math.floor((Date.now() - new Date(dataTexto).getTime()) / 60000);

    if (isNaN(minutos) || minutos < 1) {
        return 'agora há pouco';
    }
    if (minutos < 60) {
        return 'há ' + minutos + ' min';
    }
    if (minutos < 1440) {
        return 'há ' + Math.floor(minutos / 60) + ' h';
    }
    return 'há ' + Math.floor(minutos / 1440) + ' d';
}

// player embutido do Spotify (não precisa de chave nem de login para aparecer)
function playerSpotify(idSpotify, altura) {
    return `<iframe src="https://open.spotify.com/embed/track/${escapar(idSpotify)}?utm_source=generator&theme=0"
        width="100%" height="${altura}" frameborder="0" loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        style="border-radius: 12px; border: 0"></iframe>`;
}

// ---------- capas e fotos que vêm do Spotify (via nosso servidor) ----------

let infoMusicas = {};   // idSpotify -> { capa, fotoArtista, musica, artista }

// pergunta ao nosso servidor a capa/foto de cada música (o servidor pergunta ao Spotify)
function buscarInfoSpotify(ids) {
    let novos = [];
    for (let i = 0; i < ids.length; i++) {
        if (infoMusicas[ids[i]] == undefined && novos.indexOf(ids[i]) == -1) {
            novos.push(ids[i]);
        }
    }

    if (novos.length == 0) {
        return Promise.resolve();
    }

    return fetch('/spotify/musicas?ids=' + novos.slice(0, 20).join(','))
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            }
            return [];
        })
        .then(function (lista) {
            for (let i = 0; i < lista.length; i++) {
                infoMusicas[lista[i].idSpotify] = lista[i];
            }
        })
        .catch(function () {
            // sem Spotify o site continua funcionando, só sem as capas
        });
}

// pega os idSpotify de uma lista (ignora vazios e repetidos)
function idsSpotifyDe(lista) {
    let ids = [];
    for (let i = 0; i < lista.length; i++) {
        if (lista[i] && lista[i].idSpotify && ids.indexOf(lista[i].idSpotify) == -1) {
            ids.push(lista[i].idSpotify);
        }
    }
    return ids;
}

// ---------- MENU DO TOPO (muda se a pessoa está logada ou não) ----------

function estaLogado() {
    return sessionStorage.EMAIL_USUARIO != undefined && sessionStorage.NOME_USUARIO != undefined;
}

// sai da conta e volta para a Home
function sair() {
    sessionStorage.clear();
    window.location = 'index.html';
}

// Sem login: só Comunidade e Entrar.
// Com login: Comunidade, Publicar, Questionário, Dashboard, Perfil e Sair.
function montarMenu() {
    let html = '<a href="comunidade.html">Comunidade</a>';

    if (estaLogado()) {
        html += `
            <a href="publicar.html">Publicar</a>
            <a href="questionario.html">Questionário</a>
            <a href="dashboard.html">Dashboard</a>
            <a href="perfil.html">Perfil</a>
            <a href="#" class="btn-out" onclick="sair(); return false">Sair</a>`;
    } else {
        html += '<a href="login.html" class="btn-out">Entrar</a>';
    }

    document.getElementById('menu').innerHTML = html;
}
