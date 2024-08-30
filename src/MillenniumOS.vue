<style>
.mos .v-card__title {
    height: 70px;
}

.mos .v-btn-toggle > .v-btn.v-btn {
    opacity: 1 !important;
}
</style>
<template>
    <div class="mos mb-3">
        <v-row>
            <v-col cols="12">
                <mos-job-progress-panel class="mb-2" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" class="pb-0">
                <mos-probing-panel class="mb-2" />
            </v-col>
            <!--
            <v-col cols="3" class="pb-0">
                <mos-safe-movement-panel class="mb-2" />
            </v-col>-->
        </v-row>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({});
</script>