<style scoped>
    .probeTypeFull .v-card {
        min-height: 200px;
    }
</style>
<template>
        <v-container fluid :class="!mustExpandProbeDetails ? 'probeTypeFull' : 'probeTypeCollapsed'">
            <v-row>
                <v-col v-for="(probeType, k) in probeTypes" cols="12" lg="3" md="6" :key="k">
                    <v-card
                        :color="selectedProbeTypeId == k ? 'warning' : 'primary'"
                        @click="!mustExpandProbeDetails && selectProbeType(k)"
                        >
                        <v-card-title>
                        </v-card-title>
                        <template v-if="mustExpandProbeDetails">
                            <v-card-actions>
                                <v-btn
                                    @click="selectProbeType(k)">
                                Select <v-icon>mdi-forward</v-icon>
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn
                                    @click="toggleDetails(k)"
                                >
                                    Details <v-icon>{{ shouldShowDetails(k) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                                </v-btn>
                            </v-card-actions>
                            <v-expand-transition>
                                <div v-show="shouldShowDetails(k)">
                                    <v-divider></v-divider>
                                    <v-card-text>{{ probeType.description }}</v-card-text>
                                </div>
                            </v-expand-transition>
                        </template>
                        <v-card-text v-else>
                            <v-icon large left>{{ probeType.icon }}</v-icon>
                            {{ probeType.name }}
                            {{ probeType.description }}
                        </v-card-text>
                    </v-card>

                </v-col>
            </v-row>
        </v-container>
</template>
<script lang="ts">
    import BaseComponent from "../BaseComponent.vue";

    import store from "@/store";

    interface Data {
        selectedProbeId: number;
        expandedTypeDetails: number[];
    }

    import { defineComponent } from 'vue';

    export default defineComponent({
        extends: BaseComponent,

        props: {
            value: {
                type: Number,
                required: false
            },
            probeTypes: {
                type: Object,
                required: true
            },
        },
        computed: {
            selectedProbeTypeId(): Number { return this.selectedProbeId; },
		    uiFrozen(): boolean { return store.getters["uiFrozen"]; },
		    allAxesHomed(): boolean { return store.state.machine.model.move.axes.every(axis => axis.visible && axis.homed)},
            mustExpandProbeDetails(): boolean {
                 return this.$vuetify.breakpoint.mdAndDown;
            },
        },
        data(): Data {
            return {
                selectedProbeId: -1,
                expandedTypeDetails: [],
            }
        },
        mounted() {
            this.selectedProbeId = -1;
        },
        methods: {
            toggleDetails(index: number): void {
                if(!this.expandedTypeDetails.includes(index)) {
                    this.expandedTypeDetails.push(index);
                } else {
                    this.expandedTypeDetails = this.expandedTypeDetails.filter(i => i !== index);
                }
            },
            shouldShowDetails(index: number): boolean {
                return this.expandedTypeDetails.includes(index);
            },
            selectProbeType(index: number) {
                this.selectedProbeId = index;
                this.$emit('input', index);
            }
        }
    });
</script>
