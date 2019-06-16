
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/welcome', component: () => import('pages/welcome.vue') },
      { path: '/course', component: () => import('pages/course/index.vue') },
      { path: '/course/type', component: () => import('pages/course/type/index.vue') },
      { path: '/seat', component: () => import('pages/seat/index.vue') },
      { path: '/restaurant', component: () => import('pages/restaurant/index.vue') },
      { path: '/cart', component: () => import('pages/cart/index.vue') },
      { path: '/order', component: () => import('pages/order/index.vue') },
      { path: '/login', component: () => import('pages/login/index.vue') },
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
