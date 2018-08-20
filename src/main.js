// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'core-js/es6/promise'
import 'core-js/es6/string'
import 'core-js/es7/array'
// import cssVars from 'css-vars-ponyfill'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'

// todo
// cssVars()

Vue.use(BootstrapVue)

const ENABLE_DEBUG_LOG = true
const ENABLE_ERROR_LOG = true
//csatrio_map_key: 'AIzaSyDgJDQH2ZZLe1QfRL3xbTM_pelGyENJHi8',
//sosro_map_key: 'AIzaSyDSdhIYJ2CC1G0A5xTKB0m2LuX_IzXIJJQ',
// Global mixin for http client
Vue.mixin({
  methods: {
    Log(_msg){
      if(ENABLE_DEBUG_LOG) console.log(_msg)
    },
    LogErr(_msg){
      if(ENABLE_ERROR_LOG) console.error(_msg)
    },
    Get(_url){
      console.log(_url)
    },
    Post(_url, _data){
      console.log('url : ' + _url + '->' + _data);
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
