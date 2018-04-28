import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import routes from './routes'
import 'font-awesome/css/font-awesome.min.css'
//导入vue-resource
import  VueResource  from 'vue-resource'
import moment from 'moment'


Vue.use(VueResource)
Vue.use(ElementUI)
Vue.use(VueRouter)



const router = new VueRouter({
  routes
})

// router.beforeEach((to, from, next) => {
//   //NProgress.start();
//   if (to.path == '/login') {
//     sessionStorage.removeItem('user');
//   }
//   let user = JSON.parse(sessionStorage.getItem('user'));
//   if (!user && to.path != '/login') {
//     next({ path: '/login' })
//   } else {
//     next()
//   }
// })
router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('data');
  }
  let user = JSON.parse(sessionStorage.getItem('data'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})


Vue.filter('dateFormat',function(input,fmtString){
  return moment(input).format(fmtString)
})

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  //store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

