import { createRouter, createWebHistory } from 'vue-router'
import headerVue from '@/views/header_footer/header.vue'
import footerVue from '@/views/header_footer/footer.vue'
import user from '@/views/user.vue'
import addData from '@/views/function/addData.vue'
import updateData from '@/views/function/updateData.vue'
import loginVue from '@/views/logIn_signIn/logIn.vue'
import signInVue from '@/views/logIn_signIn/signIn.vue'
import headerLogInDoneVue from '@/views/header_footer/headerLogInDone.vue'
import showData from '@/views/function/showData.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:uid',
      name: 'home',
      component: showData,
      
    },
    {
      path: '/logIn',
      name: 'logIn',
      component: loginVue
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: signInVue
    },
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
          path: 'update/:uid',
          name: 'update',
          component: updateData
        }
      ]
    }
  ]
})

export default router
