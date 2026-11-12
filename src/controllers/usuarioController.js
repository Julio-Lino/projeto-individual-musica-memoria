var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined || email == "") {
        res.status(400).send("Seu e-mail está indefinido!");
    } else if (senha == undefined || senha == "") {
        res.status(400).send("Sua senha está indefinida!");
    } else {
        usuarioModel.autenticar(email, senha)
            .then(function (resultado) {
                if (resultado.length == 1) {
                    // não devolvemos a senha para o front-end
                    res.json({
                        id: resultado[0].id,
                        nome: resultado[0].nome,
                        email: resultado[0].email
                    });
                } else if (resultado.length == 0) {
                    res.status(403).send("E-mail e/ou senha inválido(s)");
                } else {
                    res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                }
            })
            .catch(function (erro) {
                console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage || erro);
                res.status(500).send("Erro no servidor ao entrar. Tente novamente.");
            });
    }
}

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (nome == undefined || nome == "") {
        res.status(400).send("Seu nome está indefinido!");
    } else if (email == undefined || email == "") {
        res.status(400).send("Seu e-mail está indefinido!");
    } else if (senha == undefined || senha == "") {
        res.status(400).send("Sua senha está indefinida!");
    } else {
        usuarioModel.cadastrar(nome, email, senha)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log("\nHouve um erro ao realizar o cadastro! Erro: ", erro.sqlMessage || erro);
                if (erro.code == "ER_DUP_ENTRY") {
                    res.status(409).send("Este e-mail já está cadastrado.");
                } else {
                    res.status(500).send("Erro no servidor ao cadastrar. Tente novamente.");
                }
            });
    }
}

module.exports = {
    autenticar,
    cadastrar
};
