#!/usr/bin/env bash

[[ ! -f "package.json" ]] && echo "Please run this script from the root of Duet Web Control!" && exit 1

npm install

# Build the plugin
npm run build-plugin MillenniumOS_UI -- --dest dist/plugin
