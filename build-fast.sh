#!/usr/bin/env bash


VERSION_PREFIX=$(node -p "require('./package.json').version")
VERSION_SUFFIX="-$(git log --oneline -1 | awk '{print $1}')"
ROUTER_VERSION_PREFIX=$(node -p "require('./package.json').version.replace(/^2/, '3')")

VERSION="${VERSION_PREFIX}${VERSION_SUFFIX}"
ROUTER_VERSION="${ROUTER_VERSION_PREFIX}${VERSION_SUFFIX}"
echo "====== BUILDING: Version ${VERSION} (Router ${ROUTER_VERSION})"


./build-all.sh
./build-compile.sh
./build.sh --packages=core,compiler,common &&
./build.sh --packages=animations &
./build.sh --packages=forms &
./build.sh --packages=platform-browser &
./build.sh --packages=platform-browser-dynamic &
./build.sh --packages=http &
./build.sh --packages=platform-server
  platform-webworker
  platform-webworker-dynamic
  upgrade
  router
  compiler-cli
  language-service
  benchpress

