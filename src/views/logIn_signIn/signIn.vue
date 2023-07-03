<template>
  <div class="column is-6-desktop is-offset-one-fifth is-half">
    <form @submit.prevent="signIn" class="box is-centered" v-if="isUserLoggedIn == false">
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

      <!-- Fullname field -->
      <div class="field column is-half">
        <label for="" class="label">Họ và tên</label>
        <div class="control has-icons-right">
          <input type="text" placeholder="fullname" class="input" v-model="fullname" required />
          <span class="icon is-small is-left">
            <i class="fa fa-envelope"></i>
          </span>
        </div>
      </div>

      <!-- Password field -->
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
    <div v-if="isUserLoggedIn == true">
      <h1>đã đăng nhập</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  createUserWithEmailAndPassword,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendEmailVerification,
  
} from 'firebase/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Auth1, db } from '../../configs/firebase'
import { doc, collection, setDoc, addDoc } from '@firebase/firestore'
import { onAuthStateChanged} from 'firebase/auth'

const email = ref('')
const fullname = ref('')
const password = ref('')
const router = useRouter()
const auth = Auth1
// check LogIn
const isUserLoggedIn = ref(false)
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Người dùng đã đăng nhập
    isUserLoggedIn.value = true
    console.log('Người dùng đã đăng nhập')
  } else {
    // Người dùng chưa đăng nhập
    isUserLoggedIn.value = false
    console.log('Người dùng chưa đăng nhập')
  }
})

console.log(isUserLoggedIn.value)

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

// signIn with email
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

        // Send email verification
        sendEmailVerification(user)
          .then(() => {
            console.log('Email verification sent')
            return router.push({
              path: '/' + user.uid
            })
          })
          .catch((error) => {
            console.error('Error sending email verification:', error)
          })

        if (isSignInWithEmailLink(auth, window.location.href)) {
          // Additional state parameters can also be passed via URL.
          // This can be used to continue the user's intended action before triggering
          // the sign-in operation.
          // Get the email if available. This should be available if the user completes
          // the flow on the same device where they started it.
          let email2 = window.localStorage.getItem('emailForSignIn')
          if (!email) {
            // User opened the link on a different device. To prevent session fixation
            // attacks, ask the user to provide the associated email again. For example:
            email2 = window.prompt('Please provide your email for confirmation')
          }
          // The client SDK will parse the code from the link for you.
          signInWithEmailLink(auth, email2, window.location.href)
            .then((result) => {
              // Clear email from storage.
              window.localStorage.removeItem('emailForSignIn')

              // You can access the new user via result.user
              // Additional user info profile not available via:
              // result.additionalUserInfo.profile == null
              // You can check if the user is new or existing:
              // result.additionalUserInfo.isNewUser
            })
            .catch((error) => {
              // Some error occurred, you can inspect the code: error.code
              // Common errors could be invalid email and invalid or expired OTPs.
            })
        }
      } else {
        console.error('Full name is undefined')
      }
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
#is-success {
  margin-left: 35%;
}
#is-link {
  margin-left: 5%;
}
</style>
