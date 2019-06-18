import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

//结合vue-axios全局使用axios
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAuth from '@websanova/vue-auth'

//global axios defaults
axios.defaults.baseURL = 'http://localhost:8081'
// axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN'
Vue.use(VueAxios,axios)

Vue.use(VueRouter)

Vue.router = new VueRouter({})
 // 配置vue-auth认证
  /** 开始 */
  Vue.use(VueAuth, {
    auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
    http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
    router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
    keycloakOauth2Data: {
      url: 'http://localhost:8080/auth/realms/master/protocol/openid-connect/auth',
      params: {
        redirect_uri: function () { return this.options.getUrl() + '/login'; },
        client_id: 'sky'
      },
      response_type: 'token'
    },
    refreshData: {enabled: false},
  })
  /** 结束 */
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes,
  
    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: 'history', //process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })
  Vue.router = Router
  return Router
}
