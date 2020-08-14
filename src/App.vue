<template>
  <div
    v-if="isGettingNotifications"
    class="d-flex flex-column mt-5 justify-content-center align-items-center"
  >
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
    <h5>Fetching Notifications...</h5>
  </div>
  <div class="h-100" v-else>
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faFilter,
  faAngleDown,
  faAngleRight,
  faEnvelopeOpen,
  faStar,
  faTrashAlt,
  faFrownOpen,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";
import Toasted from 'vue-toasted';
import VModal from 'vue-js-modal';

library.add(faAngleLeft);
library.add(faFilter);
library.add(faAngleDown);
library.add(faAngleRight);
library.add(faEnvelopeOpen);
library.add(faStar);
library.add(faTrashAlt);
library.add(faFrownOpen);
library.add(faEnvelope);

Vue.use(Toasted, { duration: 5000, position: "bottom-right", });
Vue.use(VModal)

export default Vue.extend({
  name: "App",
  created() {
    this.$store.dispatch("getNotifications");
  },
  computed: {
    ...mapGetters(["isGettingNotifications", "readNotifications"])
  }
});
</script>

<style lang="scss">
@import "@/scss/main.scss";
</style>
