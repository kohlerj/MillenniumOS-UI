'use strict';

import { registerRoute } from "@/routes";
import { registerPluginLocalization } from "@/i18n";

import './components/panels';
import './components/inputs';

import Dash from './MillenniumOS.vue'

import en from "./i18n/en.json";

registerPluginLocalization("millenniumOS", "en", en);

// Register a route via Settings -> Object Model
registerRoute(Dash, {
	Control: {
		MillenniumOS: {
			icon: "mdi-toolbox",
			caption: "plugins.millenniumOS.menuCaption",
			path: "/Plugins/MillenniumOS"
		}
	}
});
