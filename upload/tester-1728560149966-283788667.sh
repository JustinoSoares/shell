#!/bin/bash

prefix="tester_dir"
random_number=$RANDOM  # Gera um número aleatório
dirname="${prefix}_${random_number}"  # Nome do arquivo

# Garante que o nome do arquivo seja único, verificando se já existe
while [ -e "$filename" ]; do
    random_number=$RANDOM  # Gera outro número aleatório se já existir
    dirname="${prefix}_${random_number}"
done

mkdir $dirname
cd $dirname

mkdir tester_dir
cd tester_dir
touch a b c

ls > ../origin
"$1" > ../of_user

# Comparar os arquivos usando diff
if diff  ../origin ../of_user > /dev/null; then
    echo "OK"  # Os arquivos são iguais
else
    echo "KO"  # Os arquivos são diferentes
fi

cd ..
cd ..
rm -rf $dirname
rm -rf of_user origin

