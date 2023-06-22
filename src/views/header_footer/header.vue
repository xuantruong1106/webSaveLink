<template>
  <nav class="navbar block is-full-desktop" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="http://xtruongweb.ihostfull.com/">
        <div class="container">
          <img
            src="public\links-low-resolution-logo-color-on-transparent-background.svg"
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
          <RouterLink :to="{ path: '/' }">Home</RouterLink>
        </a>
      </div>

      <div class="navbar-item">
        <div class="navbar-end" v-if="isUserLoggedIn">
          <div class="buttons">
            <a class="button is-primary is-flex">
              <strong>{{ name }} </strong>
            </a>
            <button class="button is-light" @click.prevent="handleLogout()">LogOut</button>
          </div>
        </div>
      </div>
      <div class="navbar-end" v-if="!isUserLoggedIn">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-primary">
              <RouterLink to="/logIn">
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
  </nav>
</template>
<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Auth1, db } from '@/configs/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { collection, query, where, getDocs } from '@firebase/firestore'

let name = ref('')
const route = useRoute().params.uid
const router = useRouter()
let isUserLoggedIn = ref(false) // Initialize with false

// displayname for google
onAuthStateChanged(Auth1, (user) => {
  if (user) {
    // Người dùng đã đăng nhập
    console.log('Người dùng đã đăng nhập:', user)
    isUserLoggedIn.value = true
    name.value = user.displayName

    // onMounted(async () => {
    //   const q = query(collection(db, 'info'), where('uid', '==', route))
    //   const querySnapshotOrder = await getDocs(q)
    //   querySnapshotOrder.forEach((doc) => {
    //     name.value = doc.data().fullname
    //   })
    //   console.log(name.value)
    // })
  } else {
    // Người dùng chưa đăng nhập
    console.log('Người dùng chưa đăng nhập')
    isUserLoggedIn.value = false
    console.log('Người dùng chưa đăng nhập')
    router.push({
      path: '/logIn'
    })
  }
})

// logOut
const handleLogout = () => {
  signOut(Auth1)
    .then(() => {
      // Logout successful
      location.reload()
      console.log('Logout successful')
    })
    .catch((error) => {
      // An error occurred during logout
      console.error('Logout error:', error)
    })
}
</script>

<!-- <script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Auth1, db } from '@/configs/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { collection, query, where, getDocs } from '@firebase/firestore'

let name = ref('')
const route = useRoute().params.uid
let uid = ref(Auth1.currentUser).value?.uid
let isUserLoggedIn = true

//displayname for google
onAuthStateChanged(Auth1, (user) => {
  if (user) {
    // Người dùng đã đăng nhập
    console.log('Người dùng đã đăng nhập:', user)
    isUserLoggedIn = true
    name.value = user.displayName

    onMounted(async () => {
      const q = query(collection(db, 'info'), where('uid', '==', route))
      const querySnapshotOrder = await getDocs(q)
      querySnapshotOrder.forEach((doc) => {
        name.value = doc.data().fullname
      })
      console.log(name.value)
    })
  } else {
    // Người dùng chưa đăng nhập
    console.log('Người dùng chưa đăng nhập')
    isUserLoggedIn = false
    console.log('Người dùng chưa đăng nhập')
    router.push({
      path: '/logIn'
    })
  }
})

//lognOut
const handleLogout = () => {
  signOut(Auth1)
    .then(() => {
      // Logout successful
      location.reload()
      console.log('Logout successful')
    })
    .catch((error) => {
      // An error occurred during logout
      console.error('Logout error:', error)
    })
}
</script>

<style></style> -->
