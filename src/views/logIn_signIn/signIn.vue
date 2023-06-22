<template>
  <div class="column is-6-desktop is-offset-one-fifth is-half" v-if="isUserLoggedIn">
    <form @submit.prevent="signIn" class="box is-centered">
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

      <div class="field column is-half">
        <label for="" class="label">Họ và tên</label>
        <div class="control has-icons-right">
          <input type="text" placeholder="fullname" class="input" v-model="fullname" required />
          <span class="icon is-small is-left">
            <i class="fa fa-envelope"></i>
          </span>
        </div>
      </div>

      <div class="field column is-half">
        <label for="" class="label">Password</label>
        <div class="control has-icons-left">
          <input type="password" placeholder="*******" class="input" v-model="password" required />
          <span class="icon is-small is-left">
            <i class="fa fa-lock"></i>
          </span>
        </div>
      </div>

      <div class="field column is-half">
        <button class="button is-success" style="margin-right: 20px">signIn</button>
        <button class="button is-link" @click="signInWithGoogle">signIn with google</button>
      </div>
    </form>
  </div>
  <div v-if="!isUserLoggedIn">
    <h1>đã đăng nhập</h1>
  </div>
</template>

<script setup lang="ts">
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Auth1, db } from '../../configs/firebase'
import { doc, collection, setDoc, addDoc } from '@firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
const email = ref()
const fullname = ref()
const password = ref()
const router = useRouter()
const auth = Auth1

// sign with google
function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
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

//signIn with email
const signIn = async () => {
  await createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user
      if (fullname.value) {
        const info = {
          fullname: fullname.value,
          uid: user.uid
        }

        const docRef = addDoc(collection(db, 'info'), info)

        console.log('save info done')

        const updateDisplayName = async (displayName) => {
          try {
            await updateProfile(user, { displayName })
            console.log('Display name updated successfully:', displayName)
          } catch (error) {
            console.error('Error updating display name:', error)
          }
        }

        if (!user.displayName) {
          updateDisplayName(fullname.value)
        }

        return router.push({
          path: '/' + user.uid
        })
      } else {
        console.error('Full name is undefined')
      }
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      // ..`
    })
}

//check LogIn
let isUserLoggedIn = false
onAuthStateChanged(Auth1, (user) => {
  if (user) {
    // Người dùng đã đăng nhập
    isUserLoggedIn = true
  } else {
    // Người dùng chưa đăng nhập
    isUserLoggedIn = true
    console.log('Người dùng chưa đăng nhập')
  }
})
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
// // sign in with email // async function signIn() { // await createUserWithEmailAndPassword(Auth1,
email.value, password.value) // .then((userCredential) => { // // Signed in // const user =
userCredential.user // // // Save fullname in Firebase profile // // updateProfile(user, {
displayName: fullname.value }) // // .then(() => { // // console.log('Full name saved to Firebase
profile') // // }) // // .catch((error) => { // // console.error('Error saving full name to Firebase
profile:', error) // // }) // // //sự kiện cofirm // // var result2 = confirm('signIn successfull')
// // if (result2) { // // // Xử lý logic sau khi người dùng nhấn OK // // router.push('/' +
user.uid ) // // // Thêm các lệnh xử lý khác tại đây // // } else { // // // Xử lý logic khi người
dùng nhấn Cancel // // router.push('/' + user.uid) // // // Thêm các lệnh xử lý khác tại đây // // }
// // }) // // .catch((error) => { // // const errorCode = error.code // // const errorMessage =
error.message // // // .. // return router.push({name: 'home'}) // }) // .catch((error) => { //
const errorCode = error.code // const errorMessage = error.message // }) // }
