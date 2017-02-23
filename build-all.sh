#!/usr/bin/env bash

set -e -o pipefail

cd `dirname $0`

export NODE_PATH=${NODE_PATH}:$(pwd)/dist/all:$(pwd)/dist/tools
TSC="node --max-old-space-size=3000 dist/tools/@angular/tsc-wrapped/src/main"
TSCONFIG=./tools/tsconfig.json
echo "====== (tools)COMPILING: \$(npm bin)/tsc -p ${TSCONFIG} ====="
rm -rf ./dist/tools/
mkdir -p ./dist/tools/
$(npm bin)/tsc -p ${TSCONFIG}

cp ./tools/@angular/tsc-wrapped/package.json ./dist/tools/@angular/tsc-wrapped

rm -rf ./dist/all/
mkdir -p ./dist/all/

echo "====== Copying files needed for e2e tests ====="
cp -r ./modules/playground ./dist/all/
cp -r ./modules/playground/favicon.ico ./dist/
#rsync -aP ./modules/playground/* ./dist/all/playground/
mkdir ./dist/all/playground/vendor
cd ./dist/all/playground/vendor
ln -s ../../../../node_modules/core-js/client/core.js .
ln -s ../../../../node_modules/zone.js/dist/zone.js .
ln -s ../../../../node_modules/zone.js/dist/long-stack-trace-zone.js .
ln -s ../../../../node_modules/systemjs/dist/system.src.js .
ln -s ../../../../node_modules/base64-js .
ln -s ../../../../node_modules/reflect-metadata/Reflect.js .
ln -s ../../../../node_modules/rxjs .
ln -s ../../../../node_modules/angular/angular.js .
ln -s ../../../../node_modules/hammerjs/hammer.js .
cd -

echo "====== Copying files needed for benchmarks ====="
cp -r ./modules/benchmarks ./dist/all/
cp -r ./modules/benchmarks/favicon.ico ./dist/
mkdir ./dist/all/benchmarks/vendor
cd ./dist/all/benchmarks/vendor
ln -s ../../../../node_modules/core-js/client/core.js .
ln -s ../../../../node_modules/zone.js/dist/zone.js .
ln -s ../../../../node_modules/zone.js/dist/long-stack-trace-zone.js .
ln -s ../../../../node_modules/systemjs/dist/system.src.js .
ln -s ../../../../node_modules/reflect-metadata/Reflect.js .
ln -s ../../../../node_modules/rxjs .
ln -s ../../../../node_modules/angular/angular.js .
ln -s ../../../../bower_components/polymer .
ln -s ../../../../node_modules/incremental-dom/dist/incremental-dom-cjs.js
cd -

TSCONFIG=./modules/tsconfig.json
echo "====== (all)COMPILING: \$(npm bin)/tsc -p ${TSCONFIG} ====="
# compile ts code
$TSC -p modules/tsconfig.json

rm -rf ./dist/packages-dist
