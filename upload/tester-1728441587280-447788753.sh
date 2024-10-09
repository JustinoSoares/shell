#!/bin/bash

mkdir tester_ls
cd tester_ls
touch a b c

comando=(head -n 1 '../build/$1')

ls > ../log

comando > ../log2

cd ..


