-- Criar tabelas iniciais do sistema
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    color VARCHAR(16) NOT NULL,
    part_number INT UNSIGNED NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);