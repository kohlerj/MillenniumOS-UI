import Vue from "vue";

import JobProgressPanel from "./JobProgressPanel.vue";
import SafeMovementPanel from './SafeMovementPanel.vue';
import ProbingPanel from './ProbingPanel.vue';
import ProbeSettingsPanel from "./ProbeSettingsPanel.vue";
import ProbeSelectorPanel from "./ProbeSelectorPanel.vue";

Vue.component("mos-job-progress-panel", JobProgressPanel);
Vue.component("mos-safe-movement-panel", SafeMovementPanel);
Vue.component("mos-probing-panel", ProbingPanel);
Vue.component("mos-probe-selector-panel", ProbeSelectorPanel);
Vue.component("mos-probe-settings-panel", ProbeSettingsPanel);