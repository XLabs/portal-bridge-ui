#!/bin/bash
ROOT=${1}
PKG_NAME=${2}
BRANCH_SHA=${3}

unpublish() {
    local PKG_NAME=${1}
    local VERSION=${2}
    echo "Unpublishing ${PKG_NAME}@${VERSION}..."
    echo npm unpublish ${PKG_NAME}@${VERSION} --force --registry https://npm.pkg.github.com
}

for VERSION in $(cat ${ROOT}/preview/${BRANCH_SHA}/.artifacts); do
    unpublish ${PKG_NAME} ${VERSION}
done

unpublish ${PKG_NAME} $(cat ${ROOT}/preview/${BRANCH_SHA}/.latest)

echo "Removing ${ROOT}/preview/${BRANCH_SHA}..."
echo rm -rf ${ROOT}/preview/${BRANCH_SHA}
