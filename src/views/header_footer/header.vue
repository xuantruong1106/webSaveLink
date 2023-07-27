<template>
  <nav class="navbar block is-full-desktop" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="http://xtruongweb.ihostfull.com/">
        <div class="container">
          <img
            src="https://drive.google.com/uc?id=1zPF32FxuxMrlsvutyWSieLk3c1T0mk2P"
            width="112"
            height="28"
            class="is-fullwidth"
          />
        </div>
      </a>
    </div>

    <div class="navbar-menu is-flex">
      <div class="navbar-start">
        <a class="navbar-item">
          <RouterLink :to="{ path: '/home/' + uid }">Home</RouterLink>
        </a>
      </div>

      <div class="navbar-item">
        <div class="navbar-end" v-if="isUserLoggedIn">
          <div class="buttons">
            <router-link :to="{ path: '/user/userInfo/' + uid }" class="button is-primary is-size-5" >
              {{ name }}
            </router-link>
            <button class="button is-light is-size-5" @click.prevent="handleLogout()">Logout</button>
          </div>
        </div>
      </div>
      <div class="navbar-end" v-if="!isUserLoggedIn">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-primary">
              <RouterLink to="/">
                <p>LogIn</p>
              </RouterLink>
            </a>
            <a class="button is-light">
              <RouterLink to="/signIn">
                <p>SignIn</p>
              </RouterLink>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- Add email verification notification -->
    <div v-if="isUserLoggedIn && isEmailVerified == false" class="navbar-end">
      <div class="navbar-item">
        <div class="notification is-danger">bạn chưa xác thực email, kiểm tra hộp thư email</div>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Auth1} from '../../configs/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
let name = ref('')
let isUserLoggedIn = ref(false) // Initialize with false
let isEmailVerified = ref(false)
let uid = ''
// displayname for google
onAuthStateChanged(Auth1, (user) => {
  if (user) {
    // Người dùng đã đăng nhập
    isUserLoggedIn.value = true
    name.value = user.displayName ?? '' // Provide default value of empty string
    isEmailVerified.value = user.emailVerified
    uid = user.uid
  } else {
    // Người dùng chưa đăng nhập
    console.log('Người dùng chưa đăng nhập')
    isUserLoggedIn.value = false
    console.log('Người dùng chưa đăng nhập')
    
  }
})

// logOut
const handleLogout = () => {
  signOut(Auth1)
    .then(() => {
      // Logout successful
      console.log('Logout successful')
      router.push({path: '/'})
    })
    .catch((error) => {
      // An error occurred during logout
      console.error('Logout error:', error)
    })
}
</script>
