<template>
  <div class="column is-6-desktop is-offset-one-fifth is-half">
    <form @submit.prevent="saveFullName" class="box is-centered" method="post">
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
        <button class="button is-success" style="margin-right: 20px">signIn</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { db } from '../../configs/firebase'
import { collection, addDoc } from '@firebase/firestore'
import { useRouter } from 'vue-router'

const fullname = ref('')
const router = useRouter()

const saveFullName = async () => {
  if (fullname.value) {
    const info = {
      fullname: fullname.value,
      uid: 'dsfsdsd'
    }

    const docRef = await addDoc(collection(db, 'info'), info)

    console.log('Document written with ID: ', docRef.id)
    console.log('save info done')

    return router.push({
      path: '/' + 'sadassa'
    })
  } else {
    console.error('Full name is undefined')
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
