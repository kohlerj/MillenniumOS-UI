import Vue from "vue";

import StatusPanel from './StatusPanel.vue';
import ProbingPanel from './ProbingPanel.vue';

import BoreProbePanel from "./BoreProbePanel.vue";

Vue.component("mos-status-panel", StatusPanel);
Vue.component("mos-probing-panel", ProbingPanel);
Vue.component("mos-bore-probe-panel", BoreProbePanel);