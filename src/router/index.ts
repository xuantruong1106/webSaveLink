import { vue } from "@vitejs/plugin-vue";
import { createRouter, createWebHistory } from 'vue-router'
import user from '../views/user.vue'
import addData from '../views/function/addData.vue'
import addDataDontPassword from '../views/function/addDataDontPassword.vue'
import updateData from '@/views/function/updateData.vue'
import loginVue from '@/views/logIn_signIn/logIn.vue'
import signInVue from '@/views/logIn_signIn/signIn.vue'
import showData from '@/views/function/showData.vue'
import  userInfo  from '@/views/function/userInfo.vue';
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
          path: 'add/:uid',
          name: 'add',
          component: addData
        },
        {
          path: 'add-link-one-way-password-required/:uid',
          name: 'add-link-one-way-password-required',
          component: addDataDontPassword
        },
        {
          path: 'update/:uid/:idLink',
          name: 'update',
          component: updateData
        },
        {
          path: 'userInfo/:uid',
          name: 'userInfo',
          component: userInfo
        }
      ]
    }
  ]
})

export default router
