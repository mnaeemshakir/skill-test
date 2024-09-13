import { createStore } from 'vuex';

// Create a new Vuex store
const store = createStore({
  state: {
    formDataArray: [], // Array to store multiple form data entries
  },
  mutations: {
    ADD_FORM_DATA(state, formData) {
      const existingFormData = state.formDataArray.find((item) => item.id === formData.id);
      if (existingFormData) {
        Object.assign(existingFormData, formData);
      } else {
        state.formDataArray.push(formData);
      }
    },
    DELETE_FORM_DATA(state, id) {
      state.formDataArray = state.formDataArray.filter((formData) => formData.id !== id);
    },
  },
  actions: {
    addFormData({ commit }, formData) {
      commit('ADD_FORM_DATA', formData);
    },
    deleteItem({ commit }, id) {
      commit('DELETE_FORM_DATA', id);
    },
  },
  getters: {
    getFormDataArray(state) {
      return state.formDataArray;
    },
  },
});

export default store;
