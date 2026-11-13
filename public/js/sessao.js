// sessão do usuário logado (TrilhaSonora)

// use nas páginas que só podem ser vistas por quem está logado
function validarSessao() {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;

    var b_usuario = document.getElementById("b_usuario");

    if (email != null && nome != null) {
        if (b_usuario != null) {
            b_usuario.innerHTML = nome;
        }
    } else {
        window.location = "/login.html";
    }
}

function limparSessao() {
    sessionStorage.clear();
    window.location = "/login.html";
}
