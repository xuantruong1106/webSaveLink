import { vue } from "@vitejs/plugin-vue";
import { createRouter, createWebHistory } from 'vue-router'
import user from '../views/user.vue'
//folder login_sign
import loginVue from '@/views/logIn_signIn/logIn.vue'
import  userInfo  from '@/views/function/userInfo.vue';
import forgotPassword from '@/views/logIn_signIn/forgotPassword.vue'
import signInVue from '@/views/logIn_signIn/signIn.vue'
//folder function dont password
import addData from '../views/function/dontPassword/addData.vue'
import updateData from '@/views/function/dontPassword/updateData.vue'
import showData from '@/views/function/dontPassword/showData.vue'
//folder function need password
import addDataNeedPassword from '../views/function/needPassword/addDataNeedPassword.vue'
import showDataNeedPassword from '../views/function/needPassword/showDataNeedPassword.vue'



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
      path: '/forgotPassword',
      name: 'forgotPassword',
      component: forgotPassword
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
          path: 'add/needPassword/:uid',
          name: 'addNeedPassword',
          component: addDataNeedPassword
        },
        {
          path: 'add-link-one-way-password-required/:uid',
          name: 'add-link-one-way-password-required',
          component: showDataNeedPassword
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
