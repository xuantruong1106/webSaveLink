<template>
  <div class="column is-6-desktop is-offset-one-fifth">
    <form class="box is-centered" @submit.prevent="forgotPassword">
      <!-- Email field -->
      <div class="field column is-half">
        <label for="" class="label">Email</label>
        <div class="control has-icons-right">
          <input
            type="email"
            placeholder="e.g. bobsmith@gmail.com"
            class="input"
            v-model="email"
            required
          />
          <span class="icon is-small is-left">
            <i class="fa fa-envelope"></i>
          </span>
        </div>
      </div>
      <div id="btn" class="field column is-half is-half-tablet is-half-desktop">
        <button class="button is-success" style="margin-right: 20px">Send</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { sendPasswordResetEmail, isSignInWithEmailLink } from 'firebase/auth'
import { Auth1 } from '@/configs/firebase'
import { useRouter } from 'vue-router'

const email = ref('')
const router = useRouter()

const forgotPassword = async () => {
  await sendPasswordResetEmail(Auth1, email.value)
    .then(() => {
      // Password reset email sent!
      alert('kiểm tra email để đặt lại mật khẩu')
      email.value = ''
      return router.push({name: 'logIn'})
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      // ..
      console.log(errorCode, errorMessage)
    })
}
</script>

<style scoped>
#btn {
  position: absolute;
  margin-left: 38%;
  margin-top: -5.7%;
}
</style>
