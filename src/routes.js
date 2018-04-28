import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import bill from './views/bill/bill.vue'
import goodsList from './views/goods/goodsList.vue'
import courierList from './views/courier/courierList.vue'
import system from './views/system/system.vue'
import slide from './views/system/slide.vue'
import mealBox from './views/system/mealBox.vue'
import orders from './views/orders/orders.vue'
import ordersInfo from './views/orders/ordersInfo.vue'
import shopInfo from './views/shops/shopInfo.vue'
import shopAdmin from './views/shops/shopAdmin.vue'
import shopFilter from './views/shops/shopFilter.vue'
import sites from './views/site/sites.vue'
import siteinfo from './views/site/siteinfo.vue'
import userList from './views/users/userList.vue'
import ceshi from './views/demo/ceshi.vue'




let routes = [
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  //{ path: '/main', component: Main },
  {
    path: '/',
    component: Home,
    name: '--',
    hidden: true,
    iconCls: 'el-icon-message',//图标样式class
    children: [
      {path: '/main', component: Main, name: '主页', hidden: true}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '店铺管理',
    iconCls: 'fa fa-shopping-bag',
    children: [
      {path: '/shopInfo', component: shopInfo, name: '商铺'},
      {path: '/goodsList', component: goodsList, name: '商品'},
      {path: '/shopsInfo/shopAdmin/:id', component: shopAdmin, name: '商家管理员', hidden: true},
      {path: '/shopFilter/:id', component: shopFilter, name: '食堂分类', hidden: true},
    ]
  },
  {
    path: '/',
    component: Home,
    name: '用户管理',
    leaf: true,
    iconCls: 'fa fa-users',//图标样式class
    children: [
      {path: '/userList', component: userList, name: '用户管理'},
      
    ]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-reorder',
    leaf: true,//只有一个节点
    children: [
      //{path: '/orders/:id', component: orders, name: '订单管理'},
      {path: '/orders', component: orders, name: '订单管理'},
      {path: '/ordersInfo/:id', component: ordersInfo, name: '订单详情'}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-truck',
    leaf: true,//只有一个节点
    children: [
      {path: '/courierList', component: courierList, name: '配送员管理'}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-university',
    leaf: true,//只有一个节点
    children: [
      {path: '/sites', component: sites, name: '校区管理'},
      {path: '/siteinfo/:id', component: siteinfo, name: '宿舍管理'}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-balance-scale',
    leaf: true,//只有一个节点
    children: [
      {path: '/bill', component: bill, name: '账单管理'},
    ]
  },
  {
    path: '/',
    component: Home,
    name: '平台管理',
    iconCls: 'fa fa-cogs',
    children: [
      {path: '/slide', component: slide, name: '轮播图设置'},
      {path: '/system', component: system, name: '运维人员'},
      {path: '/mealBox', component: mealBox, name: '餐盒费设置'},
    ]
  },
  {
    path: '/',
    component: Home,
    name: '测试',
    hidden: true,
    iconCls: 'fa fa-cogs',
    children: [
      {path: '/ceshi', component: ceshi, name: '测试'},
    ]
  },
  {
    path: '*',
    hidden: true,
    redirect: {path: '/404'}
  }
];

export default routes;