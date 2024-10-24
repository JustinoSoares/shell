#!/bin/bash

prefix="tester_dir"
random_number=$RANDOM  # Gera um número aleatório
dirname="${prefix}_${random_number}"  # Nome do diretório

# veficar se a strinfg está vazia
if [ -z "$*" ]; then
    echo "KO" 
    exit;
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

mkdir tester_origin tester_output_user
cd tester_origin
touch arq1.txt arq2 arq3.txt arq4
rm *.txt
ls -1 > ../../origin
cd ../tester_output_user
touch arq1.txt arq2 arq3.txt arq4
eval "$comando" & > /dev/null # Executar o comando e nao mostrar a saida
ls -1 > ../../output_user
cd ..
# Comparar os arquivos usando diff
if diff ../origin ../output_user > /dev/null; then
    echo "OK : "  # Os arquivos são iguais
else
    echo "KO : "  # Os arquivos são diferentes
fi

# Voltar ao diretório original e limpar os arquivos temporários
cd ../..
rm -rf $dirname

