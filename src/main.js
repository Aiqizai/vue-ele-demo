import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueAxios from 'vue-axios'
import axios from 'axios'
import vantConfig from './vant.config.js'

Vue.config.productionTip = false

// 给Vue原型属性添加axios
// Vue.prototype.$http = axios
Vue.use(VueAxios, axios) // vue实例对象就多了两个属性 axios $http 都是axios对象

// 使用Vue 插件语法将按需引入的Vant组件全局注册到Vue中
Vue.use(vantConfig)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
