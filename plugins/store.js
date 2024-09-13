// plugins/vuex.js
import { createStore } from 'vuex';

export default defineNuxtPlugin((nuxtApp) => {
  const store = createStore({
    state: {
      formDataArray: [],
    },
    mutations: {
      ADD_FORM_DATA(state, formData) {
        console.log('ADD_FORM_DATA', formData);
        const existingFormData = state.formDataArray.find((item) => item.id === formData.id);
        if (existingFormData) {
            console.log('existingFormData', existingFormData);
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
        console.log('deleteItem', id);
        commit('DELETE_FORM_DATA', id);
      },
    },
    getters: {
      getFormDataArray(state) {
        return state.formDataArray;
      },
    },
  });

  nuxtApp.vueApp.use(store);
});
