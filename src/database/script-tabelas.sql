CREATE DATABASE trilhasonora;

USE trilhasonora;

CREATE TABLE IF NOT EXISTS usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	senha VARCHAR(255) NOT NULL,
	dtCadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- os 8 sentimentos do fórum
CREATE TABLE IF NOT EXISTS sentimento (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(30) NOT NULL UNIQUE
);

-- uma música existe uma vez só; várias histórias podem apontar para ela
-- idSpotify é opcional (só preenchido quando a música vem da API do Spotify)
CREATE TABLE IF NOT EXISTS musica (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(100) NOT NULL,
	artista VARCHAR(100) NOT NULL,
	idSpotify VARCHAR(50) NULL UNIQUE,
	UNIQUE (nome, artista)
);

-- a história: a lembrança que uma música desperta em um usuário
CREATE TABLE historia (
	id INT PRIMARY KEY AUTO_INCREMENT,
	relato TEXT NOT NULL,
	dtPublicacao DATETIME DEFAULT CURRENT_TIMESTAMP,
	fk_usuario INT NOT NULL,
	fk_musica INT NOT NULL,
	fk_sentimento INT NOT NULL,
	FOREIGN KEY (fk_usuario) REFERENCES usuario(id) ON DELETE CASCADE,
	FOREIGN KEY (fk_musica) REFERENCES musica(id),
	FOREIGN KEY (fk_sentimento) REFERENCES sentimento(id)
);

INSERT INTO sentimento (nome) VALUES
	('Saudade'), ('Alegria'), ('Amor'), ('Esperança'),
	('Nostalgia'), ('Conforto'), ('Tristeza'), ('Energia');

-- ================= QUESTIONÁRIO (alimenta a dashboard) =================
-- Estas tabelas são recriadas sempre que o script roda (as perguntas voltam ao padrão
-- e as respostas dadas até agora são apagadas). Usuário e fórum NÃO são mexidos.

DROP TABLE IF EXISTS resposta;
DROP TABLE IF EXISTS tentativa;
DROP TABLE IF EXISTS alternativa;
DROP TABLE IF EXISTS pergunta;

-- as perguntas de múltipla escolha (a ordem vem de "numero")
CREATE TABLE pergunta (
	id INT PRIMARY KEY AUTO_INCREMENT,
	numero INT NOT NULL UNIQUE,
	texto VARCHAR(200) NOT NULL
);

-- cada alternativa soma um ponto para um sentimento (não existe certo ou errado)
CREATE TABLE alternativa (
	id INT PRIMARY KEY AUTO_INCREMENT,
	texto VARCHAR(150) NOT NULL,
	fk_pergunta INT NOT NULL,
	fk_sentimento INT NOT NULL,
	FOREIGN KEY (fk_pergunta) REFERENCES pergunta(id),
	FOREIGN KEY (fk_sentimento) REFERENCES sentimento(id)
);

-- cada vez que alguém responde o questionário nasce uma tentativa
-- (vale a última de cada pessoa); humor, artista e música não são de múltipla escolha
CREATE TABLE tentativa (
	id INT PRIMARY KEY AUTO_INCREMENT,
	fk_usuario INT NOT NULL,
	dtResposta DATETIME DEFAULT CURRENT_TIMESTAMP,
	humor TINYINT NOT NULL,
	artista VARCHAR(100) NOT NULL,
	musica VARCHAR(100) NOT NULL,
	CHECK (humor BETWEEN 1 AND 5),
	FOREIGN KEY (fk_usuario) REFERENCES usuario(id) ON DELETE CASCADE
);

-- a alternativa escolhida em cada pergunta
CREATE TABLE resposta (
	fk_tentativa INT NOT NULL,
	fk_alternativa INT NOT NULL,
	PRIMARY KEY (fk_tentativa, fk_alternativa),
	FOREIGN KEY (fk_tentativa) REFERENCES tentativa(id) ON DELETE CASCADE,
	FOREIGN KEY (fk_alternativa) REFERENCES alternativa(id)
);

INSERT INTO pergunta (numero, texto) VALUES
	(1, 'Quando uma música antiga toca, o que você sente primeiro?'),
	(2, 'Quando você mais ouve música?'),
	(3, 'Que músicas te acompanham nos dias difíceis?'),
	(4, 'A música que mais te marcou está ligada a...'),
	(5, 'O que você espera que uma música faça por você?'),
	(6, 'Qual frase combina mais com você?');

-- pergunta 1
INSERT INTO alternativa (texto, fk_pergunta, fk_sentimento) VALUES
	('Vontade de voltar no tempo', (SELECT id FROM pergunta WHERE numero = 1), (SELECT id FROM sentimento WHERE nome = 'Nostalgia')),
	('Falta de alguém', (SELECT id FROM pergunta WHERE numero = 1), (SELECT id FROM sentimento WHERE nome = 'Saudade')),
	('Alegria', (SELECT id FROM pergunta WHERE numero = 1), (SELECT id FROM sentimento WHERE nome = 'Alegria')),
	('Paz', (SELECT id FROM pergunta WHERE numero = 1), (SELECT id FROM sentimento WHERE nome = 'Conforto'));

