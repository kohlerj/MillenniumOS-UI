#!/usr/bin/env bash

# Get directory of this script
SD=$(dirname "$0")

# Get absolute path of DWC directory
MOS_UI_DIR="${SD}/../"

cd "${DWC_DIR}"

npm install

npm run build-plugin ${MOS_UI_DIR}