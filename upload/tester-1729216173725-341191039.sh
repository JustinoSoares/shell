#!/bin/bash

prefix="tester_dir"
random_number=$RANDOM  # Gera um número aleatório
dirname="${prefix}_${random_number}"  # Nome do diretório

#verica se uma string está vazia
if [ -z "$*" ]; then
    echo "KO"
    exit ;
fi

# Garante que o nome do diretório seja único, verificando se já existe
while [ -e "$dirname" ]; do
    random_number=$RANDOM  # Gera outro número aleatório se já existir
    dirname="${prefix}_${random_number}"
done

mkdir $dirname
cd $dirname

mkdir tester_dir
cd tester_dir
# Listar o conteúdo de 'tester_dir' e salvar no arquivo 'origin'
echo "$*" > ../resposta
comando=$(cat ../resposta)
# Verificar se houve saída
output=$(eval "$comando" < /dev/null 2>&1)   # Captura tanto stdout quanto stderr
status=$?  
if [ -z "$output" ]; then
    echo "KO"
    cd ../..
    rm -rf $dirname
    exit ;
fi
pwd > ../origin
eval "$comando" > ../output_user

# Comparar os arquivos usando diff
if diff ../origin ../output_user > /dev/null; then
    echo "OK"  # Os arquivos são iguais
else
    echo "KO"  # Os arquivos são diferentes
fi

# Voltar ao diretório original e limpar os arquivos temporários
cd ../..
rm -rf $dirname

