<template>
    <v-card>
        <v-card-title>
            <v-icon large left>{{ probeType.icon }}</v-icon>
            {{ probeType.name }}
        </v-card-title>
        <v-container fluid>
            <v-form ref="probeSettings">
                <v-row>
                    <template v-for="(setting, name, index) in probeType.settings">
                        <v-col cols="12" md="6">
                            <v-row>
                                <v-col :id="index">
                                    <v-subheader>{{ setting.label ?? 'Unknown' }}</v-subheader>
                                    <v-row v-if="isNumberSetting(setting)">
                                        <v-col cols="8" md="10">
                                            <v-slider
                                                v-model="setting.value"
                                                :min="setting.min"
                                                :max="setting.max"
                                                :step="setting.step"
                                                :hint="setting.description"
                                                :prepend-icon="setting.icon"
                                                :disabled="!allowInput(name)"
                                                @input="setting.value = $event"
                                                thumb-label
                                                persistent-hint
                                            >
                                            </v-slider>
                                        </v-col>
                                        <v-col cols="4" md="2">
                                            <v-text-field
                                                v-model="setting.value"
                                                @input="setting.value = $event"
                                                :suffix = "setting.unit"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row v-else-if="isBooleanSetting(setting)">
                                        <v-col cols="8" md="10">
                                            <v-switch
                                                v-model="setting.value"
                                                @change="setting.value = $event"
                                                :hint="setting.description"
                                                :prepend-icon="setting.icon"
                                                :disabled="!allowInput(name)"
                                                persistent-hint
                                            >
                                            </v-switch>
                                        </v-col>
                                        <v-col cols="4" md="2">
                                            <v-chip
                                                :color="setting.value ? 'primary' : 'secondary'"
                                                label
                                                large
                                            >
                                                {{ setting.value ? $t("Enabled") : $t("Disabled") }}
                                            </v-chip>
                                        </v-col>
                                    </v-row>
                                    <v-row v-else-if="isEnumSetting(setting)">
                                        <v-col cols="8" md="10">
                                            <v-icon class="d-inline-block">{{ setting.icon }}</v-icon>
                                                <v-chip
                                                    v-for="(option, i) in setting.options"
                                                    :id="i"
                                                    :color="getEnumColor(i, setting.value)"
                                                    label
                                                    large
                                                    class="mx-2"
                                                    filter
                                                    :input-value="i+1"
                                                    :filter-icon="setting.value == i ? 'mdi-check' : 'mdi-border-radius'"
                                                    @click="setting.value = i"
                                                >
                                                    {{ option }}
                                                </v-chip>
                                        </v-col>
                                        <v-col cols="4" md="2">
                                            <v-chip
                                                label
                                                :color="getEnumColor(setting.value, -1)"
                                                large
                                                class="px-6"
                                            >
                                                {{ (setting.options && setting.value in setting.options) ? setting.options[setting.value] : 'Unknown' }}
                                            </v-chip>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>
                    </template>
                </v-row>
            </v-form>
        </v-container>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="updateProbeSettings()">
                Continue <v-icon>mdi-forward</v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>

</template>
<script lang="ts">
    import Vue, { PropType } from "vue";

    import BaseComponent from "../BaseComponent.vue";

    import { Axis, AxisLetter } from "@duet3d/objectmodel";

    import store from "@/store";

    import {ProbeType, ProbeSettingAll, isBooleanSetting, isEnumSetting, isNumberSetting, ProbeSettingNumber} from "../../types/Probe";

    interface Settings {
        [key: string]: number | boolean;
    }
    const colors = ['pink','blue','teal','green','blue-grey','deep-orange','indigo', 'red','purple'];

    export default BaseComponent.extend({
        props: {
            value: {
                type: Object as PropType<Settings>,
                required: false
            },
            probeType: {
                type: Object as PropType<ProbeType>,
                required: true
            },
        },
        computed: {
		    uiFrozen(): boolean { return store.getters["uiFrozen"]; },
		    allAxesHomed(): boolean { return store.state.machine.model.move.axes.every(axis => axis.visible && axis.homed)},
            visibleAxesByLetter(): { [key in AxisLetter]: Axis } {
                return store.state.machine.model.move.axes.filter(axis => axis.visible).reduce((acc, axis) => {
                    acc[axis.letter] = axis;
                    return acc;
                }, {} as { [key in AxisLetter]: Axis });
            },
        },
        data() {
            return {}
        },
        methods: {
            allowInput( settingName: string | number ): boolean {
                let curSetting = this.probeType.settings[settingName] as ProbeSettingAll;

                // If setting has no condition or refers to itself, always allow input
                if(!curSetting.condition || curSetting.condition === settingName) {
                    return true;
                }

                let conditionSetting = this.probeType.settings[curSetting.condition];

                // Otherwise, allow input if condition is met. Default to true if conditionValue is not defined
                let conditionValue = (typeof curSetting.conditionValue == "undefined")? true : curSetting.conditionValue;
                return conditionSetting.value === conditionValue;
            },
            isNumberSetting: isNumberSetting,
            isBooleanSetting: isBooleanSetting,
            isEnumSetting: isEnumSetting,
            getEnumColor(key: number, current: number): string {
                // Darken the colour if the current value is the same as the key
                return colors[key % colors.length] + (key === current ? ' darken-2' : '');
            },
            updateProbeSettings() {
                // Iterate over each setting in the probeType settings and extract
                // the code and value to send.
                const settings: Settings = {};

                for (const key in this.probeType.settings) {
                    const setting = this.probeType.settings[key] as ProbeSettingAll;
                    // For number settings whose parameter matches an axis letter,
                    // subtract the value from the current position.
                    if(isNumberSetting(setting)) {
                        if (setting.parameter && setting.value) {
                            let value = setting.value;
                            if(this.visibleAxesByLetter[setting.parameter as AxisLetter]) {
                                value = this.absolutePosition[setting.parameter as AxisLetter] - value;
                            }
                            settings[setting.parameter] = value;
                        }
                    }
                }
                this.$emit("input", settings);

            }
        }
    });
</script>
