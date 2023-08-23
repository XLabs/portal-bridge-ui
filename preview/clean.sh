#!/bin/zsh
shopt -s extglob

INPUT=$(gh pr list --json headRefName --jq '.[].headRefName')
OUTPUT="clean.sh"
# Loop through the array and concatenate the strings with pipe character
for BRANCH in ${INPUT}; do
    HASH=$(echo ${BRANCH} | sha256sum | cut -c -10)
    if [ -n "${OUTPUT}" ]; then
        OUTPUT="${OUTPUT}|${HASH}"
    else
        OUTPUT="${HASH}"
    fi
done

echo "Hashes to remove ${OUTPUT}"

read -p "Continue (y/n)? - " CHOICE
case "${CHOICE}" in 
  y|Y ) rm -rf !(${OUTPUT});;
  n|N ) echo "rm -rf !(${OUTPUT})";;
  * ) echo "invalid";;
esac


