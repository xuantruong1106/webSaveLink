<template>
  <div class="column is-6-desktop is-offset-one-fifth">
    <form @submit.prevent="handleSubmit" class="box is-centered">
      <!-- Email field -->
      <div class="field column is-half">
        <label for="" class="label">Email</label>
        <div class="control has-icons-right">
          <input type="email" placeholder="e.g. bobsmith@gmail.com" class="input" v-model="email" required>
          <span class="icon is-small is-left">
            <i class="fa fa-envelope"></i>
          </span>
        </div>
      </div>

      <!-- Password field -->
      <div class="field column is-half">
        <label for="" class="label">Password</label>
        <div class="control has-icons-left">
          <input type="password" placeholder="*******" class="input" v-model="password" required>
          <span class="icon is-small is-left">
            <i class="fa fa-lock"></i>
          </span>
        </div>
      </div>

      <!-- Remember me checkbox -->
      <div class="field column is-half is-half-tablet is-half-desktop">
        <label for="" class="checkbox">
          <input type="checkbox" v-model="rememberMe">
          Remember me
        </label>
      </div>

      <!-- Submit buttons -->
      <div class="field column is-half is-half-tablet is-half-desktop">
        <button class="button is-success" style="margin-right: 20px">
          Login
        </button>
        <button class="button is-link is-half-tablet is-half-desktop" @click="signInWithGoogle">
          Login with Google
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
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Auth1, db } from '../../configs/firebase'
import { doc, query, where, collection, getDocs } from '@firebase/firestore'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = Auth1
const rememberMe = ref(false)
const emailVerified = ref(false)

// Load email from storage if rememberMe is enabled
onMounted(() => {
  const storedEmail = localStorage.getItem('rememberedEmail')
  if (storedEmail && rememberMe.value) {
    email.value = storedEmail
  }
})

// Save email to storage if rememberMe is enabled
function saveEmailToStorage() {
  if (rememberMe.value) {
    localStorage.setItem('rememberedEmail', email.value)
  } else {
    localStorage.removeItem('rememberedEmail')
  }
}

// Login with Google
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

// Login with email and password
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
    saveEmailToStorage() // Save email if rememberMe is enabled

    emailVerified.value = user.emailVerified // Check if email is verified
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
#is-info {
  margin-left: 35%;
}
#is-warning {
  margin-left: 35%;
}
</style>
