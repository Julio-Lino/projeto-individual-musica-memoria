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
