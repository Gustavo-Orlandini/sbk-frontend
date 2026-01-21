# Como subir o código para um novo repositório do GitHub

## Opção 1: Trocar o remote atual

Se você quer substituir o remote atual (que aponta para o backend), execute:

```bash
# 1. Remover o remote atual
git remote remove origin

# 2. Adicionar o novo repositório (substitua pela URL do seu novo repo)
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git

# 3. Verificar se foi adicionado corretamente
git remote -v

# 4. Fazer commit dos arquivos (se ainda não tiver feito)
git add .
git commit -m "Initial commit: SBK Frontend"

# 5. Enviar para o GitHub
git push -u origin main
```

## Opção 2: Manter ambos os remotes

Se você quer manter o remote do backend e adicionar um novo:

```bash
# 1. Adicionar o novo remote com outro nome (ex: frontend)
git remote add frontend https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git

# 2. Fazer commit dos arquivos (se ainda não tiver feito)
git add .
git commit -m "Initial commit: SBK Frontend"

# 3. Enviar para o novo repositório
git push -u frontend main

# Para enviar atualizações futuras:
git push frontend main
```

## Opção 3: Criar um repositório totalmente novo

Se você quer começar do zero em um novo repositório:

```bash
# 1. Remover o remote atual
git remote remove origin

# 2. Inicializar um novo repositório (se necessário)
# git init (apenas se não houver .git ainda)

# 3. Adicionar todos os arquivos
git add .

# 4. Fazer commit inicial
git commit -m "Initial commit: SBK Frontend"

# 5. Adicionar o novo remote
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git

# 6. Enviar para o GitHub
git push -u origin main
```

## Nota importante

⚠️ Certifique-se de que o repositório no GitHub já foi criado antes de fazer o push!

## Verificar configuração atual

Para ver qual remote está configurado:
```bash
git remote -v
```
