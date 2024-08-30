<style scoped>
.mos .v-card .probeType {
    min-height: 200px;
}
</style>
<template>
    <v-card>
        <v-container fluid>
            <v-row>
                <v-col v-for="(probeType, k) in probeTypes" cols="3" :key="k">
                    <v-card
                        class="probeType"
                        :color="selectedProbeTypeId == k ? 'warning' : 'primary'"
                        @click="selectProbeType(k)"
                        >
                        <v-card-title>
                            <v-icon large left>{{ probeType.icon }}</v-icon>
                            {{ probeType.name }}
                        </v-card-title>
                        <v-card-text>
                            {{ probeType.description }}
                        </v-card-text>
                    </v-card>

                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>
<script lang="ts">
    import Vue from "vue";

    import store from "@/store";

    export default Vue.extend({
        props: {
            probeTypes: {
                type: Object,
                required: true
            },
        },
        computed: {
            selectedProbeTypeId(): number { return this.value || 0; },
		    uiFrozen(): boolean { return store.getters["uiFrozen"]; },
		    allAxesHomed(): boolean { return store.state.machine.model.move.axes.every(axis => axis.visible && axis.homed)},
        },
        data() {
            return {
                value: -1,
            }
        },
        methods: {
            selectProbeType(index: number) {
                this.value = index;
                this.$emit("update:selectedProbeType", index);
            }
        }
    });
</script>
