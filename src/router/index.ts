import { createRouter, createWebHistory } from 'vue-router'
import headerVue from '@/views/header_footer/header.vue'
import footerVue from '@/views/header_footer/footer.vue'
import user from '@/views/user.vue'
import addData from '@/views/function/addData.vue'
import showData from '@/views/function/showData.vue'
import updateData from '@/views/function/updateData.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: showData,
      
      
    },
    // {
    //   path: '/headrVue',
    //   name: 'headerVue',
    //   component: headerVue
    // },
    // {
    //   path: '/footerVue',
    //   name: 'footerVue',
    //   component: footerVue
    // },
    {
      path: '/user/',
      name: 'user/',
      component: user,
      children: [
        {
          path: 'add',
          name: 'add',
          component: addData
        },
        {
          path: 'update',
          name: 'update',
          component: updateData
        },
      ]

    }
  ]
})

export default router
