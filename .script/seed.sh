#!/bin/bash

# Lấy tham số truyền vào
script_name=$1

# Tạo mảng để chứa tất cả các tham số còn lại
shift
extra_params=("$@")

# Thực thi câu lệnh
node   -r tsconfig-paths/register -r ts-node/register "./src/$script_name/$script_name.seed.ts" ${extra_params[@]}
