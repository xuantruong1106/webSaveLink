<template>
    <div class="container">
      <h1 class="column is-4 title is-2 is-warning is-light button" > LINK NEED PASSWORD</h1>
      <form @submit.prevent="handleSubmitAddLink">
        <div class="columns">
          <div class="column is-four-fifths">
            <input class="input is-primary" type="text" placeholder="Link" v-model="link" />
          </div>
          <div class="column">
            <input class="input is-primary" type="text" placeholder="Title" v-model="title" />
          </div>
        </div>
  
        <div class="columns">
          <div class="column is-two-thirds">
            <input class="input is-primary" type="text" placeholder="describe" v-model="describe" />
          </div>
          <div class="column auto">
            <button class="button is-success">Add</button>
          </div>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter, useRoute } from 'vue-router'
  import { onAuthStateChanged } from 'firebase/auth'
  import { Auth1, db } from '@/configs/firebase'
  import { ref } from 'vue'
  import { setDoc, doc, collection,  serverTimestamp } from 'firebase/firestore'
  const router = useRouter()
  const uid = useRoute().params.uid
  const link = ref('')
  const title = ref('')
  const describe = ref('')
  const date = serverTimestamp()
  
  onAuthStateChanged(Auth1, (user) => {
    if (!user) {
      // Người dùng đã đăng nhập
      router.push({
        path: '/'
      })
    }
  })
  
  const handleSubmitAddLink = async () => {
    const addLink = ref({
      title: title,
      describe: describe,
      link: link,
      uid: uid,
      date: date
    })
    console.log(addLink.value)
    const dataCollection = collection(db, 'dataNeedPassCode')
    await setDoc(doc(dataCollection), addLink.value)
    console.log('add link Successfully!')
  
    return router.push({
      path: '/user/showData/needPass/' + uid
    })
  }
  </script>
  
  <style></style>
  