-- pergunta 2
INSERT INTO alternativa (texto, fk_pergunta, fk_sentimento) VALUES
	('Quando estou apaixonado(a)', (SELECT id FROM pergunta WHERE numero = 2), (SELECT id FROM sentimento WHERE nome = 'Amor')),
	('Quando preciso me acalmar', (SELECT id FROM pergunta WHERE numero = 2), (SELECT id FROM sentimento WHERE nome = 'Conforto')),
	('Quando estou cheio(a) de energia', (SELECT id FROM pergunta WHERE numero = 2), (SELECT id FROM sentimento WHERE nome = 'Energia')),
	('Quando sinto falta de alguém', (SELECT id FROM pergunta WHERE numero = 2), (SELECT id FROM sentimento WHERE nome = 'Saudade'));

-- pergunta 3
INSERT INTO alternativa (texto, fk_pergunta, fk_sentimento) VALUES
	('As que me confortam', (SELECT id FROM pergunta WHERE numero = 3), (SELECT id FROM sentimento WHERE nome = 'Conforto')),
	('As que me fazem chorar', (SELECT id FROM pergunta WHERE numero = 3), (SELECT id FROM sentimento WHERE nome = 'Tristeza')),
	('As que me dão esperança', (SELECT id FROM pergunta WHERE numero = 3), (SELECT id FROM sentimento WHERE nome = 'Esperança')),
	('As que me dão força', (SELECT id FROM pergunta WHERE numero = 3), (SELECT id FROM sentimento WHERE nome = 'Energia'));

-- pergunta 4
INSERT INTO alternativa (texto, fk_pergunta, fk_sentimento) VALUES
	('Uma pessoa especial', (SELECT id FROM pergunta WHERE numero = 4), (SELECT id FROM sentimento WHERE nome = 'Amor')),
	('Uma fase da vida', (SELECT id FROM pergunta WHERE numero = 4), (SELECT id FROM sentimento WHERE nome = 'Nostalgia')),
	('Uma conquista', (SELECT id FROM pergunta WHERE numero = 4), (SELECT id FROM sentimento WHERE nome = 'Alegria')),
	('Alguém distante', (SELECT id FROM pergunta WHERE numero = 4), (SELECT id FROM sentimento WHERE nome = 'Saudade'));

-- pergunta 5
INSERT INTO alternativa (texto, fk_pergunta, fk_sentimento) VALUES
	('Me animar', (SELECT id FROM pergunta WHERE numero = 5), (SELECT id FROM sentimento WHERE nome = 'Alegria')),
	('Me acalmar', (SELECT id FROM pergunta WHERE numero = 5), (SELECT id FROM sentimento WHERE nome = 'Conforto')),
	('Me dar esperança', (SELECT id FROM pergunta WHERE numero = 5), (SELECT id FROM sentimento WHERE nome = 'Esperança')),
	('Me dar força', (SELECT id FROM pergunta WHERE numero = 5), (SELECT id FROM sentimento WHERE nome = 'Energia'));

-- pergunta 6
INSERT INTO alternativa (texto, fk_pergunta, fk_sentimento) VALUES
	('O passado me forma', (SELECT id FROM pergunta WHERE numero = 6), (SELECT id FROM sentimento WHERE nome = 'Nostalgia')),
	('O amor move tudo', (SELECT id FROM pergunta WHERE numero = 6), (SELECT id FROM sentimento WHERE nome = 'Amor')),
	('Amanhã vai ser melhor', (SELECT id FROM pergunta WHERE numero = 6), (SELECT id FROM sentimento WHERE nome = 'Esperança')),
	('Eu sinto tudo de verdade', (SELECT id FROM pergunta WHERE numero = 6), (SELECT id FROM sentimento WHERE nome = 'Tristeza'));

-- QUESTIONÁRIO

CREATE TABLE pergunta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero INT NOT NULL UNIQUE,
    texto VARCHAR(200) NOT NULL
);

CREATE TABLE alternativa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    texto VARCHAR(150) NOT NULL,
    fk_pergunta INT NOT NULL,
    fk_sentimento INT NOT NULL,
    FOREIGN KEY (fk_pergunta) REFERENCES pergunta(id),
    FOREIGN KEY (fk_sentimento) REFERENCES sentimento(id)
);

CREATE TABLE tentativa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NOT NULL,
    dtResposta DATETIME DEFAULT CURRENT_TIMESTAMP,
    humor TINYINT NOT NULL,
    artista VARCHAR(100) NOT NULL,
    musica VARCHAR(100) NOT NULL,
    CHECK (humor BETWEEN 1 AND 5),
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE resposta (
    fk_tentativa INT NOT NULL,
    fk_alternativa INT NOT NULL,
    PRIMARY KEY (fk_tentativa, fk_alternativa),
    FOREIGN KEY (fk_tentativa) REFERENCES tentativa(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_alternativa) REFERENCES alternativa(id)
);

