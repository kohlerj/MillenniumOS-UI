#!/usr/bin/env bash

[[ ! -f "package.json" ]] && echo "Please run this script from the root of Duet Web Control!" && exit 1

npm install

# Build DWC with the plugin
npm run build -- --dest distDWC
