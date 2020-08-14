<template>
    <div class="d-flex align-items-center justify-content-between">
      <a>Da ERP Solution</a>
      <notification-bell/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NotificationBell from '@/components/NotificationBell.vue';
export default Vue.extend({
    name: 'Navbar',
    components: {
        NotificationBell
    }
})
</script>

<style lang="scss" scoped>

</style>