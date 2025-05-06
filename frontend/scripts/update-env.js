const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Função para obter o output do Terraform
function getTerraformOutput() {
  try {
    const terraformDir = path.join(__dirname, '../../backend');
    const output = execSync('terraform output -json', { cwd: terraformDir });
    return JSON.parse(output.toString());
  } catch (error) {
    console.error('Erro ao ler output do Terraform:', error);
    process.exit(1);
  }
}

// Atualiza o ambiente de produção com a URL do backend
function updateEnvironment() {
  try {
    const tfOutput = getTerraformOutput();
    console.log('Terraform output:', JSON.stringify(tfOutput, null, 2));
    
    // Usando o nome correto do output (backend_public_ip)
    const backendIp = tfOutput.backend_public_ip?.value;
    
    if (!backendIp) {
      throw new Error('Backend IP não encontrado no output do Terraform');
    }

    const backendUrl = `http://${backendIp}:3000/api`;
    const envFile = path.join(__dirname, '../src/environments/environment.ts');
    const envContent = `export const environment = {
  production: true,
  apiUrl: '${backendUrl}'
}; 
`;

    fs.writeFileSync(envFile, envContent);
    console.log(`Ambiente atualizado com backend URL: ${backendUrl}`);
  } catch (error) {
    console.error('Erro ao atualizar o ambiente:', error);
    process.exit(1);
  }
}

updateEnvironment();