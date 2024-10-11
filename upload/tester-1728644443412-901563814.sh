#!/bin/bash

prefix="tester_dir"
random_number=$RANDOM  # Gera um número aleatório
dirname="${prefix}_${random_number}"  # Nome do diretório

# Garante que o nome do diretório seja único, verificando se já existe
while [ -e "$dirname" ]; do
    random_number=$RANDOM  # Gera outro número aleatório se já existir
    dirname="${prefix}_${random_number}"
done

mkdir $dirname
cd $dirname

# Criar o diretório de teste e os arquivos a, b, c
mkdir tester_dir
cd tester_dir
touch a b c

# Listar o conteúdo de 'tester_dir' e salvar no arquivo 'origin'
echo "$*" > ../resposta
comando=$(cat ../resposta)
ls -1 > ../origin
eval "$comando" > ../of_user

# Comparar os arquivos usando diff
if diff ../origin ../of_user > /dev/null; then
    echo "OK"  # Os arquivos são iguais
else
    echo "KO"  # Os arquivos são diferentes
fi

# Voltar ao diretório original e limpar os arquivos temporários
cd ../..
rm -rf $dirname
rm -rf of_user origin

