import Vue from 'vue'
import store from '../store'

Vue.directive('has', {
  bind: function(el, binding) {
    const buttons = store.getters.buttons
    if (buttons.indexOf(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
})
