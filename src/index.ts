'use strict';

import { registerRoute } from "@/routes";
import { registerPluginLocalization } from "@/i18n";
import { registerPluginData, PluginDataType } from '@/store';

import './utils';

import './components/panels';
import './components/inputs';
import './components/overrides';

import Dash from './MillenniumO_UI.vue'

import en from "./i18n/en.json";

registerPluginLocalization("millenniumos_ui", "en", en);

// Register a route via Settings -> Object Model
registerRoute(Dash, {
	Control: {
		MillenniumOS: {
			icon: "mdi-toolbox",
			caption: "plugins.millenniumos.menuCaption",
			path: "/Plugins/MillenniumOS_UI"
		}
	}
});

registerPluginData('MillenniumOS_UI', PluginDataType.machineCache, 'protectedMoveProbeID', -1);
