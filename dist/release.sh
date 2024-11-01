#!/usr/bin/env bash

[[ ! -f "package.json" ]] && echo "Please run this script from the root of Duet Web Control!" && exit 1

npm install
npm run build-plugin MillenniumOS_UI
