<template>
  <div class="d-flex flex-column py-4 px-2 px-sm-3 px-lg-5 mx-2 mx-sm-3 mx-lg-5">
    <div class="d-flex align-items-center justify-content-between">
      <a class="back-icon"  @click="goBack">
        <font-awesome-icon  class="back-icon" icon="angle-left" size="lg" />
        <span class="ml-2">Go back</span>
      </a>
      <notification-bell/>
    </div>

    <div class="row justify-content-md-between align-items-md-center mt-4">
      <div class="col-md-4 col-12">
        <h2>Notifications</h2>
      </div>
      <div class="col-md-8 col-12">
        <div class="row justify-content-md-end mx-md-auto">
          <div class="col-8">
            <input
              class="form-control"
              v-model="searchKeyword"
              @keyup="searchNotifications"
              type="text"
              placeholder="Type keyword"
            />
          </div>
          <div
            class="d-flex justify-content-between bg-white border col-4 sort py-1"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <div>
              <font-awesome-icon icon="filter" />
              <span class="ml-2">{{filterType}}</span>
            </div>
            <div class="border-left pl-2 py-auto">
              <font-awesome-icon icon="angle-down" />
            </div>
          </div>
          <div class="dropdown-menu dropdown-menu-right col-4">
          <div v-for="(filterType, index) in filterTypes" :key="index">
            <button
              v-if="filterType != 'Search'"
              class="dropdown-item"
              type="button"
              @click="filter(filterType)"
            >{{filterType}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex mt-3 align-items-center py-1">
      <input @change="toggleSelectAll" v-model="allSelected" type="checkbox" class="control-input mr-3" id="customCheck1" />
      <div class="flex-grow-1 d-flex align-items-center">
        <div class="d-flex">
          <font-awesome-icon
            icon="envelope-open"
            class="actions"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Mark all selected items as read"
            @click="markSelectedItemsAsRead"
          />
          <font-awesome-icon
            class="mx-3 actions"
            icon="star"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Mark all selected items as important"
            @click="markSelectedItemsAsImportant"
          />
          <font-awesome-icon
            icon="trash-alt"
            class="actions"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Delete all selected items"
            @click="showDeleteConfirmation"
          />
        </div>
      </div>
      <div v-if="filterType != 'Search'" class="pagination-container">
        <div class="d-none d-md-inline">
          <span>Showing</span>
          <span class="mx-2">{{getIndex(notifications[0])}} - {{getIndex(notifications[notifications.length -1])}}</span>
          <span class="mr-2">of</span>
          <span>{{total}}</span>
        </div>
        <button class="btn mx-1" @click="previousPage" :disabled="currentPage == 1">
          <font-awesome-icon icon="angle-left" size="lg" class="pagination-control" />
        </button>
        <button class="btn ml-1" @click="nextPage" :disabled="currentPage == pageCount">
          <font-awesome-icon icon="angle-right" size="lg" class="pagination-control"/>
        </button>
      </div>
    </div>

    <div v-if="notifications.length > 0" class="mt-3" >
      <div v-for="(notification, index) in notifications" :key="index">
        <notification-item :notification="notification" @item-selected="itemSelected"></notification-item>
      </div>
    </div>
    <div class="d-flex flex-column align-items-center justify-content-center py-5 my-5" v-else>
      <h3 class="">No Results.</h3>
      <span class="text-muted font-italic">It appears there's no notification matching your search.</span>
    </div>

    <modal name="deleteConfirmation">
      <div class="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
        <h4>Hello, there.</h4>
        <p>Please confirm your decision to delete the selected notification(s).</p>
        <div class="mt-2">
          <button @click="confirmDelete" class="btn btn-primary mr-3">Yeah, I have decided</button>
          <button @click="cancelDelete" class="btn btn-outline-secondary mr-3 text-dark">No, I don't know what i'm doing</button>
        </div>
      </div>
    </modal>
  </div>
</template>


<script lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import NotificationItem from "@/components/NotificationItem.vue";
import { Notification, filterTypes } from "@/models/Notification";
import NotificationBell from "@/components/NotificationBell.vue";

@Component({
  components: { FontAwesomeIcon, NotificationItem, NotificationBell },
  computed: {
    ...mapGetters([
      "allNotifications",
      "unreadNotifications",
      "readNotifications",
      "importantNotifications",
      "notifications",
      "currentPage",
      "total",
      "pageCount",
      "filterType"
    ])
  }
})
export default class Notifications extends Vue {
  allNotifications!: Array<Notification>;
  readNotifications!: Array<Notification>;
  unreadNotifications!: Array<Notification>;
  importantNotifications!: Array<Notification>;
  notifications!: Array<Notification>;
  selectedNotifications: Array<Notification> = [];
  filterTypes = filterTypes;
  filterType!: string;
  searchKeyword = "";
  allSelected = false;
  total!: number;
  currentPage!: number;
  pageCount!: number;

  goBack() {
    this.$router.go(-1);
  }

  nextPage(){
    this.$store.dispatch('nextPage');
  }

  previousPage(){
    this.$store.dispatch('previousPage');
  }
  
  //used to show the current number of notification showing
  getIndex(notification: Notification){
    switch (this.filterType) {
      case filterTypes.Read:
        return this.readNotifications.indexOf(notification) + 1;
      case filterTypes.All:
        return this.allNotifications.indexOf(notification) + 1;
      case filterTypes.Unread:
        return this.unreadNotifications.indexOf(notification) + 1;
      case filterTypes.Important:
        return this.importantNotifications.indexOf(notification) + 1;
    }
  }

  filter(filterType: string) {
    //Remove all selections
    this.allSelected = false;
    this.toggleSelectAll();

    this.$store.dispatch('resetPage');
    this.$store.dispatch('setFilter', filterType);
  }

  searchNotifications() {
    console.log(this.filterType);
    if(this.searchKeyword != ''){
      this.$store.dispatch('setSearchKeyword', this.searchKeyword);
      this.$store.dispatch('setFilter', filterTypes.Search);
    } else {
      this.$store.dispatch('setFilter', filterTypes.All);
    }
  }

  showDeleteConfirmation(){
    if(this.selectedNotifications.length > 0){
      this.$modal.show('deleteConfirmation', this.selectedNotifications);
    } else {
      this.$toasted.error('Select the notifications you want to delete');
    }
  }

  confirmDelete(){
    this.$modal.hide('deleteConfirmation');
    this.$store.dispatch('deleteNotifications', this.selectedNotifications);

    this.selectedNotifications.forEach(notification => {
        notification.isSelected = false;
    });

    this.selectedNotifications = [];
    this.allSelected = false;
    this.$toasted.show('Notifications have been deleted succesfully');
  }

  cancelDelete(){
    this.$modal.hide('deleteConfirmation');
  }


  toggleSelectAll(){
    if(this.allSelected){
      this.notifications.forEach(notification => {
        this.addToSelection(notification);
      })
    } else {
      this.notifications.forEach(notification => {
        this.removeFromSelection(notification);
      })
    }
  }

  addToSelection(item: Notification){
    item.isSelected = true;
    const index = this.selectedNotifications.findIndex(notification => notification.id == item.id);
    if(index == -1){
      this.selectedNotifications.push(item);
    }
  }

  removeFromSelection(item: Notification){
    const index = this.selectedNotifications.findIndex(notification => notification.id == item.id);
    if(index > -1){
      item.isSelected = false;
      this.selectedNotifications.splice(index, 1);
    }
  }

  markSelectedItemsAsRead(){
      if(this.selectedNotifications.length > 0){
        this.$store.dispatch('markAsRead', this.selectedNotifications);
        this.$toasted.show(`${this.selectedNotifications.length} notification(s) marked as read`);
      } else {
        this.$toasted.error('Select the notifications you want to mark as read');
      }
  }


  //this event is called from a notification-item
  itemSelected(item: Notification){
    /**
     * isSelected is the v-model for the checkbox input
     * the same checkbox input is what calls this event
     * value of isSelected is swapped before this event is ran.
     */
    if(!item.isSelected){
      this.removeFromSelection(item);
    } else {
      this.addToSelection(item);
    }
    
  }

  markSelectedItemsAsImportant(){
     if(this.selectedNotifications.length > 0){
        this.$store.dispatch('markAsImportant', this.selectedNotifications);
        this.$toasted.show(`${this.selectedNotifications.length} notification(s) marked as Important`);
      } else {
        this.$toasted.error('Select the notifications you want to mark as important');
      }
  }
}
</script>


<style lang="scss" scoped>
@import "@/scss/main";
.back-icon {
  &:hover {
    cursor: pointer;
  }
}

input[type="checkbox"] {
  width: 16px; /*Desired width*/
  height: 16px; /*Desired height*/
}

.actions {
  color: $gray-600;
  &:hover {
    color: $gray-900;
    cursor: pointer;
  }
}

.sort {
  border-radius: 2px;
  width: 200px;
}

.pagination-container {
  font-style: italic;
}

.pagination-control {
  cursor: pointer;
}

::-webkit-input-placeholder {
  font-style: italic;
}
:-moz-placeholder {
  font-style: italic;
}
::-moz-placeholder {
  font-style: italic;
}
:-ms-input-placeholder {
  font-style: italic;
}
</style>