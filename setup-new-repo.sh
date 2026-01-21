#!/bin/bash
# Script para configurar novo repositório GitHub

# Substitua pela URL do seu novo repositório
NEW_REPO_URL="https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git"

echo "📦 Configurando novo repositório GitHub..."

# Remover remote atual (backend)
git remote remove origin

# Adicionar novo remote
git remote add origin $NEW_REPO_URL

# Verificar remote
echo "✅ Remote configurado:"
git remote -v

# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "Initial commit: SBK Frontend"

# Push para o GitHub
echo "🚀 Enviando para o GitHub..."
git push -u origin main

echo "✅ Concluído!"
