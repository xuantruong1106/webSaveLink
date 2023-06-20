<!-- <template>
  <div class="formLogIn">
    <form  @click.prevent="handleSubmit()">
      <div class="field has-addons">
        <div class="control">
          <input class="input" type="text" placeholder="Email" v-model="email" />
        </div>
        <div class="control">
          <a class="button is-info"> logIn </a>
        </div>
      </div>
    </form>
    <br />
    <div>
      <Router-link to="/signIn" id="is-success" class="button is-success"> Sign in </Router-link>
      <button @click="signInWithGoogle()" class="btn1 button is-link" id="is-link">
        Sign in google
      </button>
    </div>
  </div>
  <br />
</template>

<script setup lang="ts">
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Auth1, db } from '../../configs/firebase'
import { doc, query, where, collection, getDocs } from '@firebase/firestore'
const email = ref()
const router = useRouter()
// onMounted( async () => {
//   this.user = JSON.parse(localStorage.getItem("user")) || [];
// })
function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential.accessToken
      // The signed-in user info.
      const user = result.user
      // IdP data available using getAdditionalUserInfo(result)
      // ...

      // Lưu thông tin đăng nhập vào localStorage
      // this.user.push({
      //   email: this.email,
      //   pass: '123456'
      // })
      // localStorage.setItem('tasks', JSON.stringify(this.user))
      // this.user = ''

      router.push({
        path: '/' + user.uid
      })
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.customData.email
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      // ...
    })
}

const handleSubmit = async () => {
  console.log(email.value)
  try {
    const userCredential = await signInWithEmailAndPassword(Auth1, email.value, '123456')
    const user = userCredential.user
    console.log('done')

    return router.push({
      path: '/' + user.uid
    })
  } catch (error) {
    console.error(error)
    alert('Đăng nhập không thành công')
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
</style> -->


<template>
  <div class="formLogIn">
    <!-- <form @submit.prevent="handleSubmit">
      <div class="field has-addons">
        <div class="control">
          <input class="input" type="text" placeholder="Email" v-model="email" />
        </div>
        <div class="control">
          <button type="submit" class="button is-info">Log In</button>
        </div>
      </div>
    </form> -->
    <br />
    <div>
      <!-- <router-link to="/signIn" id="is-success" class="button is-success">Sign in</router-link> -->
      <button @click="signInWithGoogle" class="btn1 button is-link" id="is-link">
        Sign in with Google
      </button>
    </div>
  </div>
  <br />
</template>

<script setup lang="ts">
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Auth1, db } from '../../configs/firebase'
import { doc, query, where, collection, getDocs } from '@firebase/firestore'

const email = ref('')
const router = useRouter()
const auth = Auth1;
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

async function handleSubmit() {
 
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, '123456')
    const user = userCredential.user
    console.log('done')

    router.push({
      path: '/' + user.uid
    })
  } catch (error) {
    console.error(error)
    alert('Đăng nhập không thành công')
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
</style>
