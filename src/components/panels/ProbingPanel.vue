<template>
    <v-card>
        <v-card-title>
            <v-icon small class="mr-1">mdi-ruler-square</v-icon>
            Probing
            <v-spacer />
            <code-btn small :color="allAxesHomed ? 'primary' : 'warning'" code="G28"
                    :title="$t('button.home.titleAll')">
                {{ $t("button.home.captionAll") }}
            </code-btn>
        </v-card-title>
    {{  probeSettings }}
        <v-card-text :class="{'px-0': $vuetify.breakpoint.mdAndDown}">
            {{ selectedProbeType }}
            <v-container fluid>
                <v-row>
                    <v-col cols="12">
                        <v-stepper vertical v-model="step" :class="{'smallScreen': $vuetify.breakpoint.mdAndDown}">
                            <v-stepper-step
                                step="1"
                                :complete="step > 1"
                                editable
                            >Select Probe Cycle Type</v-stepper-step>

                            <v-stepper-content
                                step="1">
                                <mos-probe-selector-panel :probeTypes="probeTypes"
                                    v-model="selectedProbeType"
                                />
                            </v-stepper-content>

                            <v-stepper-step
                                step="2"
                            >
                                Configure Probe Settings
                            </v-stepper-step>


                            <v-stepper-content
                                step="2">
                                <mos-probe-settings-panel
                                    v-if="selectedProbeType !== -1"
                                    :probeType="probeTypes[selectedProbeType]"
                                    v-model="probeSettings"
                                />
                            </v-stepper-content>

                            <v-stepper-step
                                step="3"
                                editable
                            >
                                Jog to Starting Position
                            </v-stepper-step>

                            <v-divider></v-divider>

                            <v-stepper-step
                                step="4"
                                editable
                            >Review</v-stepper-step>
                            </v-stepper-header>
                        </v-stepper>

                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import store from "@/store";

import probeTypes from '../../types/Probe';


export default Vue.extend({
    data() {
        return {
            currentWorkplace: 0,
            probeTypes: probeTypes,
            selectedProbeType: -1,
            probeSettings: {},
            step: 1,
        };
    },
    computed: {
		allAxesHomed(): boolean { return store.state.machine.model.move.axes.every(axis => axis.visible && axis.homed)},
        workCoordinates(): Array<number> { return [...Array(9).keys()].map(i => i + 1); },
        workplaceNumber(): number { return store.state.machine.model.move.workplaceNumber; },
    },
    methods: {
        probeTypeSelected(probeType: number) {
            console.log("Probe Type Updated: " + probeType);
            this.selectedProbeType = probeType;
            this.nextStep();
        },
        nextStep() {
            this.step++;
        },
        async updateWorkplaceCoordinate() {
            let code;
            if (this.currentWorkplace < 7) {
                code = `G${53 + this.currentWorkplace}`;
            } else {
                code = `G59.${this.currentWorkplace - 6}`;
            }

            if (code) {
                await store.dispatch("machine/sendCode", `${code}\nG10 L20 P${this.currentWorkplace}`);
            }
        },
    },
    mounted() {
        this.currentWorkplace = this.workplaceNumber + 1;
    },
    watch: {
        selectedProbeType(to: number) {
            if (to !== -1) {
                this.nextStep();
            }
        },
        probeSettings(to: any) {
            this.nextStep();
        },
        workplaceNumber(to: number) {
            this.currentWorkplace = to + 1;
        }
    },
});

</script>
<style scoped>
.smallScreen .v-stepper--vertical .v-stepper__step {
    padding: 8px 8px 8px;
}
.v-application--is-ltr .v-stepper--vertical .v-stepper__content {
	margin: -4px -36px -16px 20px;
}
.smallScreen .v-stepper__wrapper > div.container {
    padding-left: 0;
    padding-right: 0;
}
</style>