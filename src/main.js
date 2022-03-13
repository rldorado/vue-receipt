import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'

// Import Material UI
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/black-green-light.css'

// Import i18n
import i18n from './i18n'

Vue.use(VueMaterial);

Vue.config.productionTip = false

new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')
