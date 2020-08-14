<template>
  <div class="d-flex align-items-center bg-light border p-2 my-1" :class="{'border-secondary': !notification.isRead}">
    <div class="d-flex justify-content-center align-items-center n-controls mr-3">
      <input
        type="checkbox"
        v-model="notification.isSelected"
        :value="notification.isSelected"
        @change="itemSelected"
        class="control-input mr-3"
        id="customCheck1"
      />
      <font-awesome-icon
        v-if="!notification.isRead"
        icon="envelope-open"
        class="actions mr-3"
        @click="markAsRead"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Mark item as read"
      />
      <font-awesome-icon
        v-else
        icon="envelope"
        class="actions mr-3"
        @click="markAsUnread"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Mark item as Unread"
      />
      <font-awesome-icon
        icon="star"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Toggle Importance"
        @click="toggleImportance"
        class="actions"
        :class="{'text-primary': notification.isImportant}"
      />
    </div>
    <span
      class="n-subject mr-3 text-dark"
      :class="{unRead: !notification.isRead}"
    >{{notification.subject}}</span>
    <span class="text-muted n-body">{{notification.body}}</span>
    <span class="n-time ml-3" :class="{unRead: !notification.isRead}">{{notification.formatTime()}}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
import { Notification } from "@/models/Notification";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

@Component({
  components: { FontAwesomeIcon }
})
export default class NotificationItem extends Vue {
  @Prop({ type: Notification, required: true }) notification!: Notification;

  @Emit()
  itemSelected() {
    return this.notification;
  }

  markAsUnread() {
    this.$store.dispatch("markAsUnread", [this.notification]);
    this.$toasted.show('Notification marked as unread');
  }

  markAsRead() {
    this.$store.dispatch("markAsRead", [this.notification]);
    this.$toasted.show('Notification marked as read');
  }

  toggleImportance() {
    if (this.notification.isImportant) {
      this.$store.dispatch("markAsUnImportant", [this.notification]);
      this.$toasted.show('Notification marked as not important');
    } else {
      this.$store.dispatch("markAsImportant", [this.notification]);
      this.$toasted.show('Notification marked as important');
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/scss/_variables";
input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.n-controls {
  flex-basis: 10%;
  font-size: 1rem;
}

.n-subject {
  flex-basis: 25%;
  // text-overflow: ellipsis;
  // white-space: nowrap;
  // overflow: hidden;

  &.unRead {
    font-weight: 900;
  }
}

.n-body {
  flex-basis: 70%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.n-time {
  flex-basis: 17%;
  &.unRead {
    font-weight: bold;
  }
}

.actions {
  color: $gray-600;
  &:hover {
    color: $gray-900;
    cursor: pointer;
  }
}
</style>