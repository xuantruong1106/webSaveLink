<template>
  <!-- <div class="formLogIn">
    <form @submit.prevent="handleSubmit">
      <div class="field has-addons">
        <div class="control">
          <input class="input" type="text" placeholder="Email" v-model="email" />
          <input class="input" type="password" placeholder="PassWord" v-model="password" />
          <button type="submit" class="button is-info">Log In</button>
        </div>
      </div>
    </form>
    <br />
    <div>
      <button @click="signInWithGoogle" class="btn1 button is-link" id="is-link">
        Log in with Google
      </button>
    </div>
  </div> -->
  <div class="column is-6-desktop is-offset-one-fifth">
    <form @submit.prevent="handleSubmit" class="box is-centered">
      <div class="field column is-half">
        <label for="" class="label">Email</label>
        <div class="control has-icons-right">
          <input type="email" placeholder="e.g. bobsmith@gmail.com" class="input" v-model="email" required>
          <span class="icon is-small is-left">
            <i class="fa fa-envelope"></i>
          </span>
        </div>
      </div>
      <div class="field column is-half">
        <label for="" class="label">Password</label>
        <div class="control has-icons-left">
          <input type="password" placeholder="*******" class="input" v-model="password" required>
          <span class="icon is-small is-left">
            <i class="fa fa-lock"></i>
          </span>
        </div>
      </div>
      <div class="field column is-half is-half-tablet is-half-desktop">
        <label for="" class="checkbox">
          <input type="checkbox">
         Remember me
        </label>
      </div>
      <div class="field column is-half is-half-tablet is-half-desktop">
        <button class="button is-success" style="margin-right: 20px">
          Login
        </button>
        <button class="button is-link is-half-tablet is-half-desktop"  @click="signInWithGoogle">
          Login with google
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Auth1, db } from '../../configs/firebase'
import { doc, query, where, collection, getDocs } from '@firebase/firestore'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = Auth1

//login with google
function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential.accessToken
      const user = result.user
      router.push({
        path: '/' + user.uid
      })
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      const email = error.customData.email
      const credential = GoogleAuthProvider.credentialFromError(error)
    })
}

//login with email
async function handleSubmit() {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user
    console.log('done')

    router.push({
      path: '/' + user.uid
    })

    email.value = ''
    password.value = ''


  } catch (error) {
    console.error(error)
    alert('Đăng nhập không thành công')
    email.value = ''
    password.value = ''
  }
}
</script>

<style>
.field {
  margin-left: 35%;
}
#is-success {
  margin-left: 35%;
}
#is-link {
  margin-left: 5%;
}
#is-info{
  margin-left: 500px;
}
</style>
