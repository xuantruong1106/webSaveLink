<template>
  <nav class="navbar" role="navigation" aria-label="main navigation" >
    <div class="navbar-brand">
      <a class="navbar-item" href="http://xtruongweb.ihostfull.com/">
        <img
          src="public\links-low-resolution-logo-color-on-transparent-background.svg"
          width="112"
          height="28"
        />
      </a>

      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        <a class="navbar-item">
          <Router-link :to="{ path: '/' }">Home</Router-link>
        </a>
      </div>

      <!-- <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-primary">
              <strong>Sign up</strong>
            </a>
            <a class="button is-light"> Log in </a>
          </div>
        </div>
      </div> -->
      <div v-if="name">
        <strong> {{name}} </strong>
        <strong> || logOut </strong>
      </div>
    </div>
    <div v-if="!name">
      <strong> logIn </strong>
      <strong> SignIn </strong>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Auth1 } from '@/configs/firebase';
import { onAuthStateChanged } from 'firebase/auth';
const name = ref('')
onAuthStateChanged(Auth1, (user) => {
  if (user) {
    // Người dùng đã đăng nhập
    name.value = user.displayName
      console.log(user.displayName)
    console.log('Người dùng đã đăng nhập:', user)
  } else {
    // Người dùng chưa đăng nhập
    console.log('Người dùng chưa đăng nhập')
  }

  
})
</script>

<style></style>
