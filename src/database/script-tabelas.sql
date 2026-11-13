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

-- comentários nas histórias (o que faz do site um fórum)
CREATE TABLE comentario (
	id INT PRIMARY KEY AUTO_INCREMENT,
	texto VARCHAR(500) NOT NULL,
	dtComentario DATETIME DEFAULT CURRENT_TIMESTAMP,
	fk_historia INT NOT NULL,
	fk_usuario INT NOT NULL,
	FOREIGN KEY (fk_historia) REFERENCES historia(id) ON DELETE CASCADE,
	FOREIGN KEY (fk_usuario) REFERENCES usuario(id) ON DELETE CASCADE
);

-- curtidas: cada usuário curte cada história uma única vez (chave composta)
CREATE TABLE curtida (
	fk_usuario INT NOT NULL,
	fk_historia INT NOT NULL,
	dtCurtida DATETIME DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (fk_usuario, fk_historia),
	FOREIGN KEY (fk_usuario) REFERENCES usuario(id) ON DELETE CASCADE,
	FOREIGN KEY (fk_historia) REFERENCES historia(id) ON DELETE CASCADE
);

INSERT INTO sentimento (nome) VALUES
	('Saudade'), ('Alegria'), ('Amor'), ('Esperança'),
	('Nostalgia'), ('Conforto'), ('Tristeza'), ('Energia');
