import Vue from 'vue'
import VueRouter from 'vue-router'
import GoodsView from '../views/goods_view/GoodsView'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Goods',
    component: GoodsView,
    children: [
      {
        path: 'detail', 
        name: 'Detail',
        props: true,
        component: () => import('../views/goods_view/good_detail_view/GoodDetailView')
      }
    ]
  },
  {
    path: '/rating',
    name: 'Rating',
    component: () => import('../views/RatingView.vue')
  },
  {
    path: '/seller',
    name: 'Seller',
    component: () => import('../views/SellerView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/ele',
  linkExactActiveClass: 'active',
  routes
})

export default router
