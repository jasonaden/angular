#!/usr/bin/env bash

set -e -o pipefail

cd `dirname $0`

PACKAGES=(core
  compiler
  common
  animations
  forms
  platform-browser
  platform-browser-dynamic
  http
  platform-server
  platform-webworker
  platform-webworker-dynamic
  upgrade
  router
  compiler-cli
  language-service
  benchpress)

BUILD_ALL=true
BUNDLE=true
VERSION_PREFIX=$(node -p "require('./package.json').version")
VERSION_SUFFIX="-$(git log --oneline -1 | awk '{print $1}')"
ROUTER_VERSION_PREFIX=$(node -p "require('./package.json').version.replace(/^2/, '3')")
REMOVE_BENCHPRESS=false
BUILD_EXAMPLES=true

for ARG in "$@"; do
  case "$ARG" in
    --packages=*)
      PACKAGES_STR=${ARG#--packages=}
      PACKAGES=( ${PACKAGES_STR//,/ } )
      BUILD_ALL=false
      ;;
    --bundle=*)
      BUNDLE=( "${ARG#--bundle=}" )
      ;;
    --publish)
      VERSION_SUFFIX=""
      REMOVE_BENCHPRESS=true
      ;;
    --examples=*)
      BUILD_EXAMPLES=${ARG#--examples=}
      ;;
    *)
      echo "Unknown option $ARG."
      exit 1
      ;;
  esac
done

VERSION="${VERSION_PREFIX}${VERSION_SUFFIX}"
ROUTER_VERSION="${ROUTER_VERSION_PREFIX}${VERSION_SUFFIX}"

export NODE_PATH=${NODE_PATH}:$(pwd)/dist/all:$(pwd)/dist/tools
TSC="node --max-old-space-size=3000 dist/tools/@angular/tsc-wrapped/src/main"
UGLIFYJS=`pwd`/node_modules/.bin/uglifyjs
BABELJS=`pwd`/node_modules/.bin/babel
BABILI=`pwd`/node_modules/.bin/babili
TSCONFIG=./tools/tsconfig.json

