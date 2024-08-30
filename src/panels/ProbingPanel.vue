<template>
    <v-card>
        <v-card-title class="pt-0">
            <v-icon small class="mr-1">mdi-ruler-square</v-icon>
            Probing
            <v-spacer />
            <code-btn small :color="allAxesHomed ? 'primary' : 'warning'" code="G28"
                    :title="$t('button.home.titleAll')">
                {{ $t("button.home.captionAll") }}
            </code-btn>
        </v-card-title>
        <v-card-text>
            <v-container fluid>
                <v-row dense>
                    <v-col cols="12">
                        <v-stepper vertical v-model="step">
                            <v-stepper-step
                                step="1"
                                :complete="step > 1"
                                editable
                            >Select Probe Cycle Type</v-stepper-step>

                            <v-stepper-content
                                step="1">
                                <mos-probe-selector-panel :probeTypes="probeTypes"
                                @update:selectedProbeType="probeTypeSelected" />
                            </v-stepper-content>

                            <v-stepper-step
                                step="2"
                                editable
                            >
                                Configure Probe Settings
                            </v-stepper-step>


                            <v-stepper-content
                                step="2">
                                <mos-probe-settings-panel v-if="selectedProbeType !== -1" :probeType="probeTypes[selectedProbeType]" />
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

import probeTypes from '../types/Probe';


export default Vue.extend({
    data() {
        return {
            currentWorkplace: 0,
            probeTypes: probeTypes,
            selectedProbeType: -1,
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
        workplaceNumber(to: number) {
            this.currentWorkplace = to + 1;
        }
    },
});

</script>

<style scoped>
.wcs-selection {
    max-width: 200px;
}
</style>