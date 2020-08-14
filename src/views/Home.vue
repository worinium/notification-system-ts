<template>
  <div class="d-flex flex-column justify-content-between h-100 px-2 pt-4 px-sm-3 px-lg-5 mx-2 mx-sm-3 mx-lg-5 mb-5">
    <navbar/>
    <div class="d-flex flex-column mb-5 pb-5">
      <h5>Steven E. Daniel's</h5>
      <h1>ERP Notification Module</h1>
      <span class="font-italic text-primary">You have {{unreadNotificationsCount}} unread notifications</span>
      <small class="font-italic text-muted mb-2">Click the bell icon to access your notifications</small>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/NavBar.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  computed: {
    ...mapGetters(['unreadNotificationsCount'])
  },
  components: {
    Navbar
  }
}
</script>