for PACKAGE in ${PACKAGES[@]}
do
  PWD=`pwd`
  ROOTDIR=${PWD}/modules/@angular
  SRCDIR=${PWD}/modules/@angular/${PACKAGE}
  DESTDIR=${PWD}/dist/packages-dist/${PACKAGE}
  DEST_MODULE=${DESTDIR}/@angular
  DEST_BUNDLES=${DESTDIR}/bundles

  if [[ ${PACKAGE} != router ]]; then
    LICENSE_BANNER=${PWD}/modules/@angular/license-banner.txt
  fi
  if [[ ${PACKAGE} == router ]]; then
    LICENSE_BANNER=${PWD}/modules/@angular/router-license-banner.txt
  fi

  rm -rf ${DESTDIR}

  # When .babelrc file exists, the dist package will have ES2015 sources, ESM/ES5, and UMD bundles. Because of a bug
  # preventing the Compiler package from running through this pipeline, we have to manually check for the Compiler
  # package as well. The tsconfig-build.json defaults to building to the root of the package dist dir, but when
  # outputting ES2015 then bundling from there, built files should go to the DEST_MODULE folder.
  echo "======      [${PACKAGE}]: COMPILING: ${TSC} -p ${SRCDIR}/tsconfig-build.json"
  if [[ -e ${SRCDIR}/.babelrc || ${PACKAGE} == "compiler" ]]; then
    $TSC -p ${SRCDIR}/tsconfig-build.json -outDir ${DEST_MODULE}
  else
    $TSC -p ${SRCDIR}/tsconfig-build.json
  fi

  echo "======        Move ${PACKAGE} typings"
  if [[ -e ${SRCDIR}/.babelrc || -d ${DEST_MODULE} ]]; then
    rsync -a --exclude=*.js --exclude=*.js.map ${DEST_MODULE}/ ${DESTDIR}/typings
  else
    rsync -a --exclude=*.js --exclude=*.js.map ${DESTDIR}/ ${DESTDIR}/typings
    find ${DESTDIR} -name "*.d.ts" -not -path "${DESTDIR}/typings/*" -exec rm -f {} \;
  fi

  if [[ -e ${SRCDIR}/tsconfig-es5.json ]]; then
    echo "======      [${PACKAGE}]: COMPILING (ES5): ${TSC} -p ${SRCDIR}/tsconfig-es5.json"
    $TSC -p ${SRCDIR}/tsconfig-es5.json
  fi

  cp ${SRCDIR}/package.json ${DESTDIR}/
  if [[ -e ${SRCDIR}/.babelrc ]]; then
    cp ${SRCDIR}/.babelrc ${DESTDIR}/
  fi
  cp ${PWD}/modules/@angular/README.md ${DESTDIR}/

  if [[ -e ${SRCDIR}/tsconfig-upgrade.json ]]; then
    echo "======      [${PACKAGE}]: COMPILING (UPGRADE): ${TSC} -p ${SRCDIR}/tsconfig-upgrade.json"
    $TSC -p ${SRCDIR}/tsconfig-upgrade.json
  fi

  if [[ -e ${SRCDIR}/tsconfig-testing.json ]]; then
    echo "======      [${PACKAGE}]: COMPILING (TESTING): ${TSC} -p ${SRCDIR}/tsconfig-testing.json"
    $TSC -p ${SRCDIR}/tsconfig-testing.json
  fi

  if [[ -e ${SRCDIR}/tsconfig-animations.json ]]; then
    echo "======      [${PACKAGE}]: COMPILING (ANIMATIONS): ${TSC} -p ${SRCDIR}/tsconfig-animations.json"
    $TSC -p ${SRCDIR}/tsconfig-animations.json

    if [[ -e ${SRCDIR}/tsconfig-animations-testing.json ]]; then
      echo "======      [${PACKAGE}]: COMPILING (ANIMATION TESTING): ${TSC} -p ${SRCDIR}/tsconfig-animations-testing.json"
      $TSC -p ${SRCDIR}/tsconfig-animations-testing.json
    fi
  fi

  if [[ -e ${SRCDIR}/tsconfig-static.json ]]; then
    echo "======      [${PACKAGE}]: COMPILING (STATIC): ${TSC} -p ${SRCDIR}/tsconfig-static.json"
    $TSC -p ${SRCDIR}/tsconfig-static.json
  fi

  if [[ -e ${SRCDIR}/tsconfig-2015.json ]]; then
    echo "======      [${PACKAGE}]: COMPILING (ES2015): ${TSC} -p ${SRCDIR}/tsconfig-2015.json"
    ${TSC} -p ${SRCDIR}/tsconfig-2015.json
  fi

  if [[ ${PACKAGE} == benchpress ]]; then
    cp ${SRCDIR}/*.md ${DESTDIR}
    cp -r ${SRCDIR}/docs ${DESTDIR}
  fi

  (
    echo "======      VERSION: Updating version references"
    if [[ -e ${SRCDIR}/.babelrc ]]; then
      cd ${DEST_MODULE}
    else
      cd ${DESTDIR}
    fi
    echo "======       EXECUTE: perl -p -i -e \"s/0\.0\.0\-PLACEHOLDER/${VERSION}/g\" $""(grep -ril 0\.0\.0\-PLACEHOLDER .)"
    perl -p -i -e "s/0\.0\.0\-PLACEHOLDER/${VERSION}/g" $(grep -ril 0\.0\.0\-PLACEHOLDER .) < /dev/null 2> /dev/null
    echo "======       EXECUTE: perl -p -i -e \"s/0\.0\.0\-ROUTERPLACEHOLDER/${ROUTER_VERSION}/g\" $""(grep -ril 0\.0\.0\-ROUTERPLACEHOLDER .)"
    perl -p -i -e "s/0\.0\.0\-ROUTERPLACEHOLDER/${ROUTER_VERSION}/g" $(grep -ril 0\.0\.0\-ROUTERPLACEHOLDER .) < /dev/null 2> /dev/null
  )
done
