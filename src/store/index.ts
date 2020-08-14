import Vue from 'vue'
import Vuex from 'vuex'
import { Notification, NotificationInterface, filterTypes } from '@/models/Notification'
import { SET_NOTIFICATIONS, SET_LOADING, UNSET_LOADING, TOGGLE_READ_STATUS, TOGGLE_IMPORTANT_STATUS, SET_SEARCH_KEYWORD, DELETE_NOTIFICATION, SET_FILTER, SET_PAGE } from '@/store/mutation-types'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    notifications: Array<Notification>(),
    isGettingNotifications: true,
    currentPage: 1,
    filterType: filterTypes.All,
    total: 0,
    pageLimit: 30,
    searchKeyword: '',
  },

  getters: {
    isGettingNotifications: state => state.isGettingNotifications,
    allNotifications: state => state.notifications,
    unreadNotifications: state => state.notifications.filter(notification => !notification.isRead),
    readNotifications: state => state.notifications.filter(notification => notification.isRead),
    importantNotifications: state => state.notifications.filter(notification => notification.isImportant),
    unimportantNotifications: state => state.notifications.filter(notification => !notification.isImportant),
    unreadNotificationsCount: state => state.notifications.filter(notification => !notification.isRead).length,
    notifications: (state, getters) => {
      const offset = (state.currentPage - 1) * state.pageLimit;
      switch (state.filterType) {
        case filterTypes.All:
          return state.notifications.slice(offset).slice(0, state.pageLimit);
        case filterTypes.Unread:
          return state.notifications.filter(notification => !notification.isRead).slice(offset).slice(0, state.pageLimit);
        case filterTypes.Read:
          return state.notifications.filter(notification => notification.isRead).slice(offset).slice(0, state.pageLimit);
        case filterTypes.Important:
          return state.notifications.filter(notification => notification.isImportant).slice(offset).slice(0, state.pageLimit);
        case filterTypes.Search:
          return state.notifications.filter(notification => notification.subject.toLowerCase().includes(getters.searchKeyword.toLowerCase()) ||
          notification.body.toLowerCase().includes(getters.searchKeyword.toLowerCase())).slice(offset).slice(0, state.pageLimit);
      }
    },
    currentPage: state => state.currentPage,
    total: state => {
      switch (state.filterType) {
        case filterTypes.All:
          return state.notifications.length;
        case filterTypes.Unread:
          return state.notifications.filter(notification => !notification.isRead).length;
        case filterTypes.Read:
          return state.notifications.filter(notification => notification.isRead).length;
        case filterTypes.Important:
          return state.notifications.filter(notification => notification.isImportant).length;
      }
    },

    searchKeyword: state => state.searchKeyword,

    pageCount: state => {
      switch (state.filterType) {
        case filterTypes.All:
          return Math.ceil(state.notifications.length / state.pageLimit);
        case filterTypes.Unread:
          return Math.ceil(state.notifications.filter(notification => !notification.isRead).length / state.pageLimit);
        case filterTypes.Read:
          return Math.ceil(state.notifications.filter(notification => notification.isRead).length / state.pageLimit);
        case filterTypes.Important:
          return Math.ceil(state.notifications.filter(notification => notification.isImportant).length / state.pageLimit);
      }
    },

    filterType: state => state.filterType,
  },

  mutations: {
    [SET_FILTER](state, payload) {
      state.filterType = payload;
    },

    [SET_NOTIFICATIONS](state, payload) {
      state.notifications = payload;
    },

    [SET_LOADING](state) {
      state.isGettingNotifications = true;
    },

    [UNSET_LOADING](state) {
      state.isGettingNotifications = false;
    },

    [TOGGLE_READ_STATUS](state, payload) {
      let currentNotifications: Array<Notification> = state.notifications;
      currentNotifications = currentNotifications.map(notification => {
        const item: Notification = payload.data.find((payloadItem: Notification) => (payloadItem.id == notification.id));
        if (item) {
          payload.read ? item.markAsRead() : item.markAsUnread();
          return item;
        } else {
          return notification;
        }
      });
      state.notifications = currentNotifications;
    },

    [TOGGLE_IMPORTANT_STATUS](state, payload) {
      let currentNotifications: Array<Notification> = state.notifications;
      currentNotifications = currentNotifications.map(notification => {
        const item: Notification = payload.data.find((payloadItem: Notification) => (payloadItem.id == notification.id));
        if (item) {
          payload.important ? item.markAsImportant() : item.markAsUnImportant();
          return item;
        } else {
          return notification;
        }
      });
      state.notifications = currentNotifications;
    },

    [DELETE_NOTIFICATION](state, payload: Notification[]) {
      const currentNotifications: Array<Notification> = state.notifications;
      payload.forEach(payloadItem => {
        const index = currentNotifications.findIndex(notification => notification.id == payloadItem.id);
        if (index > -1) {
          currentNotifications.splice(index, 1);
        }
      });
      state.notifications = currentNotifications;
    },

    [SET_PAGE](state, payload) {
      state.currentPage = payload
    },

    [SET_SEARCH_KEYWORD](state, payload) {
      state.searchKeyword = payload;
    }
  },

  actions: {
    async getNotifications({ commit }) {
      commit(SET_LOADING);
      const jsonDB = await import('@/db/notifications.json');
      const notifications = jsonDB.default;
      const notificationModels = notifications.map((notification: NotificationInterface) => {
        return new Notification(notification);
      });
      notificationModels.sort((a, b) => b.timeSent.getTime() - a.timeSent.getTime())
      commit(SET_NOTIFICATIONS, notificationModels);

      //little delay to make if feel like a network call.
      setTimeout(() => {
        commit(UNSET_LOADING);
      }, 2000);
    },

    markAsRead({ commit }, payload) {
      commit(TOGGLE_READ_STATUS, { data: payload, read: true });
    },

    markAsUnread({ commit }, payload) {
      commit(TOGGLE_READ_STATUS, { data: payload, read: false });
    },

    markAsImportant({ commit }, payload) {
      commit(TOGGLE_IMPORTANT_STATUS, { data: payload, important: true });
    },

    markAsUnImportant({ commit }, payload) {
      commit(TOGGLE_IMPORTANT_STATUS, { data: payload, important: false })
    },

    deleteNotifications({ commit }, payload) {
      commit(DELETE_NOTIFICATION, payload);
    },

    setFilter({ commit }, payload) {
      commit(SET_FILTER, payload);
    },

    previousPage({ commit, getters }) {
      commit(SET_PAGE, getters.currentPage - 1);
    },

    nextPage({ commit, getters }) {
      commit(SET_PAGE, getters.currentPage + 1);
    },

    resetPage({ commit }) {
      commit(SET_PAGE, 1);
    },

    setSearchKeyword({commit}, payload){
      commit(SET_SEARCH_KEYWORD, payload);
    }
  },
})
