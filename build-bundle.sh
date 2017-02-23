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

getPackageContents() {
  echo "{\"typings\": \"../typings/${2}/index.d.ts\", \"main\": \"../bundles/${1}-${2}.umd.js\", \"module\": \"../@angular/${1}/${2}.es5.js\", \"es2015\": \"../@angular/${1}/${2}.js\"}"
}

#######################################
# Downsamples ES2015 to ESM/ES5
# Arguments:
#   param1 - Destination folder
#   param2 - Input path
#   param3 - Output path
# Returns:
#   None
#######################################
downsampleES2015() {
  echo '{"presets": [ ["es2015", { "modules": false }] ] }' > ${1}/.babelrc
  $BABELJS ${2} -o ${3}
  rm -f ${1}/.babelrc
}

VERSION="${VERSION_PREFIX}${VERSION_SUFFIX}"
ROUTER_VERSION="${ROUTER_VERSION_PREFIX}${VERSION_SUFFIX}"
echo "====== BUILDING: Version ${VERSION} (Router ${ROUTER_VERSION})"

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

  # ESM/2015
  JS_PATH=${DEST_MODULE}/${PACKAGE}.js
  JS_PATH_ES5=${DEST_MODULE}/${PACKAGE}.es5.js
  JS_TESTING_PATH=${DEST_MODULE}/${PACKAGE}/testing.js
  JS_TESTING_PATH_ES5=${DEST_MODULE}/${PACKAGE}/testing.es5.js
  JS_STATIC_PATH=${DEST_MODULE}/${PACKAGE}/static.js
  JS_STATIC_PATH_ES5=${DEST_MODULE}/${PACKAGE}/static.es5.js
  JS_UPGRADE_PATH=${DEST_MODULE}/${PACKAGE}/upgrade.js
  JS_UPGRADE_PATH_ES5=${DEST_MODULE}/${PACKAGE}/upgrade.es5.js
  JS_ANIMATIONS_PATH=${DEST_MODULE}/${PACKAGE}/animations.js
  JS_ANIMATIONS_PATH_ES5=${DEST_MODULE}/${PACKAGE}/animations.es5.js
  JS_ANIMATIONS_TESTING_PATH=${DEST_MODULE}/${PACKAGE}/animations/testing.js
  JS_ANIMATIONS_TESTING_PATH_ES5=${DEST_MODULE}/${PACKAGE}/animations/testing.es5.js

  # UMD/ES5
  UMD_ES5_PATH=${DEST_BUNDLES}/${PACKAGE}.umd.js
  UMD_TESTING_ES5_PATH=${DEST_BUNDLES}/${PACKAGE}-testing.umd.js
  UMD_STATIC_ES5_PATH=${DEST_BUNDLES}/${PACKAGE}-static.umd.js
  UMD_UPGRADE_ES5_PATH=${DEST_BUNDLES}/${PACKAGE}-upgrade.umd.js
  UMD_ES5_MIN_PATH=${DEST_BUNDLES}/${PACKAGE}.umd.min.js
  UMD_STATIC_ES5_MIN_PATH=${DEST_BUNDLES}/${PACKAGE}-static.umd.min.js
  UMD_UPGRADE_ES5_MIN_PATH=${DEST_BUNDLES}/${PACKAGE}-upgrade.umd.min.js
  UMD_ANIMATIONS_ES5_PATH=${DEST_BUNDLES}/${PACKAGE}-animations.umd.js
  UMD_ANIMATIONS_ES5_MIN_PATH=${DEST_BUNDLES}/${PACKAGE}-animations.umd.min.js
  UMD_ANIMATIONS_TESTING_ES5_PATH=${DEST_BUNDLES}/${PACKAGE}-animations-testing.umd.js

  if [[ ${BUNDLE} == true && ${PACKAGE} != compiler-cli && ${PACKAGE} != benchpress ]]; then

    echo "======      BUNDLING: ${SRCDIR} ====="
    mkdir ${DEST_BUNDLES}

    (
      cd  ${SRCDIR}
      echo "======         Rollup ${PACKAGE} index"
      ../../../node_modules/.bin/rollup -i ${DEST_MODULE}/index.js -o ${JS_PATH}
      cat ${LICENSE_BANNER} > ${JS_PATH}.tmp
      cat ${JS_PATH} >> ${JS_PATH}.tmp
      mv ${JS_PATH}.tmp ${JS_PATH}

      if [[ -e ${DESTDIR}/.babelrc ]]; then

        echo "======         Downleveling ES2015 to UMD/ES5"
        $BABELJS ${JS_PATH} -o ${UMD_ES5_PATH}

        ### Minification ###
        echo "======         Minifying ES2015"
        $BABILI ${JS_PATH} -o ${UMD_ES5_MIN_PATH}
        echo "======         Downleveling minified ES2015 to UMD/ES5"
        $BABELJS ${UMD_ES5_MIN_PATH} -o ${UMD_ES5_MIN_PATH}

        echo "======         Minifying UMD/ES5"
        $UGLIFYJS -c --screw-ie8 --comments -o ${UMD_ES5_MIN_PATH} ${UMD_ES5_MIN_PATH}
        ### END Minification ###
      else
        # For packages not running through babel, use the UMD/ES5 config
        echo "======         Rollup ${PACKAGE} index to UMD/ES5"
        ../../../node_modules/.bin/rollup -c rollup-umd.config.js
        [[ -d ${DESTDIR}/es5 ]] && rm -rf ${DESTDIR}/es5
        echo "======         Minifying UMD/ES5"
        $UGLIFYJS -c --screw-ie8 --comments -o ${UMD_ES5_MIN_PATH} ${UMD_ES5_PATH}
      fi

      rm -f ${DISTDIR}/.babelrc
      echo "======         Downleveling ES2015 to ESM/ES5"
      downsampleES2015 ${DEST_MODULE} ${JS_PATH} ${JS_PATH_ES5}

      if [[ -d testing ]]; then
        echo "======         Rollup ${PACKAGE} testing"
        ../../../node_modules/.bin/rollup -i ${DESTDIR}/testing/index.js -o ${DESTDIR}/testing.tmp.js

        echo "======         Downleveling ${PACKAGE} TESTING to UMD/ES5"
        [[ -e ${SRCDIR}/.babelrc-testing ]] && cp ${SRCDIR}/.babelrc-testing ${DESTDIR}/.babelrc
        $BABELJS ${DESTDIR}/testing.tmp.js -o ${UMD_TESTING_ES5_PATH}
        rm -f ${DESTDIR}/.babelrc

        echo "======         Move ${PACKAGE} testing typings"
        rsync -a --exclude=*.js --exclude=*.js.map ${DESTDIR}/testing/ ${DESTDIR}/typings/testing

        rm -rf ${DESTDIR}/testing

        mkdir ${DESTDIR}/testing && [[ -d ${DEST_MODULE}/${PACKAGE} ]] || mkdir ${DEST_MODULE}/${PACKAGE}

        getPackageContents "${PACKAGE}" "testing" > ${DESTDIR}/testing/package.json

        mv ${DESTDIR}/testing.tmp.js ${JS_TESTING_PATH}
        $BABELJS ${JS_TESTING_PATH} -o ${JS_TESTING_PATH_ES5}
        cat ${LICENSE_BANNER} > ${UMD_TESTING_ES5_PATH}.tmp
        cat ${UMD_TESTING_ES5_PATH} >> ${UMD_TESTING_ES5_PATH}.tmp
        mv ${UMD_TESTING_ES5_PATH}.tmp ${UMD_TESTING_ES5_PATH}
      fi

      if [[ -e static.ts ]]; then
        echo "======         Rollup ${PACKAGE} static"
        rm -f ${DEST_MODULE}/static.*
        ../../../node_modules/.bin/rollup -i ${DESTDIR}/static/static.js -o ${DESTDIR}/static.tmp.js

        echo "======         Downleveling ${PACKAGE} STATIC to UMD/ES5"
        [[ -e ${SRCDIR}/.babelrc-static ]] && cp ${SRCDIR}/.babelrc-static ${DESTDIR}/.babelrc
        $BABELJS ${DESTDIR}/static.tmp.js -o ${UMD_STATIC_ES5_PATH}
        rm -f ${DESTDIR}/.babelrc

        echo "======         Move ${PACKAGE} static typings"
        rsync -a --exclude=*.js ${DESTDIR}/static/ ${DESTDIR}/typings/static
        mv ${DESTDIR}/typings/static/static.d.ts ${DESTDIR}/typings/static/index.d.ts
        mv ${DESTDIR}/typings/static/static.js.map ${DESTDIR}/typings/static/index.js.map
        mv ${DESTDIR}/typings/static/static.metadata.json ${DESTDIR}/typings/static/index.metadata.json
        rm -rf ${DESTDIR}/static

        mkdir ${DESTDIR}/static && [[ -d ${DEST_MODULE}/${PACKAGE} ]] || mkdir ${DEST_MODULE}/${PACKAGE}

        getPackageContents "${PACKAGE}" "static"> ${DESTDIR}/static/package.json

        mv ${DESTDIR}/static.tmp.js ${JS_STATIC_PATH}
        $BABELJS ${JS_STATIC_PATH} -o ${JS_STATIC_PATH_ES5}
        cat ${LICENSE_BANNER} > ${UMD_STATIC_ES5_PATH}.tmp
        cat ${UMD_STATIC_ES5_PATH} >> ${UMD_STATIC_ES5_PATH}.tmp
        mv ${UMD_STATIC_ES5_PATH}.tmp ${UMD_STATIC_ES5_PATH}
        $UGLIFYJS -c --screw-ie8 --comments -o ${UMD_STATIC_ES5_MIN_PATH} ${UMD_STATIC_ES5_PATH}
      fi

      if [[ -e upgrade.ts ]]; then
        echo "======         Rollup ${PACKAGE} upgrade"
        rm -f ${DEST_MODULE}/upgrade.*
        ../../../node_modules/.bin/rollup -i ${DESTDIR}/upgrade/upgrade.js -o ${DESTDIR}/upgrade.tmp.js

        echo "======         Downleveling ${PACKAGE} UPGRADE to UMD/ES5"
        [[ -e ${SRCDIR}/.babelrc-upgrade ]] && cp ${SRCDIR}/.babelrc-upgrade ${DESTDIR}/.babelrc
        $BABELJS ${DESTDIR}/upgrade.tmp.js -o ${UMD_UPGRADE_ES5_PATH}
        rm -f ${DESTDIR}/.babelrc

        echo "======         Move ${PACKAGE} upgrade typings"
        rsync -a --exclude=*.js ${DESTDIR}/upgrade/ ${DESTDIR}/typings/upgrade
        mv ${DESTDIR}/typings/upgrade/upgrade.d.ts ${DESTDIR}/typings/upgrade/index.d.ts
        mv ${DESTDIR}/typings/upgrade/upgrade.js.map ${DESTDIR}/typings/upgrade/index.js.map
        mv ${DESTDIR}/typings/upgrade/upgrade.metadata.json ${DESTDIR}/typings/upgrade/index.metadata.json
        rm -rf ${DESTDIR}/upgrade

        mkdir ${DESTDIR}/upgrade && [[ -d ${DEST_MODULE}/${PACKAGE} ]] || mkdir ${DEST_MODULE}/${PACKAGE}

        getPackageContents "${PACKAGE}" "upgrade" > ${DESTDIR}/upgrade/package.json

        mv ${DESTDIR}/upgrade.tmp.js ${JS_UPGRADE_PATH}
        $BABELJS ${JS_UPGRADE_PATH} -o ${JS_UPGRADE_PATH_ES5}
        cat ${LICENSE_BANNER} > ${UMD_UPGRADE_ES5_PATH}.tmp
        cat ${UMD_UPGRADE_ES5_PATH} >> ${UMD_UPGRADE_ES5_PATH}.tmp
        mv ${UMD_UPGRADE_ES5_PATH}.tmp ${UMD_UPGRADE_ES5_PATH}
        $UGLIFYJS -c --screw-ie8 --comments -o ${UMD_UPGRADE_ES5_MIN_PATH} ${UMD_UPGRADE_ES5_PATH}
      fi

      if [[ -d animations ]]; then
        echo "======         Rollup ${PACKAGE} animations"
        ../../../node_modules/.bin/rollup -i ${DESTDIR}/animations/index.js -o ${DESTDIR}/animations.tmp.js

        echo "======         Downleveling ${PACKAGE} ANIMATIONS to ES5/UMD"
        [[ -e ${SRCDIR}/.babelrc-animations ]] && cp ${SRCDIR}/.babelrc-animations ${DESTDIR}/.babelrc
        $BABELJS ${DESTDIR}/animations.tmp.js -o ${UMD_ANIMATIONS_ES5_PATH}
        rm -f ${DESTDIR}/.babelrc

        echo "======         Move ${PACKAGE} animations typings"
        rsync -a --exclude=*.js --exclude=*.js.map ${DESTDIR}/animations/ ${DESTDIR}/typings/animations
        mv ${DESTDIR}/typings/animations/index.d.ts ${DESTDIR}/typings/animations/animations.d.ts
        mv ${DESTDIR}/typings/animations/index.metadata.json ${DESTDIR}/typings/animations/animations.metadata.json

        echo "======         Rollup ${PACKAGE} animations/testing"
        ../../../node_modules/.bin/rollup -i ${DESTDIR}/animations/testing/index.js -o ${DESTDIR}/animations-testing.tmp.js

        echo "======         Downleveling ${PACKAGE} ANIMATIONS TESTING to ES5/UMD"
        [[ -e ${SRCDIR}/.babelrc-animations-testing ]] && cp ${SRCDIR}/.babelrc-animations-testing ${DESTDIR}/.babelrc
        $BABELJS ${DESTDIR}/animations-testing.tmp.js -o ${UMD_ANIMATIONS_TESTING_ES5_PATH}
        rm -f ${DESTDIR}/.babelrc

        echo "======         Move ${PACKAGE} animations testing typings"
        rsync -a --exclude=*.js --exclude=*.js.map ${DESTDIR}/animations/testing/ ${DESTDIR}/typings/animations/testing
        mv ${DESTDIR}/typings/animations/testing/index.d.ts ${DESTDIR}/typings/animations/testing/testing.d.ts
        mv ${DESTDIR}/typings/animations/testing/index.metadata.json ${DESTDIR}/typings/animations/testing/testing.metadata.json

        rm -rf ${DESTDIR}/animations

        mkdir ${DESTDIR}/animations && [[ -d ${DEST_MODULE}/${PACKAGE} ]] || mkdir ${DEST_MODULE}/${PACKAGE}
        mkdir ${DESTDIR}/animations/testing

        getPackageContents "${PACKAGE}" "animations" > ${DESTDIR}/animations/package.json

        echo '{"typings": "../../typings/animations/testing/testing.d.ts", "main": "../../bundles/platform-browser-animations-testing.umd.js", "module": "../../@angular/platform-browser/animations/testing.es5.js", "es2015": "../../@angular/platform-browser/animations/testing.js"}' > ${DESTDIR}/animations/testing/package.json

        mv ${DESTDIR}/animations.tmp.js ${JS_ANIMATIONS_PATH}
        $BABELJS ${JS_ANIMATIONS_PATH} -o ${JS_ANIMATIONS_PATH_ES5}
        cat ${LICENSE_BANNER} > ${UMD_ANIMATIONS_ES5_PATH}.tmp
        cat ${UMD_ANIMATIONS_ES5_PATH} >> ${UMD_ANIMATIONS_ES5_PATH}.tmp
        mv ${UMD_ANIMATIONS_ES5_PATH}.tmp ${UMD_ANIMATIONS_ES5_PATH}
        $UGLIFYJS -c --screw-ie8 --comments -o ${UMD_ANIMATIONS_ES5_MIN_PATH} ${UMD_ANIMATIONS_ES5_PATH}

        mkdir ${DEST_MODULE}/${PACKAGE}/animations

        mv ${DESTDIR}/animations-testing.tmp.js ${JS_ANIMATIONS_TESTING_PATH}
        $BABELJS ${JS_ANIMATIONS_TESTING_PATH} -o ${JS_ANIMATIONS_TESTING_PATH_ES5}
        cat ${LICENSE_BANNER} > ${UMD_ANIMATIONS_TESTING_ES5_PATH}.tmp
        cat ${UMD_ANIMATIONS_TESTING_ES5_PATH} >> ${UMD_ANIMATIONS_TESTING_ES5_PATH}.tmp
        mv ${UMD_ANIMATIONS_TESTING_ES5_PATH}.tmp ${UMD_ANIMATIONS_TESTING_ES5_PATH}
      fi
    ) 2>&1 | grep -v "as external dependency"

  fi

done