INSERT INTO pergunta (numero, texto) VALUES
    (1, 'Quando uma música antiga toca, o que você sente primeiro?'),
    (2, 'Quando você mais ouve música?'),
    (3, 'Que músicas te acompanham nos dias difíceis?'),
    (4, 'A música que mais te marcou está ligada a...'),
    (5, 'O que você espera que uma música faça por você?'),
    (6, 'Qual frase combina mais com você?');


INSERT INTO alternativa (texto, fk_pergunta, fk_sentimento) VALUES
    ('Vontade de voltar no tempo', 
        (SELECT id FROM pergunta WHERE numero = 1), 
        (SELECT id FROM sentimento WHERE nome = 'Nostalgia')),

    ('Falta de alguém', 
        (SELECT id FROM pergunta WHERE numero = 1), 
        (SELECT id FROM sentimento WHERE nome = 'Saudade')),

    ('Alegria', 
        (SELECT id FROM pergunta WHERE numero = 1), 
        (SELECT id FROM sentimento WHERE nome = 'Alegria')),

    ('Paz', 
        (SELECT id FROM pergunta WHERE numero = 1), 
        (SELECT id FROM sentimento WHERE nome = 'Conforto'));


INSERT INTO alternativa (texto, fk_pergunta, fk_sentimento) VALUES
    ('Quando estou apaixonado(a)', 
        (SELECT id FROM pergunta WHERE numero = 2), 
        (SELECT id FROM sentimento WHERE nome = 'Amor')),

    ('Quando preciso me acalmar', 
        (SELECT id FROM pergunta WHERE numero = 2), 
        (SELECT id FROM sentimento WHERE nome = 'Conforto')),

    ('Quando estou cheio(a) de energia', 
        (SELECT id FROM pergunta WHERE numero = 2), 
        (SELECT id FROM sentimento WHERE nome = 'Energia')),

    ('Quando sinto falta de alguém', 
        (SELECT id FROM pergunta WHERE numero = 2), 
        (SELECT id FROM sentimento WHERE nome = 'Saudade'));


INSERT INTO alternativa (texto, fk_pergunta, fk_sentimento) VALUES
    ('As que me confortam', 
        (SELECT id FROM pergunta WHERE numero = 3), 
        (SELECT id FROM sentimento WHERE nome = 'Conforto')),

    ('As que me fazem chorar', 
        (SELECT id FROM pergunta WHERE numero = 3), 
        (SELECT id FROM sentimento WHERE nome = 'Tristeza')),

    ('As que me dão esperança', 
        (SELECT id FROM pergunta WHERE numero = 3), 
        (SELECT id FROM sentimento WHERE nome = 'Esperança')),

    ('As que me dão força', 
        (SELECT id FROM pergunta WHERE numero = 3), 
        (SELECT id FROM sentimento WHERE nome = 'Energia'));


INSERT INTO alternativa (texto, fk_pergunta, fk_sentimento) VALUES
    ('Uma pessoa especial', 
        (SELECT id FROM pergunta WHERE numero = 4), 
        (SELECT id FROM sentimento WHERE nome = 'Amor')),

    ('Uma fase da vida', 
        (SELECT id FROM pergunta WHERE numero = 4), 
        (SELECT id FROM sentimento WHERE nome = 'Nostalgia')),

    ('Uma conquista', 
        (SELECT id FROM pergunta WHERE numero = 4), 
        (SELECT id FROM sentimento WHERE nome = 'Alegria')),

    ('Alguém distante', 
        (SELECT id FROM pergunta WHERE numero = 4), 
        (SELECT id FROM sentimento WHERE nome = 'Saudade'));


INSERT INTO alternativa (texto, fk_pergunta, fk_sentimento) VALUES
    ('Me animar', 
        (SELECT id FROM pergunta WHERE numero = 5), 
        (SELECT id FROM sentimento WHERE nome = 'Alegria')),

    ('Me acalmar', 
        (SELECT id FROM pergunta WHERE numero = 5), 
        (SELECT id FROM sentimento WHERE nome = 'Conforto')),

    ('Me dar esperança', 
        (SELECT id FROM pergunta WHERE numero = 5), 
        (SELECT id FROM sentimento WHERE nome = 'Esperança')),

    ('Me dar força', 
        (SELECT id FROM pergunta WHERE numero = 5), 
        (SELECT id FROM sentimento WHERE nome = 'Energia'));


INSERT INTO alternativa (texto, fk_pergunta, fk_sentimento) VALUES
    ('O passado me forma', 
        (SELECT id FROM pergunta WHERE numero = 6), 
        (SELECT id FROM sentimento WHERE nome = 'Nostalgia')),

    ('O amor move tudo', 
        (SELECT id FROM pergunta WHERE numero = 6), 
        (SELECT id FROM sentimento WHERE nome = 'Amor')),

    ('Amanhã vai ser melhor', 
        (SELECT id FROM pergunta WHERE numero = 6), 
        (SELECT id FROM sentimento WHERE nome = 'Esperança')),

    ('Eu sinto tudo de verdade', 
        (SELECT id FROM pergunta WHERE numero = 6), 
        (SELECT id FROM sentimento WHERE nome = 'Tristeza'));