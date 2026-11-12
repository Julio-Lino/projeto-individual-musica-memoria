-- script-tabelas.sql
-- Comandos para MySQL Server (o script anterior estava em sintaxe PostgreSQL e não roda no MySQL).
-- Execute no MySQL Workbench e use o nome do banco no .env / .env.dev (DB_DATABASE).

CREATE DATABASE IF NOT EXISTS trilhasonora;

USE trilhasonora;

CREATE TABLE IF NOT EXISTS usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	senha VARCHAR(255) NOT NULL,
	dtCadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);
