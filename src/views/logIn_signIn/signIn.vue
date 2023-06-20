<template>
  <div class="formLogIn">
    <form @click.prevent="signIn()">
      <div class="field has-addons">
        <div class="control">
          <input class="input" type="text" placeholder="Email" v-model="email" />
          <strong>
            <h5>
              PassWord defaul is: 123456
            </h5>
          </strong>
          <hr>
          <strong>
            <h5>
              You can update password in profile after login successfull!
            </h5>
          </strong>
        </div>
        <div class="control">
          <button class="button is-info" type="submit">Sign in</button>
        </div>
      </div>
    </form>
   
    <br />
  </div>
  <br />
</template>

<script setup lang="ts">
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Auth1 } from '../../configs/firebase'
const router = useRouter()
const email = ref()

const signIn = async () => {
  console.log(email.value)
  await createUserWithEmailAndPassword(Auth1, email.value, '123456')
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user
      // ...
      return router.push({
        path: '/' + user.uid
      })
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      // ..
    })
}
</script>

<style>
.field {
  margin-left: 35%;
}
</style>
