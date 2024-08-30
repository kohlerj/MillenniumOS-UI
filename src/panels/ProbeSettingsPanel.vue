
<template>
    <v-card>
        <v-card-title>{{  probeType.name }}</v-card-title>
        <v-container fluid>
            <v-form ref="probeSettings">
                <v-row>
                    <template v-for="(setting, name, index) in probeType.settings">
                        <v-col cols="6">
                            <v-row>
                                <v-col cols="12" :id="index">
                                    <v-subheader>{{ setting.label ?? 'Unknown' }}</v-subheader>
                                    <v-row v-if="isNumberSetting(setting)">
                                        <v-col cols="10">
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
                                        <v-col cols="2">
                                            <v-text-field
                                                v-model="setting.value"
                                                @input="setting.value = $event"
                                                :suffix = "setting.unit"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row v-else-if="isBooleanSetting(setting)">
                                        <v-col cols="10">
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
                                        <v-col cols="2">
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
                                        <v-col cols="10">
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
                                        <v-col cols="2">
                                            <v-chip
                                                label
                                                :color="getEnumColor(setting.value, -1)"
                                                large
                                                class="px-6"
                                            >
                                                {{ (setting.value in setting.options) ? setting.options[setting.value] : 'Unknown' }}
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
    </v-card>

</template>
<script lang="ts">
    import Vue from "vue";

    import store from "@/store";

    import {ProbeSettingAll, ProbeSettingNumber, ProbeSettings, isBooleanSetting, isEnumSetting, isNumberSetting} from "../types/Probe";


    const colors = ['pink','blue','teal','green','blue-grey','deep-orange','indigo', 'red','purple'];

    export default Vue.extend({
        props: {
            probeType: {
                type: Object,
                required: true
            },
        },
        computed: {
		    uiFrozen(): boolean { return store.getters["uiFrozen"]; },
		    allAxesHomed(): boolean { return store.state.machine.model.move.axes.every(axis => axis.visible && axis.homed)},
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
            }
        }
    });
</script>
