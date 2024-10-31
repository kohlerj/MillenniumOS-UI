<template>
    <v-card>
        <v-card-title>
            <v-icon large class="mr-1">mdi-target-variant</v-icon>
            Probing
            <v-spacer />
            <code-btn small :color="allAxesHomed ? 'primary' : 'warning'" code="G28"
                    :title="$t('button.home.titleAll')">
                {{ $t("button.home.captionAll") }}
            </code-btn>
        </v-card-title>
        <v-card-text :class="{'px-0': $vuetify.breakpoint.mdAndDown}">
            {{ probeSettings }}
            <v-container fluid>
                <v-row>
                    <v-col cols="12">
                        <v-tabs v-model="tab">
                            <v-tab>
                                <v-icon left>mdi-target-variant</v-icon>
                                Select Cycle
                            </v-tab>

                            <v-tab :disabled="!hasProbeTypeSelected">
                                <v-icon left>mdi-cog</v-icon>
                                Configure Settings
                            </v-tab>
                            <v-tab :disabled="!hasProbeTypeSelected">
                                <v-icon left>mdi-run-fast</v-icon>
                                Move to Position
                            </v-tab>
                            <v-tab :disabled="!hasProbeTypeSelected || !hasProbeSettings">
                                <v-icon left>mdi-check</v-icon>
                                Review and Run
                            </v-tab>


                            <v-tab-item>
                                <mos-probe-selector-panel :probeTypes="probeTypes"
                                    v-model="selectedProbeType"
                                />
                            </v-tab-item>


                            <v-tab-item>
                                <mos-probe-settings-panel
                                    v-if="hasProbeTypeSelected"
                                    :probeType="probeTypes[selectedProbeType]"
                                    v-model="probeSettings"
                                />
                            </v-tab-item>

                            <v-tab-item>
                                <cnc-movement-panel />
                            </v-tab-item>

                            <v-tab-item>
                                <v-card>
                                    <v-card-title>Review</v-card-title>
                                    <v-card-text>
                                        {{ probeSettings }}
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
                        </v-tabs>

                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import BaseComponent from "../BaseComponent.vue";
import store from "@/store";

import { default as probeTypes, ProbeCommand } from '../../types/Probe';


import { defineComponent } from 'vue';

export default defineComponent({
    extends: BaseComponent,

    data() {
        return {
            probeTypes: probeTypes,
            selectedProbeType: -1,
            probeSettings: null as ProbeCommand | null,
            tab: 0,
        };
    },
    computed: {
		allAxesHomed(): boolean { return store.state.machine.model.move.axes.every(axis => axis.visible && axis.homed)},
        workCoordinates(): Array<number> { return [...Array(9).keys()].map(i => i + 1); },
        workplaceNumber(): number { return store.state.machine.model.move.workplaceNumber; },
        hasProbeTypeSelected(): boolean { return this.selectedProbeType !== -1; },
        hasProbeSettings(): boolean { return this.probeSettings !== null; }
    },
    methods: {
        nextStep() {
            this.tab++;
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
        workplaceNumber(to: number) {
            this.currentWorkplace = to + 1;
        }
    },
});

</script>
