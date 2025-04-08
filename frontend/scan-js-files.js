import fs from 'fs';
import path from 'path';

const outputFile = 'all_js_files.txt';
const output = [];

// Lista de pastas e arquivos a serem ignorados
const ignoreDirs = ['node_modules', '.git'];
const ignoreFiles = [
    'README.md',
    'readme.md',
    'package.json',
    'package-lock.json',
    'yarn.lock',
    '.gitignore',
    '.eslintrc',
    '.prettierrc'
];

function scanDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const relativePath = path.relative('.', fullPath).toLowerCase();
        const stat = fs.statSync(fullPath);

        // Ignorar pastas não desejadas
        if (stat.isDirectory()) {
            if (!ignoreDirs.includes(file.toLowerCase())) {
                scanDir(fullPath);
            }
        } else {
            const ext = path.extname(file).toLowerCase();
            const fileName = file.toLowerCase();

            // Ignorar arquivos específicos
            if (ignoreFiles.includes(fileName)) return;

            // Somente arquivos .js
            if (ext === '.js' || ext === '.jsx') {
                const content = fs.readFileSync(fullPath, 'utf-8');
                output.push(`\n===== ${fullPath} =====\n\n${content}\n`);
            }
        }
    });
}

scanDir('./src');

// Escreve no arquivo final
fs.writeFileSync(outputFile, output.join('\n'), 'utf-8');

console.log(`✅ Arquivo gerado: ${outputFile}`);
