const { getConnection } = require('./config');
const fs = require('fs').promises;
const path = require('path');

async function createMigrationsTable(connection) {
    await connection.query(`
        CREATE TABLE IF NOT EXISTS migrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

async function getMigratedFiles(connection) {
    const [rows] = await connection.query('SELECT name FROM migrations');
    return rows.map(row => row.name);
}

async function markAsMigrated(connection, filename) {
    await connection.query('INSERT INTO migrations (name) VALUES (?)', [filename]);
}

async function runMigration() {
    const connection = await getConnection();
    
    try {
        // Criar tabela de controle de migrações se não existir
        await createMigrationsTable(connection);
        
        // Pegar migrações já executadas
        const executedMigrations = await getMigratedFiles(connection);
        
        // Ler arquivos de migração do diretório sql
        const sqlFiles = await fs.readdir(path.join(__dirname, 'sql'));
        const pendingMigrations = sqlFiles.filter(file => !executedMigrations.includes(file));
        
        // Executar migrações pendentes em ordem
        for (const file of pendingMigrations) {
            console.log(`Executando migração: ${file}`);
            const sql = await fs.readFile(path.join(__dirname, 'sql', file), 'utf8');
            
            await connection.query(sql);
            await markAsMigrated(connection, file);
            
            console.log(`Migração ${file} executada com sucesso!`);
        }
        
        if (pendingMigrations.length === 0) {
            console.log('Nenhuma migração pendente.');
        } else {
            console.log(`${pendingMigrations.length} migrações executadas com sucesso!`);
        }
    } catch (err) {
        console.error('Erro ao executar migrações:', err);
        process.exit(1);
    } finally {
        await connection.end();
    }
}

runMigration().catch(console.error);