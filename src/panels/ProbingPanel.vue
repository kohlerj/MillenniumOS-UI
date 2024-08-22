<template>
    <v-card>
        <v-card-title class="pt-0">
            <v-icon small class="mr-1">mdi-swap-horizontal</v-icon>
            Probing
            <v-spacer />
            <v-select v-model="currentWorkplace" :items="workCoordinates" class="wcs-selection"
                      hint="Work Coordinate System" @change="updateWorkplaceCoordinate" persistent-hint />
        </v-card-title>
        <v-card-text>
            <v-container fluid>
                <v-row>
                    <v-col cols="12" md="3">
                        <v-navigation-drawer permanent width="100%">
                            <v-list-item
                                v-for="probe in probeTypesForMenu"
                                :key="probe.type"
                                link
                                @click="selectedProbe = probe.type"
                                :input-value="selectedProbe === probe.type"
                            >
                                <v-list-item-icon>
                                    <v-icon>{{ probe.icon }}</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{ probe.name }}</v-list-item-title>
                                    <v-list-item-subtitle>{{ probe.desc }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-navigation-drawer>
                    </v-col>
                    <v-col cols="12" md="9">
                        <v-row dense>
                            <v-col cols="12">
                                <mos-bore-probe-panel v-if="selectedProbe === 'bore'" />
                                <mos-boss-probe-panel v-if="selectedProbe === 'boss'" />
                                <mos-rectangle-pocket-probe-panel v-if="selectedProbe === 'rectanglePocket'" />
                                <mos-rectangle-block-probe-panel v-if="selectedProbe === 'rectangleBlock'" />
                                <mos-outside-corner-probe-panel v-if="selectedProbe === 'outsideCorner'" />
                                <mos-vise-corner-probe-panel v-if="selectedProbe === 'viseCorner'" />
                                <mos-single-surface-probe-panel v-if="selectedProbe === 'singleSurface'" />
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import store from "@/store";

export default Vue.extend({
    data() {
        return {
            currentWorkplace: 0,
            selectedProbe: 'bore', // Default selected probe
            probeTypes: [
                { type: 'bore', icon: 'mdi-circle-outline' },
                { type: 'boss', icon: 'mdi-circle' },
                { type: 'rectanglePocket', icon: 'mdi-rectangle-outline' },
                { type: 'rectangleBlock', icon: 'mdi-rectangle' },
                { type: 'outsideCorner', icon: 'mdi-shape-square-plus' },
                { type: 'viseCorner', icon: 'mdi-cube' },
                { type: 'singleSurface', icon: 'mdi-square-opacity' }
            ]
        };
    },
    computed: {
        workCoordinates(): Array<number> { return [...Array(9).keys()].map(i => i + 1); },
        workplaceNumber(): number { return store.state.machine.model.move.workplaceNumber; },
        probeTypesForMenu() {
            return this.probeTypes.map(probe => ({
                ...probe,
                name: this.$t(`plugins.millenniumOS.probeTypes.${probe.type}.menuName`),
                desc: this.$t(`plugins.millenniumOS.probeTypes.${probe.type}.description`)
            }));
        }
    },
    methods: {
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